import { Router } from 'express';
import path from 'path';
import { nanoid } from 'nanoid';
import { randomBytes } from 'crypto';
import { append, readAll, updateById } from '../lib/db.js';
import { notify } from '../lib/mailer.js';
import { downloadReference, signedReferenceUrl, uploadReference } from '../lib/storage.js';
import { upload } from '../middleware/upload.js';
import { isAdminRequest, requireAdmin } from '../middleware/adminAuth.js';
import { rateLimit, rejectBot } from '../middleware/rateLimit.js';

const router = Router();
const IMAGE_MIME_TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };

function hasPreviewAccess(req, record, { allowQueryToken = false } = {}) {
  const previewToken = req.header('x-preview-token')
    || (allowQueryToken ? req.query.previewToken : undefined);
  return isAdminRequest(req, { allowQueryPassword: allowQueryToken })
    || Boolean(record.previewToken && previewToken === record.previewToken);
}

/**
 * POST /api/custom-orders
 * multipart/form-data: images[] (up to 5), notes, email
 * Saves the request and stores images in a private Supabase Storage bucket.
 */
router.post('/', rateLimit({ windowMs: 30 * 60 * 1000, max: 3, message: 'Too many custom orders. Please try again later.' }), upload.array('images', 5), rejectBot, async (req, res) => {
  const { email, notes } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'At least one image is required' });
  }
  const record = {
    id: nanoid(10),
    type: 'custom-order',
    email,
    notes: notes || '',
    images: await Promise.all(req.files.map(uploadReference)),
    createdAt: new Date().toISOString(),
    meshyTaskId: null,
    previewToken: randomBytes(24).toString('base64url'),
  };
  await append('custom-orders', record);

  res.status(201).json({ ok: true, id: record.id, images: record.images, previewToken: record.previewToken });

  // The order is safely stored before notifying. Keep a slow SMTP server from
  // delaying the customer's confirmation.
  void notify({
    subject: `New custom order — ${email}`,
    text: `Email: ${email}\nNotes: ${notes || '(none)'}\nImages: ${record.images.join(', ')}`,
    replyTo: email,
    idempotencyKey: `custom-order-${record.id}`,
  }).catch((err) => console.error('Custom-order notification failed:', err.message));
});

/** GET /api/custom-orders — listing for you to review submissions. */
router.get('/', requireAdmin, async (req, res) => {
  const records = await readAll('custom-orders');
  const orders = await Promise.all(records.map(async (record) => ({
    ...record,
    imageUrls: await Promise.all(record.images.map((image) => signedReferenceUrl(image))),
  })));
  res.json(orders);
});

/**
 * POST /api/custom-orders/:id/generate-3d
 * Kicks off a Meshy image-to-3D job for one of the already-uploaded images.
 * Requires MESHY_API_KEY to be set — until then this returns a clear 501.
 */
router.post('/:id/generate-3d', async (req, res) => {
  if (!process.env.MESHY_API_KEY) {
    return res.status(501).json({ error: 'MESHY_API_KEY is not set yet — add it to server/.env to enable 3D preview generation' });
  }

  const records = await readAll('custom-orders');
  const record = records.find((r) => r.id === req.params.id);
  if (!record) return res.status(404).json({ error: 'Order not found' });
  if (!hasPreviewAccess(req, record)) return res.status(401).json({ error: 'Unauthorized' });
  if (!record.previewToken) {
    record.previewToken = randomBytes(24).toString('base64url');
    await updateById('custom-orders', record.id, { previewToken: record.previewToken });
  }

  let imageUrl;

  const filename = path.basename(record.images[0]);
  const extension = path.extname(filename).toLowerCase();
  const mimeType = IMAGE_MIME_TYPES[extension];
  if (!mimeType) return res.status(400).json({ error: 'Meshy 3D previews support PNG and JPG images only.' });

  try {
    const image = await downloadReference(record.images[0]);
    imageUrl = `data:${mimeType};base64,${image.toString('base64')}`;
    const meshyRes = await fetch('https://api.meshy.ai/openapi/v1/image-to-3d', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        enable_pbr: true,
        should_remesh: true,
        target_polycount: 30000,
        should_texture: true,
        target_formats: ['glb'],
      }),
    });
    const data = await meshyRes.json();
    if (!meshyRes.ok) return res.status(meshyRes.status).json(data);

    await updateById('custom-orders', record.id, { meshyTaskId: data.result });
    res.status(200).json({ ...data, previewToken: record.previewToken });
  } catch (err) {
    res.status(500).json({ error: 'Could not reach Meshy API' });
  }
});

/**
 * GET /api/custom-orders/generate-3d/:taskId
 * Polls Meshy for job status/result. Same 501 behavior until the key is set.
 */
router.get('/generate-3d/:taskId', async (req, res) => {
  if (!process.env.MESHY_API_KEY) {
    return res.status(501).json({ error: 'MESHY_API_KEY is not set yet — add it to server/.env to enable 3D preview generation' });
  }

  const records = await readAll('custom-orders');
  const record = records.find((item) => item.meshyTaskId === req.params.taskId);
  if (!record || !hasPreviewAccess(req, record)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const meshyRes = await fetch(`https://api.meshy.ai/openapi/v1/image-to-3d/${req.params.taskId}`, {
      headers: { Authorization: `Bearer ${process.env.MESHY_API_KEY}` },
    });
    const data = await meshyRes.json();
    res.status(meshyRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not reach Meshy API' });
  }
});

/**
 * GET /api/custom-orders/generate-3d/:taskId/model
 * Proxies the GLB from Meshy. The asset host does not allow browser CORS requests,
 * so model-viewer must load it through this same-origin endpoint instead.
 */
router.get('/generate-3d/:taskId/model', async (req, res) => {
  if (!process.env.MESHY_API_KEY) {
    return res.status(501).json({ error: 'MESHY_API_KEY is not set yet' });
  }

  const records = await readAll('custom-orders');
  const record = records.find((item) => item.meshyTaskId === req.params.taskId);
  if (!record || !hasPreviewAccess(req, record, { allowQueryToken: true })) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const taskRes = await fetch(`https://api.meshy.ai/openapi/v1/image-to-3d/${req.params.taskId}`, {
      headers: { Authorization: `Bearer ${process.env.MESHY_API_KEY}` },
    });
    const task = await taskRes.json();
    if (!taskRes.ok) return res.status(taskRes.status).json(task);
    if (!task.model_urls?.glb) return res.status(409).json({ error: 'The GLB model is not ready yet' });

    const modelRes = await fetch(task.model_urls.glb);
    if (!modelRes.ok) return res.status(502).json({ error: 'Could not download the generated GLB model' });

    res.set({
      'Content-Type': 'model/gltf-binary',
      'Cache-Control': 'private, max-age=300',
    });
    res.send(Buffer.from(await modelRes.arrayBuffer()));
  } catch {
    res.status(502).json({ error: 'Could not retrieve the generated GLB model' });
  }
});

export default router;
