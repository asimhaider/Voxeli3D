import { nanoid } from 'nanoid';

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'reference-images';
  if (!url || !key) {
    throw new Error('Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  return { url, key, bucket };
}

function headers(key) {
  return { apikey: key, Authorization: `Bearer ${key}` };
}

export async function uploadReference(file) {
  const { url, key, bucket } = getConfig();
  const extension = file.mimetype === 'image/png' ? 'png' : 'jpg';
  const path = `orders/${nanoid(14)}.${extension}`;
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: { ...headers(key), 'Content-Type': file.mimetype, 'x-upsert': 'false' },
    body: file.buffer,
  });
  if (!response.ok) throw new Error(`Could not upload image: ${await response.text()}`);
  return path;
}

export async function downloadReference(path) {
  const { url, key, bucket } = getConfig();
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, { headers: headers(key) });
  if (!response.ok) throw new Error(`Could not download image: ${await response.text()}`);
  return Buffer.from(await response.arrayBuffer());
}

export async function signedReferenceUrl(path, expiresIn = 3600) {
  const { url, key, bucket } = getConfig();
  const response = await fetch(`${url}/storage/v1/object/sign/${bucket}/${path}`, {
    method: 'POST',
    headers: { ...headers(key), 'Content-Type': 'application/json' },
    body: JSON.stringify({ expiresIn }),
  });
  if (!response.ok) throw new Error(`Could not create image URL: ${await response.text()}`);
  const { signedURL } = await response.json();
  return `${url}/storage/v1${signedURL}`;
}
