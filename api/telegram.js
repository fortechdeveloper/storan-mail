/* =========================================================
   api/_telegram.js — Telegram Bot sender
   ========================================================= */
export async function sendTelegram(text) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;
  if (!BOT_TOKEN || !CHAT_ID) {
    return { ok: false, msg: 'Telegram not configured' };
  }
  try {
    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: String(text || '').slice(0, 4000),
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    return await r.json();
  } catch (e) {
    return { ok: false, msg: e.message };
  }
}

export default { sendTelegram };