#!/usr/bin/env python3

import asyncio
from pathlib import Path
from pikepdf import Pdf
from playwright.async_api import async_playwright, TimeoutError as PWTimeout

# ===== CONFIG =====
BASE = "http://localhost:1313/p5.quadrille.js/"  # e.g. "http://localhost:1313/"

# High-level order from your overview + subsections in a consistent, logical order
PATHS = [
    # Section index
    "docs/mutators/",

    # Top-level single-page methods
    "docs/mutators/delete/",
    "docs/mutators/insert/",
    "docs/mutators/shift/",
    "docs/mutators/randomize/",

    # rand (index + pages)
    "docs/mutators/rand/",
    "docs/mutators/rand/rand_times/",
    "docs/mutators/rand/rand_times_value/",

    # swap (index + pages)
    "docs/mutators/swap/",
    "docs/mutators/swap/swap_cell1_cell2/",
    "docs/mutators/swap/swap_row1_row2/",

    # replace (index + pages)
    "docs/mutators/replace/",
    "docs/mutators/replace/replace_value/",
    "docs/mutators/replace/replace_value1_value2/",

    # clear (index + pages)
    "docs/mutators/clear/",
    "docs/mutators/clear/clear_noargs/",
    "docs/mutators/clear/clear_row/",
    "docs/mutators/clear/clear_row_col/",
    "docs/mutators/clear/clear_row_col_border/",
    "docs/mutators/clear/clear_row_col_directions/",
    "docs/mutators/clear/clear_row_col_directions_border/",
    "docs/mutators/clear/clear_predicate/",
    "docs/mutators/clear/clear_bitboard/",

    # fill (index + pages)
    "docs/mutators/fill/",
    "docs/mutators/fill/fill_noargs/",
    "docs/mutators/fill/fill_value/",
    "docs/mutators/fill/fill_row_value/",
    "docs/mutators/fill/fill_row_col_value/",
    "docs/mutators/fill/fill_row_col_value_border/",
    "docs/mutators/fill/fill_row_col_value_directions/",
    "docs/mutators/fill/fill_row_col_value_directions_border/",
    "docs/mutators/fill/fill_color_color/",
    "docs/mutators/fill/fill_predicate_value/",
    "docs/mutators/fill/fill_bitboard_value/",
]

# Assets to warm up for caching (prevent blank frames before print)
ASSETS = [
    "docs/mutators/mandrill.png",
    "images/pola.jpg",           # common in many examples
    "fonts/noto_sans.ttf",       # if used by some demos
]

OUT = "mutators-section.pdf"

VIEWPORT = {"width": 1600, "height": 2400}
SCROLL_STEPS = 14
SCROLL_PAUSE_MS = 200
EXTRA_CANVAS_WAIT_MS = 900
EXTRA_IMAGE_WAIT_MS = 400
NAV_TIMEOUT_MS = 45000

# margins applied to EVERY page (fixes top margin on multipage <pre>)
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
    # Progressive scroll to trigger lazy content & canvas draws
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
    # Wait until all <img> elements are decoded and complete
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
    # Wait until canvases exist and have valid size
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
    # uses Playwright's managed Chromium (installed via: python -m playwright install chromium)
    browser = await play.chromium.launch(headless=True, args=LAUNCH_ARGS)
    ctx = await browser.new_context(viewport=VIEWPORT)
    page = await ctx.new_page()

    await page.emulate_media(media="print")
    await page.goto(f"{base}{rel_path}", wait_until="networkidle", timeout=NAV_TIMEOUT_MS)

    await scroll_page(page)
    await wait_images(page)
    await wait_canvases(page)

    # Optional print CSS to avoid awkward breaks
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
    # Touch assets to encourage caching in a quick context
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
    tmp = Path(".playwright-mutators-tmp")
    tmp.mkdir(exist_ok=True)
    pdfs = []

    async with async_playwright() as play:
        # Warm-up assets (optional but helps with first-frame renders)
        if ASSETS:
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
