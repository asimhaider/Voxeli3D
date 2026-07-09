/** Edit this array to change the workflow steps — numbering is generated automatically. */
const STEPS = [
  { title: 'Upload', detail: 'Send your CAD file, sketch, or reference photo — no design experience needed.' },
  { title: 'Slice', detail: 'We select material, layer height, and infill for strength, finish, or speed.' },
  { title: 'Print', detail: 'Your part builds layer by layer on our farm, with in-process quality checks.' },
  { title: 'Deliver', detail: 'Post-processed, inspected, and shipped — or ready for pickup in Lucknow.' },
];

export default function ProcessSection() {
  return (
    <section id="process" className="process">
      <div className="container">
        <p className="eyebrow eyebrow--on-dark">How an order runs</p>
        <h2 className="process__title">From file to finished part in four steps</h2>

        <ol className="process__list">
          {STEPS.map((step, i) => (
            <li key={step.title} className="process__step">
              <span className="process__num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="process__step-title">{step.title}</h3>
                <p className="process__step-detail">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <style>{`
        .process {
          background: var(--color-black);
          color: var(--color-white);
          padding: var(--section-pad) 0;
        }
        .process__title {
          margin-top: 14px;
          font-size: clamp(28px, 3.6vw, 40px);
          font-weight: 600;
          max-width: 620px;
        }
        .process__list {
          list-style: none;
          margin: 56px 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .process__step {
          padding: 0 24px 0 0;
          border-left: 1px solid var(--color-line-on-dark);
          padding-left: 24px;
        }
        .process__num {
          display: block;
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-yellow);
          margin-bottom: 18px;
        }
        .process__step-title {
          font-size: 19px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .process__step-detail {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255,255,255,0.62);
        }
        @media (max-width: 900px) {
          .process__list { grid-template-columns: repeat(2, 1fr); gap: 32px 0; }
        }
        @media (max-width: 560px) {
          .process__list { grid-template-columns: 1fr; gap: 28px 0; }
        }
      `}</style>
    </section>
  );
}
