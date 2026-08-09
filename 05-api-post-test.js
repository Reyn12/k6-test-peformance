import http from 'k6/http';
import { check, sleep } from 'k6';

const API_URL = __ENV.API_URL || 'https://apitravel.maqdisacademy.com/api/Group/join';
const USER_ID = __ENV.USER_ID || '9c9a3800-0a56-44c2-bf32-d466ed5ed66f';
const TOKEN = __ENV.TOKEN || '';
const GRUPID = __ENV.GRUPID || '2c9d5070-465e-4823-98db-8b6d5fba8627';
const PEAK = Number(__ENV.PEAK || 500);

const FULL_URL = `${API_URL}?userId=${USER_ID}`;

export const options = {
  stages: [
    { duration: '10s', target: Math.round(PEAK * 0.05) },
    { duration: '10s', target: PEAK },
    { duration: '30s', target: PEAK },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  const payload = JSON.stringify({
    grupid: GRUPID,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
  };

  const res = http.post(FULL_URL, payload, params);

  check(res, {
    'status 200': (r) => r.status === 200,
    'ada response body': (r) => r.body && r.body.length > 0,
    'bukan unauthorized': (r) => r.status !== 401 && r.status !== 403,
  });

  if (res.status !== 200) {
    console.log(`Status: ${res.status} | Body: ${res.body ? res.body.substring(0, 200) : 'kosong'}`);
  }

  sleep(1);
}
