import { Router } from 'express';
import { nanoid } from 'nanoid';
import { append, readAll } from '../lib/db.js';
import { notify } from '../lib/mailer.js';
// import { requireAdmin } from '../middleware/admin.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

/** POST /api/quotes — from the bottom CTA form (contact details and enquiry). */
router.post('/', async (req, res) => {
  const { email, whatsapp, message } = req.body || {};
  const emailValue = String(email || '').trim();
  const whatsappValue = String(whatsapp || '').trim();
  if (!emailValue) return res.status(400).json({ error: 'Email is required' });
  if (!whatsappValue) return res.status(400).json({ error: 'WhatsApp number is required' });

  const record = {
    id: nanoid(10),
    type: 'quote',
    email: emailValue,
    whatsapp: whatsappValue,
    message: message || '',
    createdAt: new Date().toISOString(),
  };
  await append('quotes', record);

  await notify({
    subject: `New quote request — ${emailValue}`,
    text: `Email: ${emailValue}\nWhatsApp: ${whatsappValue}\n\nEnquiry: ${message || '(none)'}`,
  });

  res.status(201).json({ ok: true, id: record.id });
});

/** GET /api/quotes — simple listing for you to check submissions (add auth before going live). */
router.get('/', requireAdmin, async (req, res) => {
  const records = await readAll('quotes');
  res.json(records);
});

export default router;
