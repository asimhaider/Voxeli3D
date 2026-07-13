import { Router } from 'express';
import { nanoid } from 'nanoid';
import { append, readAll } from '../lib/db.js';
import { notify } from '../lib/mailer.js';
import { requireAdmin } from '../middleware/admin.js';

const router = Router();

/** POST /api/quotes — from the bottom CTA form (email only, no images). */
router.post('/', async (req, res) => {
  const { email, message } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const record = {
    id: nanoid(10),
    type: 'quote',
    email,
    message: message || '',
    createdAt: new Date().toISOString(),
  };
  await append('quotes', record);

  await notify({
    subject: `New quote request — ${email}`,
    text: `Email: ${email}\n\nMessage: ${message || '(none)'}`,
  });

  res.status(201).json({ ok: true, id: record.id });
});

/** GET /api/quotes — simple listing for you to check submissions (add auth before going live). */
router.get('/', requireAdmin, async (req, res) => {
  const records = await readAll('quotes');
  res.json(records);
});

export default router;
