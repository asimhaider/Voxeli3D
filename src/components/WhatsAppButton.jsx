import { WHATSAPP_NUMBER } from '../config';

const DEFAULT_MESSAGE = 'Hi Voxelis, I would like a quote for a 3D printing project.';

export default function WhatsAppButton() {
  if (!WHATSAPP_NUMBER) return null;

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      className="whatsapp-button"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Voxelis on WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M16 3a13 13 0 0 0-11.1 19.8L3 29l6.4-1.7A13 13 0 1 0 16 3Zm0 23.7a10.7 10.7 0 0 1-5.4-1.5l-.4-.2-3.8 1 1-3.7-.3-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.3-.6.1a8.7 8.7 0 0 1-2.6-1.6 9.8 9.8 0 0 1-1.8-2.3c-.2-.3 0-.4.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.3c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.5s-1.2 1.2-1.2 3 .1 2.6 1.3 4.1a12.4 12.4 0 0 0 4.7 4.2c.7.3 1.3.5 1.7.7.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2.1-1.4s.3-1.3.2-1.4-.2-.2-.5-.4Z" />
      </svg>
      <span>WhatsApp us</span>
    </a>
  );
}
