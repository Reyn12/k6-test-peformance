import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, ENDPOINTS } from './config.js';
import { getProxyParams } from './proxy.js';

// Titik patah (req/detik) di stage terakhir, bisa diatur dari env
const MAX_RATE = Number(__ENV.MAX_RATE || 4000);

export const options = {
  scenarios: {
    breakpoint: {
      executor: 'ramping-arrival-rate',
      startRate: 100,
      timeUnit: '1s',
      preAllocatedVUs: 2000,
      maxVUs: Number(__ENV.MAX_VUS || 10000),
      stages: [
        { duration: '30s', target: Math.round(MAX_RATE * 0.125) }, // ramp awal
        { duration: '30s', target: Math.round(MAX_RATE * 0.25) },
        { duration: '30s', target: Math.round(MAX_RATE * 0.5) },
        { duration: '30s', target: MAX_RATE },                     // sampe patah
      ],
    },
  },
};

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINTS.landing}`, getProxyParams());
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
