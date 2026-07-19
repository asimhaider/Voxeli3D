const TABLES = {
  quotes: 'quotes',
  'custom-orders': 'custom_orders',
  'catalogue-items': 'catalogue_items',
};

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  return { url, key };
}

async function request(path, options = {}) {
  const { url, key } = getConfig();
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${body}`);
  }
  return response.status === 204 ? null : response.json();
}

function tableFor(name) {
  const table = TABLES[name];
  if (!table) throw new Error(`Unknown data collection: ${name}`);
  return table;
}

function toRow(name, record) {
  if (name === 'quotes') {
    return {
      id: record.id,
      email: record.email,
      whatsapp: record.whatsapp,
      message: record.message,
      created_at: record.createdAt,
      email_notification: record.emailNotification,
    };
  }
  if (name === 'catalogue-items') {
    return {
      id: record.id,
      title: record.title,
      category: record.category,
      description: record.description,
      material: record.material,
      size: record.size,
      price: record.price,
      turnaround: record.turnaround,
      image_path: record.imagePath,
      is_available: record.isAvailable,
      display_order: record.displayOrder,
      created_at: record.createdAt,
      updated_at: record.updatedAt,
    };
  }
  return {
    id: record.id,
    email: record.email,
    notes: record.notes,
    image_paths: record.images,
    created_at: record.createdAt,
    meshy_task_id: record.meshyTaskId,
    preview_token: record.previewToken,
    email_notification: record.emailNotification,
  };
}

function toRecord(name, row) {
  if (name === 'quotes') {
    return {
      id: row.id,
      type: 'quote',
      email: row.email,
      whatsapp: row.whatsapp,
      message: row.message,
      createdAt: row.created_at,
      emailNotification: row.email_notification,
    };
  }
  if (name === 'catalogue-items') {
    return {
      id: row.id,
      type: 'catalogue-item',
      title: row.title,
      category: row.category,
      description: row.description,
      material: row.material,
      size: row.size,
      price: row.price,
      turnaround: row.turnaround,
      imagePath: row.image_path,
      isAvailable: row.is_available,
      displayOrder: row.display_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
  return {
    id: row.id,
    type: 'custom-order',
    email: row.email,
    notes: row.notes,
    images: row.image_paths || [],
    createdAt: row.created_at,
    meshyTaskId: row.meshy_task_id,
    previewToken: row.preview_token,
    emailNotification: row.email_notification,
  };
}

export async function readAll(name) {
  const order = name === 'catalogue-items' ? 'display_order.asc,created_at.asc' : 'created_at.asc';
  const rows = await request(`/rest/v1/${tableFor(name)}?select=*&order=${order}`);
  return rows.map((row) => toRecord(name, row));
}

export async function append(name, record) {
  const rows = await request(`/rest/v1/${tableFor(name)}`, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(toRow(name, record)),
  });
  return toRecord(name, rows[0]);
}

export async function updateById(name, id, patch) {
  const current = (await request(`/rest/v1/${tableFor(name)}?id=eq.${encodeURIComponent(id)}&select=*`))[0];
  if (!current) return null;
  const updated = { ...toRecord(name, current), ...patch };
  const rows = await request(`/rest/v1/${tableFor(name)}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(toRow(name, updated)),
  });
  return toRecord(name, rows[0]);
}

export async function deleteById(name, id) {
  const rows = await request(`/rest/v1/${tableFor(name)}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=representation' },
  });
  return rows[0] ? toRecord(name, rows[0]) : null;
}
