import { useState } from 'react';
import { API_URL } from '../config';

export default function CTASection() {
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim();
    const whatsapp = form.whatsapp.value.trim();
    const message = form.message.value.trim();
    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/api/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, whatsapp, message, website: form.website.value }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Could not send your quote request');
      }
      setStatus('done');
      form.reset();
    } catch (err) {
      setStatus(err.message || 'Could not reach the quote service. Please try again.');
    }
  };

  return (
    <section id="contact" className="cta">
      <div className="container cta__inner">
        <h2 className="cta__title">Have a part in mind?</h2>
        <p className="cta__sub">Send us your file or idea — we'll come back with material options, pricing, and a lead time within 24 hours.</p>

        {status === 'done' ? (
          <p className="cta__confirm">Thanks — we'll be in touch shortly.</p>
        ) : (
          <form className="cta__form" onSubmit={handleSubmit}>
            <input className="form-honeypot" name="website" type="text" tabIndex="-1" autoComplete="off" aria-hidden="true" />
            <input name="email" type="email" required placeholder="you@company.com" aria-label="Email address" />
            <input name="whatsapp" type="tel" required placeholder="WhatsApp number" aria-label="WhatsApp number" />
            <textarea name="message" placeholder="Tell us about your enquiry (optional)" aria-label="Enquiry" rows={3} />
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
        .form-honeypot { position: absolute !important; width: 1px !important; height: 1px !important; overflow: hidden !important; opacity: 0 !important; pointer-events: none !important; }
        .cta__confirm { margin-top: 28px; font-weight: 600; font-size: 15px; }
        .cta__error { margin-top: 16px; font-size: 13.5px; color: rgba(11,11,12,0.7); }
      `}</style>
    </section>
  );
}
