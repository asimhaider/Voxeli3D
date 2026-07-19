/** Send transactional email over HTTPS so it works on Render's Free tier. */
export async function notify({ subject, text, replyTo, idempotencyKey }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_EMAIL_FROM;
  const to = process.env.NOTIFY_EMAIL_TO;
  if (!apiKey || !from || !to) {
    return { sent: false, error: 'Resend is not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'voxelis-backend/1.0',
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) return { sent: false, error: body.message || `Resend returned ${response.status}` };
    return { sent: true, id: body.id };
  } catch (err) {
    console.error('Email notify failed:', err.message);
    return { sent: false, error: err.message };
  }
}
