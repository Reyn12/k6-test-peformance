// ============================================================
// config.js — kumpulan URL & setting yang sering diubah
// Cukup edit di sini, semua script lain tinggal import.
// ============================================================

export const BASE_URL = __ENV.BASE_URL || 'https://rey-porto-five.vercel.app';

// Endpoint yang mau di-test. Sesuaikan sama punya kamu.
export const ENDPOINTS = {
  landing: '/',                 // halaman landing page portfolio
  api_projects: '/api/projects', // contoh endpoint REST API
};

// Ambang batas (threshold) — test dianggap GAGAL kalau ini dilanggar.
export const THRESHOLDS = {
  // 95% request harus selesai di bawah 500ms
  http_req_duration: ['p(95)<500'],
  // Error rate harus di bawah 1%
  http_req_failed: ['rate<0.01'],
};
