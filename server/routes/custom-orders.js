import { Router } from 'express';
import { nanoid } from 'nanoid';
import { append, readAll, updateById } from '../lib/db.js';
import { notify } from '../lib/mailer.js';
import { upload } from '../middleware/upload.js';

const router = Router();

/**
 * POST /api/custom-orders
 * multipart/form-data: images[] (up to 5), notes, email
 * Saves the request + stores images on disk under /uploads.
 */
router.post('/', upload.array('images', 5), async (req, res) => {
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
    images: req.files.map((f) => `/uploads/${f.filename}`),
    createdAt: new Date().toISOString(),
    meshyTaskId: null,
  };
  await append('custom-orders', record);

  await notify({
    subject: `New custom order — ${email}`,
    text: `Email: ${email}\nNotes: ${notes || '(none)'}\nImages: ${record.images.join(', ')}`,
  });

  res.status(201).json({ ok: true, id: record.id, images: record.images });
});

/** GET /api/custom-orders — listing for you to review submissions. */
router.get('/', async (req, res) => {
  const records = await readAll('custom-orders');
  res.json(records);
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

  const { imageUrl } = req.body || {};
  if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required — pass a publicly accessible URL or base64 data URI' });

  try {
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
    res.status(200).json(data); // { result: "<taskId>" }
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

export default router;
