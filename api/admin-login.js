export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, msg: 'Method not allowed' });

  const { password } = req.body || {};
  const adminPass = process.env.ADMIN_PASS;

  if (!adminPass) return res.status(500).json({ ok: false, msg: 'Server misconfigured' });

  const a = String(password || '');
  const b = String(adminPass);
  const maxLen = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < maxLen; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }

  if (diff === 0) {
    const token = Buffer.from(
      Date.now() + ':' + Math.random().toString(36).slice(2)
    ).toString('base64');
    return res.status(200).json({ ok: true, token });
  }

  return res.status(401).json({ ok: false, msg: 'Password salah' });
}