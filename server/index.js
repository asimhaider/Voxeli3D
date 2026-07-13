// import convert3dRouter from './routes/convert-3d.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import quotesRouter from './routes/quotes.js';
import customOrdersRouter from './routes/custom-orders.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '2mb' }));

// Serve uploaded reference images back out so the frontend can preview/link them.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    meshyConfigured: Boolean(process.env.MESHY_API_KEY),
    time: new Date().toISOString(),
  });
});

app.use('/api/quotes', quotesRouter);
app.use('/api/custom-orders', customOrdersRouter);
// app.use('/api/convert-3d', convert3dRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Voxelis backend running on http://localhost:${PORT}`);
  if (!process.env.MESHY_API_KEY) {
    console.log('Note: MESHY_API_KEY is not set — 3D generation endpoints will return 501 until you add it to server/.env');
  }
});
