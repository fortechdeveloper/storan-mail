/* =========================================================
   api/fb.js — Proxy ke VPS
   ========================================================= */
import { checkToken } from './_auth.js';

const VPS_URL = 'http://152.42.241.48:38471/db';
const VPS_SECRET = process.env.VPS_SECRET || 'gmailcuan-vps-secret-2026';

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

  const { op, path, data, token } = req.body || {};
  if (!op || !path) return res.status(400).json({ ok: false, msg: 'op & path wajib' });
  if (!['get', 'put', 'patch', 'delete'].includes(op)) {
    return res.status(400).json({ ok: false, msg: 'op tidak valid' });
  }

  const p = cleanPath(path);
  if (!p || p.includes('..')) return res.status(400).json({ ok: false, msg: 'path tidak valid' });
  if (isForbidden(p)) return res.status(403).json({ ok: false, msg: 'path dilarang' });

  if (needsAdmin(op, p)) {
    const adminToken = req.headers['x-admin-token'] || token;
    const ok = await checkToken(adminToken);
    if (!ok) return res.status(401).json({ ok: false, msg: 'Unauthorized' });
  }

  try {
    const r = await fetch(VPS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VPS-Secret': VPS_SECRET
      },
      body: JSON.stringify({ op, path: p, data })
    });

    const result = await r.json();
    return res.status(200).json(result);
  } catch (e) {
    console.error('[VPS]', e.message);
    return res.status(500).json({ ok: false, msg: 'VPS connection error: ' + e.message });
  }
}