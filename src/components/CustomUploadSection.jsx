import { useState, useRef } from 'react';
import { API_URL } from '../config';

/**
 * CustomUploadSection — lets visitors upload 2D reference images (sketches,
 * photos, screenshots) of a sculpture or object they want printed, plus a
 * note describing it. Submits to the Express backend in /server:
 *   1. POST /api/custom-orders  — saves images + notes, returns an order id
 *   2. POST /api/custom-orders/:id/generate-3d — kicks off Meshy (once you
 *      add MESHY_API_KEY to server/.env; returns 501 until then)
 *   3. GET  /api/custom-orders/generate-3d/:taskId — polled for progress/result
 */
const MAX_FILES = 5;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const POLL_INTERVAL_MS = 4000;

export default function CustomUploadSection() {
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | submitting | done
  const [preview, setPreview] = useState(null); // { status, progress, modelUrl }
  const [previewError, setPreviewError] = useState(null);
  const inputRef = useRef(null);

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList).filter((f) => ACCEPTED_TYPES.includes(f.type));
    setFiles((prev) => {
      const combined = [...prev, ...incoming].slice(0, MAX_FILES);
      return combined;
    });
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    setStatus('submitting');
    setPreviewError(null);
    setPreview(null);

    const email = e.target.email.value;
    const form = new FormData();
    form.append('email', email);
    form.append('notes', notes);
    files.forEach((f) => form.append('images', f));

    try {
      const orderRes = await fetch(`${API_URL}/api/custom-orders`, { method: 'POST', body: form });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Could not submit request');

      setStatus('done'); // request is saved regardless of what happens with 3D generation below

      // Try to kick off an automatic 3D preview from the first image.
      const imageUrl = `${API_URL}${orderData.images[0]}`;
      setPreview({ status: 'PENDING', progress: 0 });

      const genRes = await fetch(`${API_URL}/api/custom-orders/${orderData.id}/generate-3d`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });
      const genData = await genRes.json();
      if (!genRes.ok) throw new Error(genData.error || '3D preview is not available yet');

      pollStatus(genData.result);
    } catch (err) {
      setPreviewError(err.message || 'Something went wrong starting the 3D preview');
    }
  };

  const pollStatus = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/custom-orders/generate-3d/${taskId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Status check failed');

        setPreview({
          status: data.status,
          progress: data.progress ?? 0,
          taskId,
          modelUrl: data.model_urls?.glb,
        });

        if (data.status === 'SUCCEEDED' || data.status === 'FAILED') {
          clearInterval(interval);
        }
      } catch (err) {
        setPreviewError(err.message || 'Lost connection while checking generation status');
        clearInterval(interval);
      }
    }, POLL_INTERVAL_MS);
  };

  const reset = () => {
    setFiles([]);
    setNotes('');
    setStatus('idle');
    setPreview(null);
    setPreviewError(null);
  };

  return (
    <section id="custom-upload" className="upload-section">
      <div className="container upload-section__inner">
        <div className="upload-section__head">
          <p className="eyebrow">Custom sculptures & objects</p>
          <h2 className="upload-section__title">Have a picture of what you want printed?</h2>
          <p className="upload-section__sub">
            Upload a photo, sketch, or reference image of the sculpture or
            object you have in mind. Our team reviews it, models it in 3D,
            and sends back a quote with material and finish options.
          </p>
        </div>

        {status === 'done' ? (
          <div className="upload-section__success">
            <h3>Request received</h3>
            <p>We'll email you a 3D concept and quote within 24–48 hours.</p>

            {previewError && (
              <p className="upload-preview-error">
                Automatic 3D preview couldn't be generated: {previewError}. Our team will still model this by hand.
              </p>
            )}

            {!previewError && preview && preview.status !== 'SUCCEEDED' && (
              <div className="upload-generating">
                <span className="upload-generating__spinner" />
                <span>Generating a 3D preview… {preview.progress ? `${preview.progress}%` : ''}</span>
              </div>
            )}

            {!previewError && preview?.status === 'SUCCEEDED' && preview.modelUrl && (
              <model-viewer
                src={preview.modelUrl}
                camera-controls
                auto-rotate
                shadow-intensity="1"
                style={{ width: '100%', height: '320px', background: 'var(--color-white)', borderRadius: '10px', marginBottom: '20px' }}
              />
            )}

            <button className="btn btn--outline" onClick={reset}>Submit another</button>
          </div>
        ) : (
          <form className="upload-section__form" onSubmit={handleSubmit}>
            <div
              className={`upload-dropzone ${dragOver ? 'upload-dropzone--active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click(); }}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                multiple
                hidden
                onChange={(e) => addFiles(e.target.files)}
              />
              <span className="upload-dropzone__title">
                Drop images here, or click to browse
              </span>
              <span className="upload-dropzone__hint">
                PNG, JPG or WEBP — up to {MAX_FILES} images
              </span>
            </div>

            {files.length > 0 && (
              <div className="upload-previews">
                {files.map((file, i) => (
                  <div key={file.name + i} className="upload-preview">
                    <img src={URL.createObjectURL(file)} alt={`Reference ${i + 1}`} />
                    <button type="button" aria-label={`Remove ${file.name}`} onClick={() => removeFile(i)}>&times;</button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              className="upload-notes"
              placeholder="Describe what you want printed — size, material, color, occasion, deadline..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />

            <div className="upload-form-footer">
              <input type="email" name="email" required placeholder="you@company.com" aria-label="Email address" className="upload-email" />
              <button
                type="submit"
                className="btn btn--primary"
                disabled={files.length === 0 || status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Request a 3D quote'}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .upload-section {
          padding: var(--section-pad) 0;
          background: var(--color-cream);
        }
        .upload-section__head { max-width: 600px; margin: 0 auto 40px; text-align: center; }
        .upload-section__title {
          margin-top: 14px;
          font-size: clamp(26px, 3.4vw, 38px);
          font-weight: 600;
        }
        .upload-section__sub {
          margin-top: 14px;
          font-size: 15.5px;
          line-height: 1.6;
          color: var(--color-grey);
        }
        .upload-section__form {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .upload-dropzone {
          border: 1.5px dashed var(--color-black);
          border-radius: var(--radius-md);
          padding: 40px 20px;
          text-align: center;
          background: var(--color-white);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .upload-dropzone--active { border-color: var(--color-yellow-dim); background: #FFFDF3; }
        .upload-dropzone__title { font-weight: 600; font-size: 15px; }
        .upload-dropzone__hint { font-size: 13px; color: var(--color-grey); font-family: var(--font-mono); }
        .upload-previews {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
          gap: 10px;
        }
        .upload-preview {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid var(--color-line);
        }
        .upload-preview img { width: 100%; height: 100%; object-fit: cover; }
        .upload-preview button {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: none;
          background: var(--color-black);
          color: var(--color-white);
          font-size: 13px;
          line-height: 1;
        }
        .upload-notes {
          width: 100%;
          padding: 14px 16px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--color-black);
          font-family: var(--font-body);
          font-size: 14px;
          resize: vertical;
        }
        .upload-notes:focus { outline: 2px solid var(--color-black); outline-offset: 2px; }
        .upload-form-footer {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .upload-email {
          flex: 1;
          min-width: 200px;
          padding: 14px 16px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--color-black);
          font-size: 14px;
        }
        .upload-form-footer .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .upload-section__success {
          max-width: 460px;
          margin: 0 auto;
          text-align: center;
          background: var(--color-white);
          border-radius: var(--radius-md);
          padding: 40px 28px;
        }
        .upload-section__success h3 { font-size: 20px; font-weight: 600; margin-bottom: 10px; }
        .upload-section__success p { color: var(--color-grey); margin-bottom: 20px; font-size: 14.5px; }
        .upload-generating {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 13.5px;
          color: var(--color-grey);
          margin-bottom: 20px;
        }
        .upload-generating__spinner {
          width: 14px;
          height: 14px;
          border: 2px solid var(--color-line);
          border-top-color: var(--color-yellow-dim);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .upload-preview-error {
          font-size: 13.5px;
          color: var(--color-grey);
          background: var(--color-cream);
          border-radius: var(--radius-sm);
          padding: 12px 14px;
          margin-bottom: 20px;
        }
      `}</style>
    </section>
  );
}
