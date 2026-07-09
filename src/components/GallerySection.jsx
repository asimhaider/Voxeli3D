/** Replace `image` with a real <img src="..."> or photo later — placeholders are hand-drawn SVG shapes for now. */
const WORK = [
  {
    tag: 'Rapid prototyping',
    title: 'Drone housing, v3',
    shape: <path d="M20 70 L50 15 L80 70 Z" />,
  },
  {
    tag: 'Industrial spare parts',
    title: 'Pump impeller replacement',
    shape: <circle cx="50" cy="50" r="32" />,
  },
  {
    tag: 'STEM education',
    title: 'Gear-train physics kit',
    shape: <rect x="22" y="22" width="56" height="56" rx="10" />,
  },
];

export default function GallerySection() {
  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <div className="gallery__head">
          <div>
            <p className="eyebrow">Recent work</p>
            <h2 className="gallery__title">Parts we've shipped</h2>
          </div>
          <a href="#contact" className="btn btn--outline">Start your part</a>
        </div>

        <div className="gallery__grid">
          {WORK.map((item) => (
            <div key={item.title} className="gallery__card">
              <svg viewBox="0 0 100 100" className="gallery__shape">
                <g fill="none" stroke="#0B0B0C" strokeWidth="1.6">{item.shape}</g>
              </svg>
              <span className="gallery__tag">{item.tag}</span>
              <h3 className="gallery__card-title">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .gallery { padding: var(--section-pad) 0; }
        .gallery__head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 44px;
          flex-wrap: wrap;
        }
        .gallery__title {
          margin-top: 14px;
          font-size: clamp(28px, 3.6vw, 40px);
          font-weight: 600;
        }
        .gallery__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .gallery__card {
          background: var(--color-cream);
          border-radius: var(--radius-md);
          padding: 28px;
        }
        .gallery__shape {
          width: 100%;
          aspect-ratio: 1 / 1;
          margin-bottom: 20px;
        }
        .gallery__tag {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-grey);
        }
        .gallery__card-title {
          margin-top: 8px;
          font-size: 17px;
          font-weight: 600;
        }
        @media (max-width: 800px) {
          .gallery__grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .gallery__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
