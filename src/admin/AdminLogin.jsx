import { useState } from 'react';
import { API_URL } from '../config';

export default function AdminLogin({ onSuccess, error }) {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLocalError(null);
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: value }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Could not sign in');
      }
      setValue('');
      onSuccess();
    } catch (err) {
      setLocalError(err.message || 'Could not sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit} className="admin-login__card">
        <h1>Voxelis Admin</h1>
        <p>Enter the admin password to view submissions.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Admin password"
          autoComplete="current-password"
          autoFocus
          required
        />
        {(localError || error) && <p className="admin-login__error">{localError || error}</p>}
        <button type="submit" className="btn btn--primary" disabled={submitting}>{submitting ? 'Signing in…' : 'Log in'}</button>
      </form>

      <style>{`
        .admin-login { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--color-cream); font-family: var(--font-body); }
        .admin-login__card { background: var(--color-white); border-radius: var(--radius-md); padding: 40px 36px; width: 100%; max-width: 340px; display: flex; flex-direction: column; gap: 6px; }
        .admin-login__card h1 { font-family: var(--font-display); font-size: 22px; margin-bottom: 4px; }
        .admin-login__card p { font-size: 13.5px; color: var(--color-grey); margin-bottom: 16px; }
        .admin-login__card input { padding: 12px 14px; border-radius: var(--radius-sm); border: 1.5px solid var(--color-black); font-size: 14px; margin-bottom: 16px; }
        .admin-login__error { color: #B3261E !important; font-size: 13px !important; margin: -8px 0 12px !important; }
      `}</style>
    </div>
  );
}
