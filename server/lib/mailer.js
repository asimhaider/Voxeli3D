import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

/** Sends a notification email if SMTP is configured; otherwise just logs and returns. */
export async function notify({ subject, text }) {
  const t = getTransporter();
  if (!t || !process.env.NOTIFY_EMAIL_TO) {
    console.log(`[email skipped — SMTP not configured] ${subject}`);
    return { sent: false };
  }
  try {
    await t.sendMail({
      from: process.env.NOTIFY_EMAIL_FROM || process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL_TO,
      subject,
      text,
    });
    return { sent: true };
  } catch (err) {
    console.error('Email notify failed:', err.message);
    return { sent: false, error: err.message };
  }
}
