// ============================================================
// 03-stress-test.js — CARI TITIK JEBOL SERVER
// Dorong user terus naik sampai server mulai lemot/error.
// JANGAN jalankan ke server orang lain / production tanpa izin.
// Idealnya dari VPS.
//
// Jalankan:  k6 run 03-stress-test.js
// ============================================================

import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, ENDPOINTS } from './config.js';

export const options = {
  stages: [
    { duration: '1m', target: 100 },  // naik ke 100 user
    { duration: '2m', target: 200 },  // dorong ke 200 user
    { duration: '2m', target: 400 },  // dorong ke 400 user
    { duration: '1m', target: 0 },    // cooldown
  ],
  // Sengaja TANPA threshold ketat — tujuannya lihat kapan jebol,
  // bukan lulus/gagal.
};

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINTS.landing}`);
  check(res, {
    'status 200': (r) => r.status === 200,
  });
  sleep(1);
}
