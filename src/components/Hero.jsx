import PrintIllustration from './icons/PrintIllustration';

/** Change these three lines to update the headline — each renders as one "printed layer". */
const HEADLINE_LINES = ['3D prints for', 'products, parts', 'and prototypes.'];

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">Voxelis 3D Solutions — Lucknow, India</p>

          <h1 className="hero__headline">
            {HEADLINE_LINES.map((line, i) => (
              <span
                key={line}
                className="hero__line"
                style={{ animationDelay: `${i * 0.18}s` }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p className="hero__sub">
            For makers, homes, schools, and businesses. From a single custom
            idea to production-ready parts, we quote within 24 hours and most
            standard prints are ready in 2–5 days.
          </p>

          <div className="hero__actions">
            <a href="#contact" className="btn btn--primary">Start a project</a>
            <a href="#verticals" className="btn btn--outline">See capabilities</a>
          </div>

          <div className="hero__specs">
            <div><span>What</span>Products, parts & models</div>
            <div><span>Who</span>Individuals & businesses</div>
            <div><span>How fast</span>Quotes in 24 hours</div>
          </div>

          <p className="hero__service-note">
            <strong>Lucknow-based.</strong> Local pickup and delivery available; shipping can be arranged across India.
          </p>
        </div>

        <div className="hero__art">
          <PrintIllustration />
        </div>
      </div>

      <style>{`
        .hero {
          padding-top: clamp(56px, 8vw, 96px);
          padding-bottom: clamp(56px, 8vw, 96px);
          background: var(--color-white);
          border-bottom: 1px solid var(--color-line);
        }
        .hero__inner {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: clamp(32px, 5vw, 64px);
          align-items: center;
        }
        .hero__eyebrow { margin-bottom: 20px; }
        .hero__headline {
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 600;
          line-height: 1.02;
          display: flex;
          flex-direction: column;
        }
        .hero__line {
          opacity: 0;
          transform: translateY(18px);
          animation: layerUp 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
        }
        .hero__line:nth-child(2) { color: var(--color-yellow-dim); }
        @keyframes layerUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .hero__sub {
          margin-top: 24px;
          max-width: 480px;
          font-size: 17px;
          line-height: 1.6;
          color: var(--color-grey);
        }
        .hero__actions {
          display: flex;
          gap: 14px;
          margin-top: 32px;
          flex-wrap: wrap;
        }
        .hero__specs {
          display: flex;
          gap: 32px;
          margin-top: 48px;
          padding-top: 28px;
          border-top: 1px solid var(--color-line);
          flex-wrap: wrap;
        }
        .hero__specs div {
          font-size: 12.5px;
          color: var(--color-grey);
          font-family: var(--font-mono);
        }
        .hero__specs span {
          display: block;
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 600;
          color: var(--color-black);
          margin-bottom: 2px;
        }
        .hero__service-note {
          margin-top: 18px;
          max-width: 520px;
          font-size: 13px;
          line-height: 1.5;
          color: var(--color-grey);
        }
        .hero__service-note strong { color: var(--color-black); }
        .hero__art {
          background: var(--color-cream);
          border-radius: var(--radius-md);
          padding: 24px;
          aspect-ratio: 1 / 1;
        }
        @media (max-width: 900px) {
          .hero__inner { grid-template-columns: 1fr; }
          .hero__art { max-width: 420px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}
