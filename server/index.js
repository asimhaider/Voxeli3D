// import convert3dRouter from './routes/convert-3d.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import adminRouter from './routes/admin.js';
import quotesRouter from './routes/quotes.js';
import customOrdersRouter from './routes/custom-orders.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);

const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const isLocalDevOrigin = (origin) => /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || isLocalDevOrigin(origin) || configuredOrigins.length === 0 || configuredOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
}));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    meshyConfigured: Boolean(process.env.MESHY_API_KEY),
    storageConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    emailConfigured: Boolean(process.env.RESEND_API_KEY),
    time: new Date().toISOString(),
  });
});

app.use('/api/admin', adminRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/custom-orders', customOrdersRouter);
// app.use('/api/convert-3d', convert3dRouter);

app.use((err, req, res, next) => {
  console.error(err);
  const isUploadError = err.name === 'MulterError' || /Only PNG, JPG, or WEBP images are allowed/.test(err.message);
  res.status(err.status || (isUploadError ? 400 : 500)).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Voxelis backend running on http://localhost:${PORT}`);
  if (!process.env.MESHY_API_KEY) {
    console.log('Note: MESHY_API_KEY is not set — 3D generation endpoints will return 501 until you add it to server/.env');
  }
});
