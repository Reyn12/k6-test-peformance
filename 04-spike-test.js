import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, ENDPOINTS } from './config.js';

const PEAK = Number(__ENV.PEAK || 500);

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
  sleep(1);
}
