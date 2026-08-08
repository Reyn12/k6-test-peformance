# Performance Test dengan k6

Load testing untuk landing page portfolio + REST API.

## Struktur file

| File | Fungsi |
|------|--------|
| `config.js` | Setting URL & threshold — **edit ini dulu** |
| `01-smoke-test.js` | Test ringan (1 user, 30s) — cek script & endpoint hidup |
| `02-load-test.js` | Load test bertahap (20→50 user) — test utama |
| `03-stress-test.js` | Stress test (sampai 400 user) — cari titik jebol |

## Cara pakai

### 1. Edit target di `config.js`
Ganti `BASE_URL` dan `ENDPOINTS` sesuai portfolio kamu.

Atau override lewat env var tanpa edit file:
```bash
k6 run -e BASE_URL=https://portfolio-kamu.com 01-smoke-test.js
```

### 2. Test di Mac dulu (smoke test)
```bash
k6 run 01-smoke-test.js
```

### 3. Upload ke VPS
```bash
# ganti user@ip-vps sesuai punya kamu
scp -r . user@ip-vps:~/k6-test/
```

### 4. Install k6 di VPS (Ubuntu/Debian) & jalankan
```bash
ssh user@ip-vps
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6

cd ~/k6-test
k6 run 02-load-test.js
```

## Baca hasil (metrik penting)

| Metrik | Arti |
|--------|------|
| `http_req_duration` | Berapa lama request selesai. Lihat `p(95)` (95% request lebih cepat dari ini) |
| `http_req_failed` | Persentase request gagal. Makin kecil makin bagus |
| `http_reqs` | Total request & req/detik (throughput) |
| `vus` | Jumlah virtual user aktif |
| `checks` | Persentase assertion yang lulus |

## Simpan hasil ke file
```bash
k6 run --out json=hasil.json 02-load-test.js       # data mentah
k6 run --summary-export=ringkasan.json 02-load-test.js  # ringkasan
```
