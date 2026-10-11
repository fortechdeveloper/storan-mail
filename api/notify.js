/* =========================================================
   api/notify.js — Telegram proxy (self-contained)
   ========================================================= */

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

  /* ---------- ambil env ---------- */
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(200).json({ ok: false, msg: 'Telegram not configured' });
  }

  const { text } = req.body || {};
  if (!text) return res.status(400).json({ ok: false, msg: 'Text kosong' });

  /* ---------- kirim ke Telegram ---------- */
  try {
    const url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: String(text).slice(0, 4000),
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const raw = await r.text();

    /* coba parse JSON, kalau gagal balikin raw biar keliatan */
    let data;
    try { data = JSON.parse(raw); } catch (e) { data = { ok: false, raw: raw.slice(0, 200) }; }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ ok: false, msg: 'Fetch error: ' + e.message });
  }
}