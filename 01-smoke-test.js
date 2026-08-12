import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, ENDPOINTS, THRESHOLDS } from './config.js';
import { getProxyParams } from './proxy.js';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: THRESHOLDS,
};

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINTS.landing}`, getProxyParams());

  check(res, {
    'status 200': (r) => r.status === 200,
    'load < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
