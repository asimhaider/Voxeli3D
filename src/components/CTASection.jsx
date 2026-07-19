import { useEffect, useState } from 'react';
import { API_URL } from '../config';

const EMPTY_FORM = { email: '', whatsapp: '', message: '', website: '' };

export default function CTASection({ selectedProduct, onProductCleared }) {
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!selectedProduct) return;
    const { title, material, size, priceRange, turnaround } = selectedProduct;
    setFormData((current) => ({
      ...current,
      message: `I'm interested in the ${title} (${size}, ${material}, starting at ${priceRange}, typically ${turnaround}). Please share availability and delivery details.`,
    }));
    setStatus('idle');
  }, [selectedProduct]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email.trim();
    const whatsapp = formData.whatsapp.trim();
    const message = formData.message.trim();
    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/api/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, whatsapp, message, website: formData.website }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Could not send your quote request');
      }
      setStatus('done');
      setFormData(EMPTY_FORM);
      onProductCleared?.();
    } catch (err) {
      setStatus(err.message || 'Could not reach the quote service. Please try again.');
    }
  };

  return (
    <section id="contact" className="cta">
      <div className="container cta__inner">
        <h2 className="cta__title">Have a part in mind?</h2>
        <p className="cta__sub">Send us your file or idea — we'll come back with material options, pricing, and a lead time within 24 hours.</p>
        {selectedProduct && (
          <p className="cta__selection">Requesting: <strong>{selectedProduct.title}</strong></p>
        )}

        {status === 'done' ? (
          <p className="cta__confirm">Thanks — we'll be in touch shortly.</p>
        ) : (
          <form className="cta__form" onSubmit={handleSubmit}>
            <input className="form-honeypot" name="website" type="text" value={formData.website} onChange={updateField} tabIndex="-1" autoComplete="off" aria-hidden="true" />
            <input name="email" type="email" required placeholder="you@company.com" aria-label="Email address" value={formData.email} onChange={updateField} />
            <input name="whatsapp" type="tel" required placeholder="WhatsApp number" aria-label="WhatsApp number" value={formData.whatsapp} onChange={updateField} />
            <textarea name="message" placeholder="Tell us about your enquiry (optional)" aria-label="Enquiry" rows={3} value={formData.message} onChange={updateField} />
            <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Request a quote'}
            </button>
          </form>
        )}
        {status !== 'idle' && status !== 'sending' && status !== 'done' && (
          <p className="cta__error">{status}</p>
        )}
      </div>

      <style>{`
        .cta {
          background: var(--color-yellow);
          padding: var(--section-pad) 0;
        }
        .cta__inner {
          max-width: 620px;
          text-align: center;
          margin: 0 auto;
        }
        .cta__title {
          font-size: clamp(30px, 4vw, 44px);
          font-weight: 600;
        }
        .cta__sub {
          margin-top: 16px;
          font-size: 16px;
          color: rgba(11,11,12,0.7);
          line-height: 1.6;
        }
        .cta__form {
          margin-top: 32px;
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-direction: column;
          align-items: center;
        }
        .cta__form input {
          width: 100%;
          max-width: 420px;
          padding: 14px 18px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--color-black);
          font-size: 14px;
          background: var(--color-white);
        }
        .cta__form textarea {
          width: 100%;
          max-width: 420px;
          padding: 14px 18px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--color-black);
          font: inherit;
          font-size: 14px;
          resize: vertical;
        }
        .cta__form input:focus, .cta__form textarea:focus {
          outline: 2px solid var(--color-black);
          outline-offset: 2px;
        }
        .cta__selection {
          display: inline-block;
          margin-top: 18px;
          padding: 8px 12px;
          border: 1px solid rgba(11,11,12,0.25);
          border-radius: 999px;
          font-size: 13px;
        }
        .form-honeypot { position: absolute !important; width: 1px !important; height: 1px !important; overflow: hidden !important; opacity: 0 !important; pointer-events: none !important; }
        .cta__confirm { margin-top: 28px; font-weight: 600; font-size: 15px; }
        .cta__error { margin-top: 16px; font-size: 13.5px; color: rgba(11,11,12,0.7); }
      `}</style>
    </section>
  );
}
