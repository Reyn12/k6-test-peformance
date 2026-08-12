import http from 'k6/http';
import { check } from 'k6';
import { getProxyParams, hasProxy } from './proxy.js';

const VUS = Number(__ENV.PROXY_VUS || 5);
const ITERS = Number(__ENV.PROXY_ITERS || 10);

export const options = {
  vus: VUS,
  iterations: ITERS,
};

export function setup() {
  if (!hasProxy()) {
    throw new Error('Set PROXY_URL atau PROXY_LIST dulu. Contoh: k6 run -e PROXY_URL=http://user:pass@host:port 06-proxy-rotation-test.js');
  }
}

export default function () {
  const res = http.get('https://api.ipify.org?format=json', getProxyParams());

  check(res, {
    'proxy connect ok': (r) => r.status === 200,
  });

  if (res.status === 200) {
    const ip = JSON.parse(res.body).ip;
    console.log(`VU ${__VU} iter ${__ITER} → IP: ${ip}`);
  } else {
    console.log(`VU ${__VU} iter ${__ITER} → gagal status ${res.status}`);
  }
}
