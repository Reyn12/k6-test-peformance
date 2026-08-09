import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { BASE_URL, ENDPOINTS, THRESHOLDS } from './config.js';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: THRESHOLDS,
};

export default function () {
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
