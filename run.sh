#!/usr/bin/env bash
# ============================================================
# run.sh — jalanin k6 dengan input URL langsung di terminal
#
# Cara pakai:
#   ./run.sh                                  → nanya URL + pilih test
#   ./run.sh https://web-kamu.com             → langsung URL itu, pilih test
#   ./run.sh https://web-kamu.com 4           → URL + script #4 sekaligus
# ============================================================

set -euo pipefail

# URL default kalau tekan Enter tanpa ngetik apa-apa
DEFAULT_URL="https://rey-porto-five.vercel.app"

# --- DAFTAR SCRIPT TEST ----------------------------------------------
SCRIPTS=(
  "01-smoke-test.js"
  "02-load-test.js"
  "03-stress-test.js"
  "04-spike-test.js"
)
# ---------------------------------------------------------------------

# 1) Tentukan URL — dari argumen, atau tanya di terminal
BASE_URL="${1:-}"
if [[ -z "$BASE_URL" ]]; then
  echo ""
  read -rp "Masukkan URL web [default: $DEFAULT_URL]: " BASE_URL
  BASE_URL="${BASE_URL:-$DEFAULT_URL}"
fi

# Validasi sederhana: harus diawali http:// atau https://
if [[ ! "$BASE_URL" =~ ^https?:// ]]; then
  echo "❌ URL harus diawali http:// atau https:// — kamu isi: '$BASE_URL'"
  exit 1
fi

# 2) Pilih script test
script="${2:-}"
if [[ -z "$script" ]]; then
  echo ""
  echo "Pilih jenis test:"
  for i in "${!SCRIPTS[@]}"; do
    printf "  %d) %s\n" "$((i + 1))" "${SCRIPTS[$i]}"
  done
  echo ""
  read -rp "Pilih [1-${#SCRIPTS[@]}]: " s
  sidx=$((s - 1))
  if [[ "$sidx" -lt 0 || "$sidx" -ge "${#SCRIPTS[@]}" ]]; then
    echo "❌ Pilihan script tidak valid: $s"
    exit 1
  fi
  script="${SCRIPTS[$sidx]}"
fi

# 3) Kalau spike test, tanya intensitas puncak (PEAK)
EXTRA=()
if [[ "$script" == "04-spike-test.js" ]]; then
  read -rp "Puncak virtual user (PEAK) [default 500]: " peak
  peak="${peak:-500}"
  EXTRA=(-e "PEAK=$peak")
  echo "→ PEAK diset ke $peak user"
fi

# 4) Jalankan k6
echo ""
echo "▶️  Test $BASE_URL pakai $script"
echo ""
k6 run -e BASE_URL="$BASE_URL" ${EXTRA[@]+"${EXTRA[@]}"} "$script"
