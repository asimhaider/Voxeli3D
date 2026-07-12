/** Points the frontend at the backend. Override by setting VITE_API_URL
 *  in a .env file (project root) — e.g. VITE_API_URL=https://your-backend.onrender.com */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
