import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const locks = new Map();

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
  return mutate(name, (records) => {
    records.push(record);
    return record;
  });
}

export async function updateById(name, id, patch) {
  return mutate(name, (records) => {
    const idx = records.findIndex((record) => record.id === id);
    if (idx === -1) return null;
    records[idx] = { ...records[idx], ...patch };
    return records[idx];
  });
}

function mutate(name, change) {
  const previous = locks.get(name) || Promise.resolve();
  const operation = previous.then(async () => {
    const filePath = await ensureFile(name);
    const records = JSON.parse(await readFile(filePath, 'utf-8'));
    const result = change(records);
    await writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8');
    return result;
  });
  locks.set(name, operation.catch(() => undefined));
  return operation;
}
