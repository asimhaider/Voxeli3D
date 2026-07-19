export default function CatalogueCard({ image, shape, category, title, description, priceRange, material, size, turnaround, onRequest }) {
    return (
        <div className="ccard">
            <div className="ccard__thumb">
                {image ? (
                    <img src={image} alt={title} className="ccard__photo" />
                ) : (
                    <svg viewBox="0 0 120 120" className="ccard__shape">
                        <g fill="none" stroke="#0B0B0C" strokeWidth="1.6">{shape}</g>
                    </svg>
                )}
                <span className="ccard__category">{category}</span>
            </div>

            <div className="ccard__body">
                <h3 className="ccard__title">{title}</h3>
                <p className="ccard__desc">{description}</p>

                <div className="ccard__meta">
                    <div>
                        <span className="ccard__meta-label">Material</span>
                        <span className="ccard__meta-value">{material}</span>
                    </div>
                    <div>
                        <span className="ccard__meta-label">Approx. size</span>
                        <span className="ccard__meta-value">{size}</span>
                    </div>
                    <div>
                        <span className="ccard__meta-label">Starting at</span>
                        <span className="ccard__meta-value ccard__price">{priceRange}</span>
                    </div>
                    <div>
                        <span className="ccard__meta-label">Ready in</span>
                        <span className="ccard__meta-value">{turnaround}</span>
                    </div>
                </div>

                <button type="button" className="ccard__cta" onClick={() => onRequest?.({ title, material, size, priceRange, turnaround })}>
                    Request this &rarr;
                </button>
            </div>

            <style>{`
        .ccard {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--color-line);
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--color-white);
          transition: border-color 0.18s ease, transform 0.18s ease;
        }
        .ccard:hover { border-color: var(--color-yellow); transform: translateY(-3px); }
        .ccard__thumb {
          position: relative;
          background: var(--color-cream);
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0px;
        }
        .ccard__photo { width: 100%; height: 100%; object-fit: cover; border-radius: 0px; }
        .ccard__shape { width: 70%; height: 70%; }
        .ccard__category {
          position: absolute;
          top: 12px;
          left: 12px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--color-black);
          color: var(--color-white);
          padding: 4px 9px;
          border-radius: 20px;
        }
        .ccard__body { padding: 20px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .ccard__title { font-size: 17px; font-weight: 600; }
        .ccard__desc { font-size: 13.5px; line-height: 1.55; color: var(--color-grey); flex: 1; }
        .ccard__meta {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px 14px;
          padding-top: 12px;
          border-top: 1px solid var(--color-line);
        }
        .ccard__meta-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--color-grey);
          margin-bottom: 3px;
        }
        .ccard__meta-value { font-size: 13.5px; font-weight: 600; }
        .ccard__price { color: var(--color-yellow-dim); }
        .ccard__cta {
          margin-top: 4px;
          padding: 0;
          border: 0;
          background: transparent;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--color-black);
          text-align: left;
        }
        .ccard__cta:hover { color: var(--color-yellow-dim); }
      `}</style>
        </div>
    );
}
