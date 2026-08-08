#!/usr/bin/env bash
# ============================================================
# run.sh — selector interaktif buat pilih domain sebelum test
#
# Cara pakai:
#   ./run.sh                      → menu pilih domain + pilih script
#   ./run.sh 1                    → langsung domain #1, pilih script
#   ./run.sh 1 02-load-test.js    → langsung domain #1 + script itu
# ============================================================

set -euo pipefail

# --- DAFTAR DOMAIN ---------------------------------------------------
# Tambah/edit di sini. Format: "Nama Label|https://url-lengkap"
DOMAINS=(
  "Portfolio Vercel|https://rey-porto-five.vercel.app"
  "Domain 2|https://ganti-domain-2.com"
  "Domain 3|https://ganti-domain-3.com"
  "Domain 4|https://ganti-domain-4.com"
  "Domain 5|https://ganti-domain-5.com"
)

# --- DAFTAR SCRIPT TEST ----------------------------------------------
SCRIPTS=(
  "01-smoke-test.js"
  "02-load-test.js"
  "03-stress-test.js"
)
# ---------------------------------------------------------------------

# 1) Pilih domain
pick="${1:-}"
if [[ -z "$pick" ]]; then
  echo ""
  echo "Pilih domain yang mau di-test:"
  for i in "${!DOMAINS[@]}"; do
    label="${DOMAINS[$i]%%|*}"
    url="${DOMAINS[$i]##*|}"
    printf "  %d) %-20s → %s\n" "$((i + 1))" "$label" "$url"
  done
  echo ""
  read -rp "Pilih [1-${#DOMAINS[@]}]: " pick
fi

idx=$((pick - 1))
if [[ "$idx" -lt 0 || "$idx" -ge "${#DOMAINS[@]}" ]]; then
  echo "❌ Pilihan domain tidak valid: $pick"
  exit 1
fi
BASE_URL="${DOMAINS[$idx]##*|}"
LABEL="${DOMAINS[$idx]%%|*}"

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

# 3) Jalankan k6
echo ""
echo "▶️  Test '$LABEL' ($BASE_URL) pakai $script"
echo ""
k6 run -e BASE_URL="$BASE_URL" "$script"
