export const BASE_URL = __ENV.BASE_URL || 'https://rey-porto-five.vercel.app';

export const ENDPOINTS = {
  landing: '/',
};

export const THRESHOLDS = {
  http_req_duration: ['p(95)<500'],
  http_req_failed: ['rate<0.01'],
};
