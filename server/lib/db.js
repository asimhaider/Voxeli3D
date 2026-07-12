import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Minimal file-backed store. Good enough for getting started; swap for
 * Postgres/Mongo/SQLite later — only this file needs to change, since
 * routes just call read()/append().
 */
async function ensureFile(name) {
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!existsSync(filePath)) await writeFile(filePath, '[]', 'utf-8');
  return filePath;
}

export async function readAll(name) {
  const filePath = await ensureFile(name);
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

export async function append(name, record) {
  const filePath = await ensureFile(name);
  const records = await readAll(name);
  records.push(record);
  await writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8');
  return record;
}

export async function updateById(name, id, patch) {
  const filePath = await ensureFile(name);
  const records = await readAll(name);
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  records[idx] = { ...records[idx], ...patch };
  await writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8');
  return records[idx];
}
