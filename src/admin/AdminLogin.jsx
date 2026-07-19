import { useState } from 'react';

const STORAGE_KEY = 'voxelis_admin_pw';

export function getStoredPassword() {
  return sessionStorage.getItem(STORAGE_KEY) || '';
}

export function clearStoredPassword() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export default function AdminLogin({ onSuccess, error }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem(STORAGE_KEY, value);
    onSuccess(value);
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
          autoFocus
        />
        {error && <p className="admin-login__error">{error}</p>}
        <button type="submit" className="btn btn--primary">Log in</button>
      </form>

      <style>{`
        .admin-login {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-cream);
          font-family: var(--font-body);
        }
        .admin-login__card {
          background: var(--color-white);
          border-radius: var(--radius-md);
          padding: 40px 36px;
          width: 100%;
          max-width: 340px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .admin-login__card h1 { font-family: var(--font-display); font-size: 22px; margin-bottom: 4px; }
        .admin-login__card p { font-size: 13.5px; color: var(--color-grey); margin-bottom: 16px; }
        .admin-login__card input {
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--color-black);
          font-size: 14px;
          margin-bottom: 16px;
        }
        .admin-login__error { color: #B3261E; font-size: 13px; margin: -8px 0 12px; }
      `}</style>
    </div>
  );
}
