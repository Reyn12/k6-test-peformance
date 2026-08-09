import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, ENDPOINTS } from './config.js';

const PEAK = Number(__ENV.PEAK || 500);

export const options = {
  stages: [
    { duration: '10s', target: Math.round(PEAK * 0.05) },
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

  if (res.status !== 200) {
    console.log(`Status: ${res.status} | Body: ${res.body ? res.body.substring(0, 200) : 'kosong'}`);
  }

  sleep(1);
}
