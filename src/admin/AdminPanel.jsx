import { useCallback, useEffect, useState } from 'react';
import '../index.css';
import { API_URL } from '../config';
import AdminLogin from './AdminLogin';
import QuotesTab from './QuotesTab';
import OrdersTab from './OrdersTab';

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loginError, setLoginError] = useState(null);
  const [tab, setTab] = useState('orders');
  const [quotes, setQuotes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoginError(null);
    try {
      const [quotesRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/api/quotes`, { credentials: 'include' }),
        fetch(`${API_URL}/api/custom-orders`, { credentials: 'include' }),
      ]);
      if (quotesRes.status === 401 || ordersRes.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!quotesRes.ok || !ordersRes.ok) {
        const badRes = !quotesRes.ok ? quotesRes : ordersRes;
        const body = await badRes.json().catch(() => ({}));
        throw new Error(body.error || `Backend returned ${badRes.status}`);
      }
      setQuotes(await quotesRes.json());
      setOrders(await ordersRes.json());
    } catch (err) {
      setLoginError(err.message || 'Could not reach the backend');
    } finally {
      setLoading(false);
      setCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/session`, { credentials: 'include' })
      .then((response) => setAuthenticated(response.ok))
      .catch(() => setAuthenticated(false))
      .finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated, loadData]);

  const logout = async () => {
    await fetch(`${API_URL}/api/admin/logout`, { method: 'POST', credentials: 'include' }).catch(() => undefined);
    setAuthenticated(false);
    setQuotes([]);
    setOrders([]);
  };

  if (checkingSession) return null;
  if (!authenticated) return <AdminLogin onSuccess={() => setAuthenticated(true)} error={loginError} />;

  return (
    <div className="admin-panel">
      <header className="admin-panel__header"><h1>Voxelis Admin</h1><button className="btn btn--outline" onClick={logout}>Log out</button></header>
      {loginError && <p className="admin-panel__error">{loginError}</p>}
      <div className="admin-panel__tabs">
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>Custom orders ({orders.length})</button>
        <button className={tab === 'quotes' ? 'active' : ''} onClick={() => setTab('quotes')}>Quote requests ({quotes.length})</button>
        <button className="admin-panel__refresh" onClick={loadData} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</button>
      </div>
      <main className="admin-panel__content">{tab === 'orders' ? <OrdersTab orders={orders} /> : <QuotesTab quotes={quotes} />}</main>
      <style>{`
        .admin-panel { min-height: 100vh; background: var(--color-white); padding: 32px clamp(20px, 4vw, 48px) 80px; }
        .admin-panel__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .admin-panel__header h1 { font-family: var(--font-display); font-size: 24px; }
        .admin-panel__tabs { display: flex; gap: 10px; align-items: center; margin-bottom: 28px; border-bottom: 1px solid var(--color-line); padding-bottom: 14px; flex-wrap: wrap; }
        .admin-panel__tabs button { background: none; border: none; font-size: 14px; font-weight: 600; color: var(--color-grey); padding: 8px 14px; border-radius: 20px; }
        .admin-panel__tabs button.active { background: var(--color-black); color: var(--color-white); }
        .admin-panel__refresh { margin-left: auto; color: var(--color-black) !important; }
        .admin-panel__error { background: #FDECEA; color: #B3261E; padding: 12px 16px; border-radius: var(--radius-sm); font-size: 13.5px; margin-bottom: 20px; }
      `}</style>
    </div>
  );
}
