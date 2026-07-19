import { CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_NUMBER } from '../config';

const WHATSAPP_MESSAGE = 'Hi Voxelis, I would like to discuss a 3D printing project.';

function formatPhone(number) {
  if (!number) return 'Contact us';
  return `+${number}`;
}

export default function ContactStrip() {
  const phone = formatPhone(CONTACT_PHONE);
  const whatsappHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    : '#contact';

  return (
    <section className="contact-strip" aria-label="Quick contact options">
      <div className="container contact-strip__inner">
        <p className="contact-strip__intro">
          <strong>Based in Lucknow.</strong> Local pickup & delivery, with shipping available across India.
        </p>
        <div className="contact-strip__links">
          <a href={CONTACT_PHONE ? `tel:+${CONTACT_PHONE}` : '#contact'}>
            <span>Call</span>{phone}
          </a>
          <a href={whatsappHref} target={WHATSAPP_NUMBER ? '_blank' : undefined} rel={WHATSAPP_NUMBER ? 'noopener noreferrer' : undefined}>
            <span>WhatsApp</span>Chat now
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`}>
            <span>Email</span>{CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <style>{`
        .contact-strip { background: var(--color-black); color: var(--color-white); }
        .contact-strip__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding-top: 17px;
          padding-bottom: 17px;
        }
        .contact-strip__intro { font-size: 13px; line-height: 1.5; color: rgba(255,255,255,0.72); }
        .contact-strip__intro strong { color: var(--color-white); }
        .contact-strip__links { display: flex; flex-wrap: wrap; gap: 24px; }
        .contact-strip__links a { display: flex; align-items: baseline; gap: 7px; font-size: 13px; font-weight: 600; }
        .contact-strip__links a:hover { color: var(--color-yellow); }
        .contact-strip__links span {
          color: var(--color-yellow);
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        @media (max-width: 800px) {
          .contact-strip__inner { align-items: flex-start; flex-direction: column; }
          .contact-strip__links { gap: 16px 22px; }
        }
      `}</style>
    </section>
  );
}
