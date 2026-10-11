/* =========================================================
   api/fb.js — Firebase Proxy
   Client gak pernah liat URL atau credentials Firebase
   ========================================================= */
import { getDb } from './_firebase.js';
import { checkToken } from './_auth.js';

/* path yang butuh admin token */
function needsAdmin(op, path) {
  if (op === 'get') {
    if (path === 'pending' || path === 'users') return true;
    if (path === 'admin_tokens' || path.startsWith('admin_tokens/')) return true;
  }
  if (op === 'delete') {
    if (path.startsWith('pending/')) return true;
    if (path.startsWith('admin_tokens/')) return true;
  }
  if (path === 'admin_tokens' || path.startsWith('admin_tokens/')) return true;
  return false;
}

/* path yang gak boleh diakses sama sekali dari client */
function isForbidden(path) {
  if (path === 'config' || path.startsWith('config/')) return true;
  if (path === 'admin_tokens' || path.startsWith('admin_tokens/')) return true;
  return false;
}

function cleanPath(p) {
  return String(p || '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/');
}

export default async function handler(req, res) {
  /* ---------- CORS ---------- */
  const allowed = (process.env.ALLOWED_ORIGIN || '*')
    .split(',').map(s => s.trim()).filter(Boolean);
  const origin = req.headers.origin || '';

  if (allowed[0] === '*' || allowed.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (allowed.some(o => origin === o || origin.startsWith(o))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else {
    return res.status(403).json({ ok: false, msg: 'Forbidden origin' });
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, msg: 'Method not allowed' });

  /* ---------- parse body ---------- */
  const { op, path, data, token } = req.body || {};
  if (!op || !path) {
    return res.status(400).json({ ok: false, msg: 'op & path wajib' });
  }
  if (!['get', 'put', 'patch', 'delete'].includes(op)) {
    return res.status(400).json({ ok: false, msg: 'op tidak valid' });
  }

  const p = cleanPath(path);
  if (!p || p.includes('..')) {
    return res.status(400).json({ ok: false, msg: 'path tidak valid' });
  }
  if (isForbidden(p)) {
    return res.status(403).json({ ok: false, msg: 'path dilarang' });
  }

  /* ---------- admin guard ---------- */
  if (needsAdmin(op, p)) {
    const adminToken = req.headers['x-admin-token'] || token;
    const ok = await checkToken(adminToken);
    if (!ok) return res.status(401).json({ ok: false, msg: 'Unauthorized' });
  }

  /* ---------- hit Firebase ---------- */
  try {
    const db = getDb();
    const ref = db.ref(p);
    let result = null;

    if (op === 'get') {
      const snap = await ref.once('value');
      result = snap.val();
    } else if (op === 'put') {
      if (data === undefined) return res.status(400).json({ ok: false, msg: 'data wajib' });
      await ref.set(data);
      result = data;
    } else if (op === 'patch') {
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ ok: false, msg: 'data object wajib' });
      }
      await ref.update(data);
      result = data;
    } else if (op === 'delete') {
      await ref.remove();
      result = true;
    }

    return res.status(200).json({ ok: true, data: result });
  } catch (e) {
    console.error('[FB]', op, p, e.message);
    return res.status(500).json({ ok: false, msg: e.message });
  }
}