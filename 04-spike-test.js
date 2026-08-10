import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, ENDPOINTS } from './config.js';

// Default tinggi buat cari titik patah sebelum upgrade VPS.
// Override: PEAK=5000 k6 run -e PEAK=5000 04-spike-test.js
const PEAK = Number(__ENV.PEAK || 100000);

export const options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '10s', target: PEAK },
    { duration: '30s', target: PEAK },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINTS.landing}`);
  check(res, {
    'status 200': (r) => r.status === 200,
  });

  if (__VU === 1 && __ITER === 0) {
    console.log(`cf-ray: ${res.headers['Cf-Ray'] || '-'} | cache: ${res.headers['Cf-Cache-Status'] || '-'} | server: ${res.headers['Server'] || '-'}`);
  }

  if (res.status !== 200) {
    console.log(`Status: ${res.status} | Body: ${res.body ? res.body.substring(0, 200) : 'kosong'}`);
  }
}
