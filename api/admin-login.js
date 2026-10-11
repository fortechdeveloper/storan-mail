/* =========================================================
   api/admin-login.js — Admin login
   ========================================================= */
import { verifyPassword, createToken, rateLimit } from './_auth.js';

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, msg: 'Method not allowed' });

  /* ---------- rate limit ---------- */
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (!rateLimit(ip)) {
    return res.status(429).json({ ok: false, msg: 'Terlalu banyak percobaan. Coba lagi nanti.' });
  }

  /* ---------- verify ---------- */
  const { password } = req.body || {};
  if (!verifyPassword(password)) {
    return res.status(401).json({ ok: false, msg: 'Password salah' });
  }

  try {
    const token = await createToken();
    return res.status(200).json({ ok: true, token });
  } catch (e) {
    console.error('[ADMIN LOGIN]', e.message);
    return res.status(500).json({ ok: false, msg: 'Server error' });
  }
}