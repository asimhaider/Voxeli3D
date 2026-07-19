import { useState } from 'react';
import { API_URL } from '../config';

const POLL_INTERVAL_MS = 4000;

export default function OrdersTab({ orders }) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const [previews, setPreviews] = useState({}); // orderId -> { status, progress, modelUrl, error }

  const setPreview = (orderId, patch) => {
    setPreviews((prev) => ({ ...prev, [orderId]: { ...prev[orderId], ...patch } }));
  };

  const generate = async (order) => {
    setPreview(order.id, { status: 'PENDING', progress: 0, error: null, modelUrl: null });
    try {
      const res = await fetch(`${API_URL}/api/custom-orders/${order.id}/generate-3d`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not start generation');
      poll(order.id, data.result);
    } catch (err) {
      setPreview(order.id, { error: err.message });
    }
  };

  const poll = (orderId, taskId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/custom-orders/generate-3d/${taskId}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Status check failed');

        setPreview(orderId, { status: data.status, progress: data.progress ?? 0 });

        if (data.status === 'SUCCEEDED') {
          setPreview(orderId, {
            modelUrl: `${API_URL}/api/custom-orders/generate-3d/${taskId}/model?previewToken=${encodeURIComponent(data.previewToken || order.previewToken)}`,
          });
          clearInterval(interval);
        }
        if (data.status === 'FAILED') {
          setPreview(orderId, { error: 'Generation failed' });
          clearInterval(interval);
        }
      } catch (err) {
        setPreview(orderId, { error: err.message });
        clearInterval(interval);
      }
    }, POLL_INTERVAL_MS);
  };

  if (safeOrders.length === 0) {
    return <p className="admin-empty">No custom orders yet.</p>;
  }

  return (
    <div className="orders-grid">
      {safeOrders
        .slice()
        .reverse()
        .map((order) => {
          const preview = previews[order.id] || {};
          return (
            <div key={order.id} className="order-card">
              <div className="order-card__images">
                {(order.imageUrls || []).map((imageUrl) => (
                  <img key={imageUrl} src={imageUrl} alt="Uploaded reference" />
                ))}
              </div>

              <div className="order-card__body">
                <a href={`mailto:${order.email}`} className="order-card__email">{order.email}</a>
                <p className="order-card__notes">{order.notes || <em>(no notes)</em>}</p>
                <p className="order-card__date">{new Date(order.createdAt).toLocaleString()}</p>

                {!preview.modelUrl && (
                  <button
                    className="btn btn--outline"
                    onClick={() => generate(order)}
                    disabled={preview.status === 'PENDING' || preview.status === 'IN_PROGRESS'}
                  >
                    {preview.status === 'PENDING' || preview.status === 'IN_PROGRESS'
                      ? `Generating… ${preview.progress || 0}%`
                      : 'Generate 3D preview'}
                  </button>
                )}

                {preview.error && <p className="order-card__error">{preview.error}</p>}

                {preview.modelUrl && (
                  <model-viewer
                    src={preview.modelUrl}
                    camera-controls
                    auto-rotate
                    style={{ width: '100%', height: '220px', borderRadius: '8px', marginTop: '10px' }}
                  />
                )}
              </div>
            </div>
          );
        })}

      <style>{`
        .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .order-card { border: 1px solid var(--color-line); border-radius: var(--radius-md); overflow: hidden; background: var(--color-white); }
        .order-card__images { display: flex; gap: 4px; overflow-x: auto; background: var(--color-cream); }
        .order-card__images img { width: 90px; height: 90px; object-fit: cover; flex-shrink: 0; }
        .order-card__body { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
        .order-card__email { font-weight: 600; font-size: 14px; }
        .order-card__notes { font-size: 13px; color: var(--color-grey); line-height: 1.5; }
        .order-card__date { font-family: var(--font-mono); font-size: 11px; color: var(--color-grey); margin-bottom: 6px; }
        .order-card__error { font-size: 12.5px; color: #B3261E; }
        .order-card .btn { width: 100%; justify-content: center; }
      `}</style>
    </div>
  );
}
