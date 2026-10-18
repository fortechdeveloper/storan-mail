/* =========================================================
   api/_auth.js — Auth admin (token disimpan di VPS)
   ========================================================= */
import crypto from 'crypto';

const TOKEN_TTL = 12 * 60 * 60 * 1000;
const VPS_URL = 'http://152.42.241.48:38471/db';
const VPS_SECRET = process.env.VPS_SECRET || 'gmailcuan-vps-secret-2026';

function timingSafeEqual(a, b) {
  a = String(a || '');
  b = String(b || '');
  const maxLen = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < maxLen; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

async function vpsReq(op, path, data) {
  const r = await fetch(VPS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-VPS-Secret': VPS_SECRET
    },
    body: JSON.stringify({ op, path, data })
  });
  return r.json();
}

export function verifyPassword(password) {
  const adminPass = process.env.ADMIN_PASS;
  if (!adminPass) return false;
  if (!password) return false;
  return timingSafeEqual(password, adminPass);
}

export async function createToken() {
  const token = crypto.randomBytes(24).toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);

  await vpsReq('put', 'admin_tokens/' + token, { createdAt: Date.now() });
  return token;
}

export async function checkToken(token) {
  if (!token) return false;
  try {
    const res = await vpsReq('get', 'admin_tokens/' + token);
    const val = res && res.data;
    if (!val) return false;
    if (Date.now() - (val.createdAt || 0) > TOKEN_TTL) {
      await vpsReq('delete', 'admin_tokens/' + token);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[AUTH]', e.message);
    return false;
  }
}

export async function revokeToken(token) {
  try {
    await vpsReq('delete', 'admin_tokens/' + token);
  } catch (e) {}
}

const ATTEMPTS = new Map();
const WINDOW = 15 * 60 * 1000;
const MAX_TRY = 10;

export function rateLimit(ip) {
  const now = Date.now();
  const arr = (ATTEMPTS.get(ip) || []).filter(t => now - t < WINDOW);
  if (arr.length >= MAX_TRY) return false;
  arr.push(now);
  ATTEMPTS.set(ip, arr);
  return true;
}

export default { verifyPassword, createToken, checkToken, revokeToken, rateLimit };