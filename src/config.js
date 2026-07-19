/** Points the frontend at the backend. Override by setting VITE_API_URL
 *  in a .env file (project root) — e.g. VITE_API_URL=https://your-backend.onrender.com */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/** WhatsApp Business number in international format, without +, spaces, or dashes. */
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');

/** Public contact details used by the website contact links. */
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'contact@voxelis3d.in';
export const CONTACT_PHONE = (import.meta.env.VITE_CONTACT_PHONE || WHATSAPP_NUMBER).replace(/\D/g, '');
