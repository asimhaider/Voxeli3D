import { Router } from 'express';
import { nanoid } from 'nanoid';
import { append, deleteById, readAll, updateById } from '../lib/db.js';
import { catalogueImageUrl, deleteCatalogueImage, uploadCatalogueImage } from '../lib/storage.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

function text(value) {
  return String(value || '').trim();
}

function validationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function catalogueInput(values, existing = {}) {
  const title = text(values.title ?? existing.title);
  const category = text(values.category ?? existing.category) || 'Popular';
  const material = text(values.material ?? existing.material);
  const size = text(values.size ?? existing.size);
  const price = text(values.price ?? existing.price);
  const turnaround = text(values.turnaround ?? existing.turnaround);

  if (!title || !material || !size || !price || !turnaround) {
    throw validationError('Title, material, size, price, and turnaround are required');
  }

  const displayOrderValue = values.displayOrder ?? values.display_order ?? existing.displayOrder ?? 0;
  const displayOrder = Number(displayOrderValue);
  if (!Number.isFinite(displayOrder) || displayOrder < 0) {
    throw validationError('Display order must be zero or a positive number');
  }

  const availableValue = values.isAvailable ?? values.available ?? existing.isAvailable;
  return {
    title,
    category,
    description: text(values.description ?? existing.description),
    material,
    size,
    price,
    turnaround,
    isAvailable: availableValue === undefined ? true : String(availableValue) !== 'false',
    displayOrder: Math.floor(displayOrder),
  };
}

function apiItem(item) {
  return { ...item, imageUrl: catalogueImageUrl(item.imagePath) };
}

async function findItem(id) {
  const items = await readAll('catalogue-items');
  return items.find((item) => item.id === id);
}

/** Public catalogue: only products marked as available are returned. */
router.get('/', async (req, res) => {
  const items = await readAll('catalogue-items');
  res.json(items.filter((item) => item.isAvailable).map(apiItem));
});

/** Full catalogue, including unavailable products, for the admin panel. */
router.get('/manage', requireAdmin, async (req, res) => {
  const items = await readAll('catalogue-items');
  res.json(items.map(apiItem));
});

router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) throw validationError('A product image is required');
  const input = catalogueInput(req.body || {});
  const imagePath = await uploadCatalogueImage(req.file);
  const now = new Date().toISOString();
  const item = await append('catalogue-items', {
    id: nanoid(10),
    ...input,
    imagePath,
    createdAt: now,
    updatedAt: now,
  });
  res.status(201).json(apiItem(item));
});

router.patch('/:id', requireAdmin, upload.single('image'), async (req, res) => {
  const existing = await findItem(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Catalogue product not found' });

  const input = catalogueInput(req.body || {}, existing);
  const imagePath = req.file ? await uploadCatalogueImage(req.file) : existing.imagePath;
  const updated = await updateById('catalogue-items', existing.id, {
    ...input,
    imagePath,
    updatedAt: new Date().toISOString(),
  });

  if (req.file && existing.imagePath !== imagePath) {
    deleteCatalogueImage(existing.imagePath).catch((error) => console.error('Could not remove replaced catalogue image:', error.message));
  }
  res.json(apiItem(updated));
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const deleted = await deleteById('catalogue-items', req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Catalogue product not found' });
  deleteCatalogueImage(deleted.imagePath).catch((error) => console.error('Could not remove catalogue image:', error.message));
  return res.status(204).end();
});

export default router;
