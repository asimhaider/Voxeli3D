export default function QuotesTab({ quotes }) {
  const safeQuotes = Array.isArray(quotes) ? quotes : [];

  if (safeQuotes.length === 0) {
    return <p className="admin-empty">No quote requests yet.</p>;
  }

  return (
    <div className="admin-table">
      <div className="admin-table__row admin-table__row--head">
        <span>Email</span>
        <span>Message</span>
        <span>Received</span>
      </div>
      {safeQuotes
        .slice()
        .reverse()
        .map((q) => (
          <div key={q.id} className="admin-table__row">
            <span><a href={`mailto:${q.email}`}>{q.email}</a></span>
            <span>{q.message || <em>(no message)</em>}</span>
            <span>{new Date(q.createdAt).toLocaleString()}</span>
          </div>
        ))}

      <style>{`
        .admin-empty { color: var(--color-grey); font-size: 14px; }
        .admin-table { display: flex; flex-direction: column; border: 1px solid var(--color-line); border-radius: var(--radius-md); overflow: hidden; }
        .admin-table__row {
          display: grid;
          grid-template-columns: 1fr 1.6fr 1fr;
          gap: 16px;
          padding: 14px 18px;
          font-size: 13.5px;
          border-top: 1px solid var(--color-line);
        }
        .admin-table__row:first-child { border-top: none; }
        .admin-table__row--head {
          background: var(--color-cream);
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-grey);
        }
        .admin-table__row a { font-weight: 600; }
      `}</style>
    </div>
  );
}
