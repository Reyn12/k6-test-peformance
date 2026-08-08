// ============================================================
// 01-smoke-test.js — TEST PALING RINGAN
// Tujuan: mastiin script jalan & endpoint hidup.
// Cuma 1 virtual user selama 30 detik. Aman dijalankan dari Mac.
//
// Jalankan:  k6 run 01-smoke-test.js
// ============================================================

import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, ENDPOINTS, THRESHOLDS } from './config.js';

export const options = {
  vus: 1,           // vus = Virtual Users (jumlah user tiruan)
  duration: '30s',  // jalan selama 30 detik
  thresholds: THRESHOLDS,
};

export default function () {
  // Buka landing page
  const res = http.get(`${BASE_URL}${ENDPOINTS.landing}`);

  // "check" = assertion. Ga bikin test berhenti, cuma dicatat.
  check(res, {
    'status 200': (r) => r.status === 200,
    'load < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1); // jeda 1 detik, meniru user yang mikir sebentar
}
