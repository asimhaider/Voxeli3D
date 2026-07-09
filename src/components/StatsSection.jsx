const STATS = [
  { value: '0.1mm', label: 'Minimum layer height' },
  { value: '30+', label: 'Materials on hand' },
  { value: '24hr', label: 'Average quote time' },
  { value: '4', label: 'Manufacturing verticals' },
];

export default function StatsSection() {
  return (
    <section className="stats">
      <div className="container stats__grid">
        {STATS.map((s) => (
          <div key={s.label} className="stats__item">
            <span className="stats__value">{s.value}</span>
            <span className="stats__label">{s.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        .stats {
          padding: 56px 0;
          border-bottom: 1px solid var(--color-line);
        }
        .stats__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .stats__item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .stats__value {
          font-family: var(--font-display);
          font-size: clamp(26px, 3vw, 34px);
          font-weight: 600;
          color: var(--color-black);
        }
        .stats__label {
          font-size: 13px;
          color: var(--color-grey);
        }
        @media (max-width: 700px) {
          .stats__grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
