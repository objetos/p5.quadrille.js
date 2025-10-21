#!/usr/bin/env zsh
set -euo pipefail

# Cambia BASE si tu sitio Hugo local corre en un subpath
# Ejemplo: BASE="http://localhost:1313/"
BASE="http://localhost:1313/p5.quadrille.js/"

# Rutas en el orden deseado
PATHS=(
  "docs/reformatter/"
  "docs/reformatter/to_array/"
  "docs/reformatter/to_bigint/"
  "docs/reformatter/to_image/"
  "docs/reformatter/to_fen/"
)

# Salida final
OUT="reformatter-section.pdf"

# Carpeta temporal
TMPDIR=$(mktemp -d)
cleanup() { rm -rf "$TMPDIR" }
trap cleanup EXIT

echo "Imprimiendo páginas a PDF con Chromium headless…"
PDFS=()
idx=1
for p in "${PATHS[@]}"; do
  url="${BASE}${p}"
  num=$(printf "%02d" $idx)
  filename="${num}_$(basename $p).pdf"
  pdf="$TMPDIR/$filename"
  echo "  [$num] $url -> $pdf"
  chromium --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$pdf" "$url"
  # chromium --headless --disable-gpu --print-to-pdf="$pdf" "$url"
  PDFS+=("$pdf")
  ((idx++))
done

echo "Uniendo PDFs en orden → $OUT"
pdfunite "${PDFS[@]}" "$OUT"

echo "✅ Listo: $OUT"
