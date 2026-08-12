import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, ENDPOINTS } from './config.js';
import { getProxyParams } from './proxy.js';

export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '2m', target: 400 },
    { duration: '1m', target: 0 },
  ],
};

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINTS.landing}`, getProxyParams());
  check(res, {
    'status 200': (r) => r.status === 200,
  });
  sleep(1);
}
