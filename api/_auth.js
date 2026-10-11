/* =========================================================
   api/_auth.js — Admin auth + token (persistent di Firebase)
   ========================================================= */
import crypto from 'crypto';
import { getDb } from './_firebase.js';

const TOKEN_TTL = 12 * 60 * 60 * 1000; /* 12 jam */

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

export function verifyPassword(password) {
  const adminPass = process.env.ADMIN_PASS;
  if (!adminPass) return false;
  if (!password) return false;
  return timingSafeEqual(password, adminPass);
}

export async function createToken() {
  const token = crypto.randomBytes(24).toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
  const db = getDb();
  await db.ref('admin_tokens/' + token).set({ createdAt: Date.now() });
  return token;
}

export async function checkToken(token) {
  if (!token) return false;
  try {
    const db = getDb();
    const snap = await db.ref('admin_tokens/' + token).once('value');
    const val = snap.val();
    if (!val) return false;
    if (Date.now() - (val.createdAt || 0) > TOKEN_TTL) {
      await db.ref('admin_tokens/' + token).remove();
      return false;
    }
    return true;
  } catch (e) {
    console.error('[AUTH] checkToken error', e.message);
    return false;
  }
}

export async function revokeToken(token) {
  try {
    const db = getDb();
    await db.ref('admin_tokens/' + token).remove();
  } catch (e) {
    /* ignore */
  }
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