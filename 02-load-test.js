// ============================================================
// 02-load-test.js — LOAD TEST BENERAN
// Test landing page + REST API secara bertahap naik-turun.
// Cocok dijalankan dari VPS.
//
// Jalankan:  k6 run 02-load-test.js
// ============================================================

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { BASE_URL, ENDPOINTS, THRESHOLDS } from './config.js';

export const options = {
  // "stages" = skenario naik-turun jumlah user secara bertahap
  stages: [
    { duration: '30s', target: 20 },  // naik pelan ke 20 user dalam 30 detik
    { duration: '1m', target: 20 },   // tahan di 20 user selama 1 menit
    { duration: '30s', target: 50 },  // naik ke 50 user
    { duration: '1m', target: 50 },   // tahan di 50 user
    { duration: '30s', target: 0 },   // turun pelan ke 0 (cooldown)
  ],
  thresholds: THRESHOLDS,
};

export default function () {
  // "group" biar hasil di report kepisah rapi
  group('Landing Page', () => {
    const res = http.get(`${BASE_URL}${ENDPOINTS.landing}`);
    check(res, {
      'landing status 200': (r) => r.status === 200,
    });
  });

  group('API Projects', () => {
    const res = http.get(`${BASE_URL}${ENDPOINTS.api_projects}`);
    check(res, {
      'api status 200': (r) => r.status === 200,
      'api balikin JSON': (r) => r.headers['Content-Type']?.includes('application/json'),
    });
  });

  sleep(1);
}
