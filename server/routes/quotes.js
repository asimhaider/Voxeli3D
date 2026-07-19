import { Router } from 'express';
import { nanoid } from 'nanoid';
import { append, readAll, updateById } from '../lib/db.js';
import { notify } from '../lib/mailer.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { rateLimit, rejectBot } from '../middleware/rateLimit.js';

const router = Router();

/** POST /api/quotes — from the bottom CTA form (contact details and enquiry). */
router.post('/', rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many quote requests. Please try again later.' }), rejectBot, async (req, res) => {
  const { email, whatsapp, message } = req.body || {};
  const emailValue = String(email || '').trim();
  const whatsappValue = String(whatsapp || '').replace(/\D/g, '');
  if (!/^\S+@\S+\.\S+$/.test(emailValue)) return res.status(400).json({ error: 'Enter a valid email address' });
  if (whatsappValue.length < 7 || whatsappValue.length > 15) return res.status(400).json({ error: 'Enter a valid WhatsApp number' });

  const record = {
    id: nanoid(10),
    type: 'quote',
    email: emailValue,
    whatsapp: whatsappValue,
    message: message || '',
    createdAt: new Date().toISOString(),
    emailNotification: { status: 'pending', updatedAt: null },
  };
  await append('quotes', record);

  res.status(201).json({ ok: true, id: record.id });

  // Do not make the visitor wait for an external mail server. The enquiry is
  // already stored, and delivery failures are logged for follow-up.
  void notify({
    subject: `New quote request — ${emailValue}`,
    text: `Email: ${emailValue}\nWhatsApp: ${whatsappValue}\n\nEnquiry: ${message || '(none)'}`,
    replyTo: emailValue,
    idempotencyKey: `quote-${record.id}`,
  })
    .then((result) => updateById('quotes', record.id, {
      emailNotification: {
        status: result.sent ? 'sent' : 'failed',
        updatedAt: new Date().toISOString(),
        error: result.error || null,
        providerId: result.id || null,
      },
    }))
    .catch(async (err) => {
      console.error('Quote notification failed:', err.message);
      await updateById('quotes', record.id, {
        emailNotification: {
          status: 'failed',
          updatedAt: new Date().toISOString(),
          error: err.message,
        },
      });
    });
});

/** GET /api/quotes — simple listing for you to check submissions (add auth before going live). */
router.get('/', requireAdmin, async (req, res) => {
  const records = await readAll('quotes');
  res.json(records);
});

export default router;
