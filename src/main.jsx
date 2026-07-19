import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AdminPanel from './admin/AdminPanel';

// Simple path-based switch — no router library needed for just one extra page.
const isAdminRoute = window.location.pathname.startsWith('/admin');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdminRoute ? <AdminPanel /> : <App />}
  </React.StrictMode>
);
