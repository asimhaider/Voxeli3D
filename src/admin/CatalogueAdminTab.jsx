import { useState } from 'react';
import { API_URL } from '../config';

const EMPTY_FORM = {
  title: '',
  category: 'Trending',
  description: '',
  material: 'PLA+',
  size: '',
  price: '',
  turnaround: '2–3 days',
  displayOrder: '0',
  isAvailable: true,
};

function formFor(item) {
  if (!item) return EMPTY_FORM;
  return {
    title: item.title || '',
    category: item.category || 'Trending',
    description: item.description || '',
    material: item.material || '',
    size: item.size || '',
    price: item.price || '',
    turnaround: item.turnaround || '',
    displayOrder: String(item.displayOrder ?? 0),
    isAvailable: Boolean(item.isAvailable),
  };
}

export default function CatalogueAdminTab({ items, onRefresh }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const beginEdit = (item) => {
    setEditing(item);
    setForm(formFor(item));
    setImage(null);
    setStatus(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImage(null);
    setStatus(null);
  };

  const save = async (event) => {
    event.preventDefault();
    if (!editing && !image) {
      setStatus({ type: 'error', text: 'Choose a product image before saving.' });
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, String(value)));
      if (image) body.append('image', image);

      const response = await fetch(
        editing ? `${API_URL}/api/catalogue/${editing.id}` : `${API_URL}/api/catalogue`,
        { method: editing ? 'PATCH' : 'POST', body, credentials: 'include' },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not save the catalogue product');

      await onRefresh();
      setStatus({ type: 'success', text: editing ? 'Product updated.' : 'Product added to the catalogue.' });
      if (!editing) {
        setForm(EMPTY_FORM);
        setImage(null);
      }
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Could not save the catalogue product' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Remove “${item.title}” from the catalogue?`)) return;
    setStatus(null);
    try {
      const response = await fetch(`${API_URL}/api/catalogue/${item.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Could not remove the product');
      }
      if (editing?.id === item.id) cancelEdit();
      await onRefresh();
      setStatus({ type: 'success', text: 'Product removed.' });
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Could not remove the product' });
    }
  };

  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="catalogue-admin">
      <section className="catalogue-admin__editor">
        <div className="catalogue-admin__editor-head">
          <div>
            <p className="eyebrow">Catalogue manager</p>
            <h2>{editing ? `Edit: ${editing.title}` : 'Add a catalogue product'}</h2>
          </div>
          {editing && <button type="button" className="catalogue-admin__text-button" onClick={cancelEdit}>Add new instead</button>}
        </div>

        <form onSubmit={save} className="catalogue-admin__form">
          <label>Product name<input name="title" value={form.title} onChange={update} required /></label>
          <label>Category<input name="category" value={form.category} onChange={update} required /></label>
          <label className="catalogue-admin__wide">Description<textarea name="description" value={form.description} onChange={update} rows={3} /></label>
          <label>Material<input name="material" value={form.material} onChange={update} required /></label>
          <label>Approx. size<input name="size" value={form.size} onChange={update} required placeholder="e.g. 18 cm" /></label>
          <label>Starting price<input name="price" value={form.price} onChange={update} required placeholder="e.g. ₹249" /></label>
          <label>Typical turnaround<input name="turnaround" value={form.turnaround} onChange={update} required placeholder="e.g. 2–3 days" /></label>
          <label>Display order<input name="displayOrder" type="number" min="0" step="1" value={form.displayOrder} onChange={update} required /></label>
          <label className="catalogue-admin__image-input">Product image<input name="image" type="file" accept="image/png,image/jpeg" onChange={(event) => setImage(event.target.files?.[0] || null)} required={!editing} /><small>{image ? image.name : editing ? 'Leave empty to keep the current image.' : 'PNG or JPG, up to 8 MB.'}</small></label>
          <label className="catalogue-admin__availability"><input name="isAvailable" type="checkbox" checked={form.isAvailable} onChange={update} /> Show this product on the website</label>
          <div className="catalogue-admin__actions">
            <button className="btn btn--primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add product'}</button>
            {editing && <button type="button" className="btn btn--outline" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
        {status && <p className={`catalogue-admin__status catalogue-admin__status--${status.type}`}>{status.text}</p>}
      </section>

      <section className="catalogue-admin__list">
        <div className="catalogue-admin__list-head"><h2>Products ({safeItems.length})</h2><p>Unavailable products are saved but hidden from the website.</p></div>
        {safeItems.length === 0 ? <p className="admin-empty">No products yet. Add your first product above.</p> : (
          <div className="catalogue-admin__grid">
            {safeItems.map((item) => (
              <article key={item.id} className={`catalogue-admin__card ${item.isAvailable ? '' : 'catalogue-admin__card--hidden'}`}>
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} />}
                <div className="catalogue-admin__card-body">
                  <p className="catalogue-admin__category">{item.category}</p>
                  <h3>{item.title}</h3>
                  <p className="catalogue-admin__details">{item.price} · {item.size} · {item.material}</p>
                  <p className="catalogue-admin__details">{item.turnaround} · Order {item.displayOrder}</p>
                  {!item.isAvailable && <p className="catalogue-admin__hidden-label">Hidden from website</p>}
                  <div className="catalogue-admin__card-actions"><button type="button" onClick={() => beginEdit(item)}>Edit</button><button type="button" className="catalogue-admin__delete" onClick={() => remove(item)}>Remove</button></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .catalogue-admin { display: grid; gap: 36px; }
        .catalogue-admin__editor { border: 1px solid var(--color-line); border-radius: var(--radius-md); padding: clamp(18px, 3vw, 28px); }
        .catalogue-admin__editor-head { display: flex; justify-content: space-between; gap: 18px; align-items: flex-start; margin-bottom: 22px; }
        .catalogue-admin h2 { font-size: 20px; margin-top: 8px; }
        .catalogue-admin__text-button, .catalogue-admin__card-actions button { padding: 0; border: 0; background: none; font: inherit; font-size: 13px; font-weight: 600; text-decoration: underline; }
        .catalogue-admin__form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .catalogue-admin__form label { display: flex; flex-direction: column; gap: 7px; color: var(--color-grey); font-size: 12px; font-weight: 600; }
        .catalogue-admin__form input:not([type='checkbox']), .catalogue-admin__form textarea { width: 100%; border: 1px solid var(--color-grey-light); border-radius: var(--radius-sm); padding: 10px 12px; color: var(--color-black); font: inherit; font-size: 14px; background: var(--color-white); }
        .catalogue-admin__form textarea { resize: vertical; }
        .catalogue-admin__form small { color: var(--color-grey); font-size: 11px; font-weight: 400; }
        .catalogue-admin__wide, .catalogue-admin__image-input, .catalogue-admin__availability, .catalogue-admin__actions { grid-column: 1 / -1; }
        .catalogue-admin__availability { flex-direction: row !important; align-items: center; color: var(--color-black) !important; }
        .catalogue-admin__availability input { width: 16px; height: 16px; }
        .catalogue-admin__actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
        .catalogue-admin__status { margin-top: 16px; padding: 10px 12px; border-radius: var(--radius-sm); font-size: 13px; }
        .catalogue-admin__status--success { color: #167343; background: #E9F8EE; }
        .catalogue-admin__status--error { color: #B3261E; background: #FDECEA; }
        .catalogue-admin__list-head { display: flex; gap: 18px; justify-content: space-between; align-items: baseline; margin-bottom: 16px; }
        .catalogue-admin__list-head p { color: var(--color-grey); font-size: 13px; }
        .catalogue-admin__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        .catalogue-admin__card { overflow: hidden; border: 1px solid var(--color-line); border-radius: var(--radius-md); background: var(--color-white); }
        .catalogue-admin__card--hidden { opacity: 0.62; }
        .catalogue-admin__card img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: var(--color-cream); }
        .catalogue-admin__card-body { padding: 14px; }
        .catalogue-admin__category { color: var(--color-grey); font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.07em; text-transform: uppercase; }
        .catalogue-admin__card h3 { margin-top: 6px; font-size: 16px; }
        .catalogue-admin__details { margin-top: 7px; color: var(--color-grey); font-size: 12px; line-height: 1.4; }
        .catalogue-admin__hidden-label { margin-top: 10px; color: #B3261E; font-size: 12px; font-weight: 600; }
        .catalogue-admin__card-actions { display: flex; gap: 16px; margin-top: 15px; }
        .catalogue-admin__delete { color: #B3261E; }
        @media (max-width: 640px) { .catalogue-admin__form { grid-template-columns: 1fr; } .catalogue-admin__list-head { align-items: flex-start; flex-direction: column; } }
      `}</style>
    </div>
  );
}
