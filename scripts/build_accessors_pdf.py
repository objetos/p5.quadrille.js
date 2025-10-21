#!/usr/bin/env python3

import asyncio
from pathlib import Path
from pikepdf import Pdf
from playwright.async_api import async_playwright, TimeoutError as PWTimeout

# ===== CONFIG =====
BASE = "http://localhost:1313/p5.quadrille.js/"

# Order: section index → cell_contents → instance_creators → queries (EN only)
PATHS = [
    # Section index
    "docs/accessors/",
    
    # queries (index + pages)
    "docs/accessors/queries/",
    "docs/accessors/queries/bit_cell/",
    "docs/accessors/queries/bit_index/",
    "docs/accessors/queries/magnitude/",
    "docs/accessors/queries/screen_col/",
    "docs/accessors/queries/screen_row/",
    "docs/accessors/queries/search/",

    # cell_contents (index + pages)
    "docs/accessors/cell_contents/",
    "docs/accessors/cell_contents/is_array/",
    "docs/accessors/cell_contents/is_bigint/",
    "docs/accessors/cell_contents/is_boolean/",
    "docs/accessors/cell_contents/is_color/",
    "docs/accessors/cell_contents/is_empty/",
    "docs/accessors/cell_contents/is_filled/",
    "docs/accessors/cell_contents/is_function/",
    "docs/accessors/cell_contents/is_image/",
    "docs/accessors/cell_contents/is_number/",
    "docs/accessors/cell_contents/is_object/",
    "docs/accessors/cell_contents/is_string/",
    "docs/accessors/cell_contents/is_symbol/",
    "docs/accessors/cell_contents/is_valid/",
    "docs/accessors/cell_contents/read/",

    # instance_creators (index + pages)
    "docs/accessors/instance_creators/",
    "docs/accessors/instance_creators/clone/",
    "docs/accessors/instance_creators/crop/",
    "docs/accessors/instance_creators/ring/",
    "docs/accessors/instance_creators/row/",
]

# Optional warm-up of local assets used in this section
ASSETS = [
    "docs/accessors/abraham_lincoln.jpg",
]

OUT = "accessors-section.pdf"

VIEWPORT = {"width": 1600, "height": 2400}
SCROLL_STEPS = 14
SCROLL_PAUSE_MS = 200
EXTRA_CANVAS_WAIT_MS = 900
EXTRA_IMAGE_WAIT_MS = 400
NAV_TIMEOUT_MS = 45000

PRINT_MARGIN = {"top": "14mm", "right": "14mm", "bottom": "14mm", "left": "14mm"}

LAUNCH_ARGS = [
    "--disable-gpu",
    "--disable-vulkan",
    "--use-gl=swiftshader",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--hide-scrollbars",
    "--font-render-hinting=medium",
    "--run-all-compositor-stages-before-draw",
]
# ===================

async def scroll_page(page):
    await page.evaluate(
        """
        async ({steps, pause}) => {
          const total = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight
          );
          const step = Math.max(1, Math.round((total - window.innerHeight)/steps));
          for (let i = 0; i < steps; i++) {
            window.scrollBy(0, step);
            await new Promise(r => setTimeout(r, pause));
          }
          window.scrollTo(0, 0);
        }
        """,
        {"steps": SCROLL_STEPS, "pause": SCROLL_PAUSE_MS}
    )

async def wait_images(page):
    try:
        await page.wait_for_function(
            """
            async () => {
              const imgs = Array.from(document.images || []);
              if (imgs.length === 0) return true;
              await Promise.all(imgs.map(img => img.decode?.().catch(()=>{})));
              return imgs.every(img => img.complete);
            }
            """,
            timeout=15000
        )
    except PWTimeout:
        pass
    await page.wait_for_timeout(EXTRA_IMAGE_WAIT_MS)

async def wait_canvases(page):
    try:
        await page.wait_for_function(
            """
            () => {
              const cs = Array.from(document.querySelectorAll('canvas'));
              if (cs.length === 0) return true;
              return cs.every(c => (c.width|0) > 0 && (c.height|0) > 0);
            }
            """,
            timeout=18000
        )
    except PWTimeout:
        pass
    await page.wait_for_timeout(EXTRA_CANVAS_WAIT_MS)

async def render_to_pdf(play, base: str, rel_path: str, target: Path):
    browser = await play.chromium.launch(headless=True, args=LAUNCH_ARGS)
    ctx = await browser.new_context(viewport=VIEWPORT)
    page = await ctx.new_page()

    await page.emulate_media(media="print")
    await page.goto(f"{base}{rel_path}", wait_until="networkidle", timeout=NAV_TIMEOUT_MS)

    await scroll_page(page)
    await wait_images(page)
    await wait_canvases(page)

    await page.add_style_tag(content="""
      @media print {
        h1, h2, h3, table { page-break-inside: avoid; break-inside: avoid; }
        pre, code { overflow-wrap: anywhere; }
      }
    """)

    await page.pdf(
        path=str(target),
        print_background=True,
        display_header_footer=False,
        prefer_css_page_size=True,
        margin=PRINT_MARGIN,
        scale=1.0
    )

    await ctx.close()
    await browser.close()

async def warmup_assets(play, base: str, assets: list[str]):
    if not assets:
        return
    browser = await play.chromium.launch(headless=True, args=LAUNCH_ARGS)
    ctx = await browser.new_context(viewport=VIEWPORT)
    for a in assets:
        try:
            p = await ctx.new_page()
            await p.goto(f"{base}{a}", wait_until="domcontentloaded", timeout=10000)
            await p.close()
        except Exception:
            pass
    await ctx.close()
    await browser.close()

async def main():
    tmp = Path(".playwright-accessors-tmp")
    tmp.mkdir(exist_ok=True)
    pdfs = []

    async with async_playwright() as play:
        await warmup_assets(play, BASE, ASSETS)

        for i, p in enumerate(PATHS, start=1):
            name = f"{i:02d}_{(Path(p).name or 'index')}.pdf"
            target = tmp / name
            print(f"[{i:02d}] {BASE}{p} -> {target}")
            try:
                await render_to_pdf(play, BASE, p, target)
                pdfs.append(target)
            except Exception as e:
                print(f"⚠️  Error en {p}: {e}. Continuo…")

    out = Path(OUT)
    if out.exists():
        out.unlink()
    merged = Pdf.new()
    for f in pdfs:
        if not f.exists() or f.stat().st_size == 0:
            print(f"⚠️  Saltando {f.name} (no existe o vacío)")
            continue
        with Pdf.open(f) as src:
            merged.pages.extend(src.pages)
    merged.save(out)
    print(f"✅ Listo: {out}")

if __name__ == "__main__":
    asyncio.run(main())
