#!/usr/bin/env bash

set -euo pipefail

DEFAULT_URL="https://rey-porto-five.vercel.app"

SCRIPTS=(
  "01-smoke-test.js"
  "02-load-test.js"
  "03-stress-test.js"
  "04-spike-test.js"
  "05-breakpoint-test.js"
)

BASE_URL="${1:-}"
if [[ -z "$BASE_URL" ]]; then
  echo ""
  read -rp "Masukkan URL web [default: $DEFAULT_URL]: " BASE_URL
  BASE_URL="${BASE_URL:-$DEFAULT_URL}"
fi

if [[ ! "$BASE_URL" =~ ^https?:// ]]; then
  echo "❌ URL harus diawali http:// atau https:// — kamu isi: '$BASE_URL'"
  exit 1
fi

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

EXTRA=()
if [[ "$script" == "04-spike-test.js" ]]; then
  read -rp "Puncak virtual user (PEAK) [default 100000]: " peak
  peak="${peak:-100000}"
  EXTRA=(-e "PEAK=$peak")
  echo "→ PEAK diset ke $peak user"
elif [[ "$script" == "05-breakpoint-test.js" ]]; then
  read -rp "Target req/detik puncak (MAX_RATE) [default 4000]: " maxrate
  maxrate="${maxrate:-4000}"
  read -rp "Batas pool VU (MAX_VUS) [default 10000]: " maxvus
  maxvus="${maxvus:-10000}"
  EXTRA=(-e "MAX_RATE=$maxrate" -e "MAX_VUS=$maxvus")
  echo "→ MAX_RATE $maxrate req/s, MAX_VUS $maxvus"
fi

echo ""
echo "▶️  Test $BASE_URL pakai $script"
echo ""
k6 run -e BASE_URL="$BASE_URL" ${EXTRA[@]+"${EXTRA[@]}"} "$script"
