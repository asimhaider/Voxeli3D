export default function VerticalCard({ icon, tag, title, description, href = '#contact' }) {
  return (
    <a href={href} className="vcard">
      <div className="vcard__top">
        <div className="vcard__icon">{icon}</div>
        <span className="vcard__tag">{tag}</span>
      </div>
      <h3 className="vcard__title">{title}</h3>
      <p className="vcard__desc">{description}</p>
      <span className="vcard__arrow">Explore &rarr;</span>

      <style>{`
        .vcard {
          display: flex;
          flex-direction: column;
          padding: 28px;
          border: 1px solid var(--color-line);
          border-radius: var(--radius-md);
          background: var(--color-white);
          transition: border-color 0.18s ease, transform 0.18s ease;
        }
        .vcard:hover {
          border-color: var(--color-yellow);
          transform: translateY(-3px);
        }
        .vcard__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .vcard__icon {
          width: 52px;
          height: 52px;
          border-radius: 8px;
          background: var(--color-cream);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vcard__tag {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-grey);
        }
        .vcard__title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .vcard__desc {
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--color-grey);
          flex: 1;
        }
        .vcard__arrow {
          margin-top: 20px;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--color-black);
        }
      `}</style>
    </a>
  );
}
