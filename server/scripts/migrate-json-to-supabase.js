/**
 * One-time migration for records created before Supabase was configured.
 * Run from server/: node scripts/migrate-json-to-supabase.js
 */
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';
import { append } from '../lib/db.js';
import { uploadReference } from '../lib/storage.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.join(__dirname, '..');

async function readJson(name) {
  const file = path.join(serverRoot, 'data', `${name}.json`);
  return existsSync(file) ? JSON.parse(await readFile(file, 'utf8')) : [];
}

function mimeType(filename) {
  return path.extname(filename).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
}

async function migrateQuotes() {
  const records = await readJson('quotes');
  for (const record of records) {
    try {
      await append('quotes', {
        ...record,
        whatsapp: record.whatsapp || '',
        emailNotification: record.emailNotification || { status: 'not-tracked', updatedAt: null },
      });
      console.log(`Migrated quote ${record.id}`);
    } catch (err) {
      console.warn(`Skipped quote ${record.id}: ${err.message}`);
    }
  }
}

async function migrateOrders() {
  const records = await readJson('custom-orders');
  for (const record of records) {
    try {
      const images = [];
      for (const image of record.images || []) {
        if (!image.startsWith('/uploads/')) {
          images.push(image);
          continue;
        }
        const filename = path.basename(image);
        const localFile = path.join(serverRoot, 'uploads', filename);
        if (!existsSync(localFile)) throw new Error(`Missing local image ${filename}`);
        images.push(await uploadReference({
          buffer: await readFile(localFile),
          mimetype: mimeType(filename),
        }));
      }
      await append('custom-orders', {
        ...record,
        images,
        previewToken: record.previewToken || randomBytes(24).toString('base64url'),
        emailNotification: record.emailNotification || { status: 'not-tracked', updatedAt: null },
      });
      console.log(`Migrated custom order ${record.id}`);
    } catch (err) {
      console.warn(`Skipped custom order ${record.id}: ${err.message}`);
    }
  }
}

await migrateQuotes();
await migrateOrders();
