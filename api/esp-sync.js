/* =========================================================
   api/esp-sync.js — Endpoint data user untuk ESP32-C3
   ========================================================= */
import { getDb } from './_firebase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ ok: false });

  const SECRET = process.env.ESP_SECRET || 'gmailcuan-esp-2026';
  const { token } = req.query;

  if (String(token) !== SECRET) {
    return res.status(401).json({ ok: false, msg: 'Unauthorized' });
  }

  try {
    const db = getDb();
    const snap = await db.ref('users').once('value');
    const raw = snap.val() || {};

    /* ---------- Ekstrak cuma field yang perlu ---------- */
    const users = [];
    Object.keys(raw).forEach(k => {
      const u = raw[k];
      if (!u || !u.gmail) return;
      users.push({
        userId:   u.userId || k,
        nama:     u.nama   || '-',
        gmail:    u.gmail,
        saldo:    Number(u.saldo) || 0,
        active:   u.active !== false
      });
    });

    return res.status(200).json({
      ok: true,
      count: users.length,
      ts: Date.now(),
      users: users
    });
  } catch (e) {
    console.error('[ESP-SYNC]', e.message);
    return res.status(500).json({ ok: false, msg: e.message });
  }
}