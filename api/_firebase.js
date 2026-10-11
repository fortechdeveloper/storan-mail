/* =========================================================
   api/_firebase.js — Firebase Admin SDK init
   ========================================================= */
import admin from 'firebase-admin';

const DB_URL = 'https://mailfortech-55a9c-default-rtdb.asia-southeast1.firebasedatabase.app';

let initialized = false;

function init() {
  if (initialized) return admin;

  const raw = process.env.FIREBASE_SA;
  if (!raw) throw new Error('FIREBASE_SA env tidak di-set');

  let sa;
  try {
    sa = JSON.parse(raw);
  } catch (e) {
    try {
      sa = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
    } catch (e2) {
      throw new Error('FIREBASE_SA bukan JSON valid');
    }
  }

  if (sa.private_key && typeof sa.private_key === 'string') {
    sa.private_key = sa.private_key.replace(/\\n/g, '\n');
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(sa),
      databaseURL: DB_URL
    });
  }

  initialized = true;
  return admin;
}

export function getDb() {
  return init().database();
}

export function getAdmin() {
  return init();
}

export default { getDb, getAdmin };