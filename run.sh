#!/usr/bin/env bash

set -euo pipefail

DEFAULT_URL="https://rey-porto-five.vercel.app"

SCRIPTS=(
  "01-smoke-test.js"
  "02-load-test.js"
  "03-stress-test.js"
  "04-spike-test.js"
  "05-breakpoint-test.js"
  "06-proxy-rotation-test.js"
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
  read -rp "Puncak virtual user (PEAK) [default 250000]: " peak
  peak="${peak:-250000}"
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

read -rp "Pakai proxy? [y/N]: " use_proxy
if [[ "$use_proxy" =~ ^[yY] ]]; then
  echo ""
  echo "Paste proxy (2 format didukung):"
  echo "  login,password,host,port"
  echo "  login:password@host:port"
  read -rp "Proxy: " proxy_input
  proxy_input="${proxy_input// /}"

  if [[ "$proxy_input" == *"@"* && "$proxy_input" == *":"* ]]; then
    # format provider: login:password@host:port
    PROXY_CREDS="${proxy_input%%@*}"
    PROXY_ADDR="${proxy_input##*@}"
    PROXY_LOGIN="${PROXY_CREDS%%:*}"
    PROXY_PASS="${PROXY_CREDS#*:}"
    PROXY_HOST="${PROXY_ADDR%%:*}"
    PROXY_PORT="${PROXY_ADDR##*:}"
  else
    # format koma: login,password,host,port
    IFS=',' read -r PROXY_LOGIN PROXY_PASS PROXY_HOST PROXY_PORT <<< "$proxy_input"
  fi

  if [[ -z "$PROXY_LOGIN" || -z "$PROXY_PASS" || -z "$PROXY_HOST" || -z "$PROXY_PORT" ]]; then
    echo "❌ Format salah. Contoh: login,password,host,port"
    exit 1
  fi

  PROXY_URL="http://${PROXY_LOGIN}:${PROXY_PASS}@${PROXY_HOST}:${PROXY_PORT}"
  EXTRA+=(-e "PROXY_URL=$PROXY_URL")
  echo "→ proxy aktif: http://${PROXY_LOGIN}:****@${PROXY_HOST}:${PROXY_PORT}"
fi

echo ""
echo "▶️  Test $BASE_URL pakai $script"
echo ""
k6 run -e BASE_URL="$BASE_URL" ${EXTRA[@]+"${EXTRA[@]}"} "$script"
