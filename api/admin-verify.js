/* =========================================================
   api/admin-verify.js — Verify admin token
   ========================================================= */
import { checkToken, revokeToken } from './_auth.js';

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, msg: 'Method not allowed' });

  const { token, revoke } = req.body || {};

  if (revoke) {
    await revokeToken(token);
    return res.status(200).json({ ok: true, revoked: true });
  }

  const ok = await checkToken(token);
  return res.status(ok ? 200 : 401).json({ ok });
}