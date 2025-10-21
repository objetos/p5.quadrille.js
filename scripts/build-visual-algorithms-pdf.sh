#!/usr/bin/env zsh
set -euo pipefail

# === CONFIG ===
BASE="http://localhost:1313/p5.quadrille.js/"  # e.g. "http://localhost:1313/"

PATHS=(
  "docs/visual_algorithms/"
  "docs/visual_algorithms/filter/"
  "docs/visual_algorithms/sort/"
  "docs/visual_algorithms/sample/"
  "docs/visual_algorithms/rasterize/"
  "docs/visual_algorithms/colorize/"
  "docs/visual_algorithms/rasterize_triangle/"
  "docs/visual_algorithms/colorize_triangle/"
)

# Assets pesados (warm-up opcional)
ASSETS=(
  "docs/visual_algorithms/mandrill.png"
  "docs/visual_algorithms/p1.jpg"  "docs/visual_algorithms/p2.jpg"
  "docs/visual_algorithms/p3.jpg"  "docs/visual_algorithms/p4.jpg"
  "docs/visual_algorithms/p5.jpg"  "docs/visual_algorithms/p6.jpg"
  "docs/visual_algorithms/p7.jpg"  "docs/visual_algorithms/p8.jpg"
  "docs/visual_algorithms/p9.jpg"  "docs/visual_algorithms/p10.jpg"
  "docs/visual_algorithms/p11.jpg" "docs/visual_algorithms/p12.jpg"
  "docs/visual_algorithms/p13.jpg" "docs/visual_algorithms/p14.jpg"
  "docs/visual_algorithms/p15.jpg" "docs/visual_algorithms/p16.jpg"
  "docs/visual_algorithms/p17.jpg" "docs/visual_algorithms/p18.jpg"
  "docs/visual_algorithms/p19.jpg" "docs/visual_algorithms/p20.jpg"
  "docs/visual_algorithms/p21.jpg" "docs/visual_algorithms/p22.jpg"
  "docs/visual_algorithms/p23.jpg" "docs/visual_algorithms/p24.jpg"
  "docs/visual_algorithms/p25.jpg" "docs/visual_algorithms/p26.jpg"
  "docs/visual_algorithms/p27.jpg" "docs/visual_algorithms/p28.jpg"
  "docs/visual_algorithms/p29.jpg" "docs/visual_algorithms/p30.jpg"
)

OUT="visual-algorithms-section.pdf"

# Presupuesto inicial y reintentos (exponencial)
VTIME_INITIAL=20000    # 20s
RETRIES=4              # 20s, 30s, 45s, 60s

# === REQS ===
command -v chromium >/dev/null 2>&1 || { echo "❌ Falta 'chromium'"; exit 1; }
command -v pdfunite >/dev/null 2>&1 || { echo "❌ Falta 'pdfunite' (poppler)"; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "❌ Falta 'curl'"; exit 1; }

# Verifica que Hugo esté arriba
curl -fsS "${BASE}" >/dev/null || { echo "❌ No puedo alcanzar ${BASE}. ¿Está 'hugo server' corriendo?"; exit 1; }

TMPDIR=$(mktemp -d)
cleanup() { rm -rf "$TMPDIR"; }
trap cleanup EXIT

print_page() {
  local url="$1"
  local pdf="$2"
  local vbudget="$3"
  chromium \
    --headless=new \
    --no-pdf-header-footer \
    --hide-scrollbars \
    --window-size=1600,2400 \
    \
    --enable-unsafe-swiftshader \
    --use-gl=swiftshader \
    --use-angle=swiftshader \
    --disable-vulkan \
    --disable-gpu \
    \
    --run-all-compositor-stages-before-draw \
    --virtual-time-budget="${vbudget}" \
    --print-to-pdf="$pdf" \
    "$url"
}

echo "Warm-up de assets (opcional)…"
for a in "${ASSETS[@]}"; do
  curl -sSL --max-time 5 "${BASE}${a}" >/dev/null || true
done

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
  curl -sSL --max-time 10 "$url" >/dev/null || true

  vbudget=$VTIME_INITIAL
  ok=false
  for attempt in $(seq 1 $RETRIES); do
    echo "  → intento $attempt (virtual-time-budget=${vbudget} ms)"
    print_page "$url" "$pdf" "$vbudget" || true

    if [[ -s "$pdf" ]]; then
      size=$(stat -c%s "$pdf" 2>/dev/null || stat -f%z "$pdf")
      if [[ "$size" -ge 60000 ]]; then
        ok=true
        break
      fi
    fi
    # backoff exponencial suave
    if (( attempt < RETRIES )); then
      vbudget=$(( vbudget + (attempt==1 ? 10000 : (attempt==2 ? 15000 : 15000)) ))
      sleep 1
    fi
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
