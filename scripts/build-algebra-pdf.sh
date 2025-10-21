#!/usr/bin/env zsh
set -euo pipefail

BASE="http://localhost:1313/p5.quadrille.js/"  # e.g. "http://localhost:1313/"

PATHS=(
  "docs/algebra/"
  "docs/algebra/not/"
  "docs/algebra/or/"
  "docs/algebra/xor/"
  "docs/algebra/and/"
  "docs/algebra/diff/"
  "docs/algebra/merge/"
)

OUT="algebra-section.pdf"
VTIME_INITIAL=10000

command -v chromium >/dev/null 2>&1 || { echo "❌ Falta 'chromium'"; exit 1; }
command -v pdfunite >/dev/null 2>&1 || { echo "❌ Falta 'pdfunite' (poppler)"; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "❌ Falta 'curl'"; exit 1; }

TMPDIR=$(mktemp -d)
cleanup() { rm -rf "$TMPDIR"; }
trap cleanup EXIT

print_page() {
  local url="$1"
  local pdf="$2"
  local vbudget="$3"
  chromium \
    --headless \
    --disable-gpu \
    --no-pdf-header-footer \
    --run-all-compositor-stages-before-draw \
    --virtual-time-budget="${vbudget}" \
    --enable-unsafe-swiftshader \
    --use-gl=swiftshader \
    --hide-scrollbars \
    --window-size=1400,2200 \
    --print-to-pdf="$pdf" \
    "$url"
}

echo "Imprimiendo páginas a PDF con Chromium headless…"
PDFS=()
idx=1

for p in "${PATHS[@]}"; do
  url="${BASE}${p}"
  num=$(printf "%02d" $idx)
  filename="${num}_$(basename $p)"
  [[ "$filename" == "_" ]] && filename="${num}_index"
  pdf="$TMPDIR/${filename}.pdf"

  echo "[$num] Warming up → $url"
  curl -sSL "$url" >/dev/null || true

  vbudget=$VTIME_INITIAL
  ok=false
  for attempt in 1 2 3; do
    echo "  → intento $attempt (virtual-time-budget=${vbudget} ms)"
    print_page "$url" "$pdf" "$vbudget" || true
    if [[ -s "$pdf" ]]; then
      size=$(stat -c%s "$pdf" 2>/dev/null || stat -f%z "$pdf")
      if [[ "$size" -ge 60000 ]]; then
        ok=true
        break
      fi
    fi
    vbudget=$(( vbudget + 10000 ))
    sleep 1
  done

  if [[ "$ok" == false ]]; then
    echo "⚠️  Advertencia: $pdf parece pequeño. Continuo igualmente."
  fi

  PDFS+=("$pdf")
  ((idx++))
done

echo "Uniendo PDFs en orden → $OUT"
pdfunite "${PDFS[@]}" "$OUT"

echo "✅ Listo: $OUT"
