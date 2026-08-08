// ============================================================
// 04-spike-test.js — SPIKE TEST (lonjakan mendadak)
// Simulasi trafik tiba-tiba melonjak, kayak flash sale / viral.
//
// Intensitas bisa diatur pas run TANPA edit file, lewat env var:
//   PEAK  = puncak jumlah virtual user (default 500)
//
// Contoh:
//   k6 run -e BASE_URL=https://xxx -e PEAK=2000 04-spike-test.js
//
// ⚠️ Gempur VPS milik sendiri. Vercel bisa kena tagihan bandwidth,
//    cPanel shared hosting bisa kena suspend.
// ============================================================

import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, ENDPOINTS } from './config.js';

// Ambil PEAK dari env var, default 500 kalau ga diisi
const PEAK = Number(__ENV.PEAK || 500);

export const options = {
  stages: [
    { duration: '10s', target: Math.round(PEAK * 0.05) }, // trafik normal
    { duration: '10s', target: PEAK },                    // LONJAK ke puncak
    { duration: '30s', target: PEAK },                    // tahan di puncak
    { duration: '10s', target: 0 },                       // cooldown
  ],
  // Sengaja tanpa threshold ketat — tujuannya lihat kapan jebol.
};

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINTS.landing}`);
  check(res, {
    'status 200': (r) => r.status === 200,
  });
  sleep(1);
}
