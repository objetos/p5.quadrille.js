#!/usr/bin/env python3

import asyncio
from pathlib import Path
from pikepdf import Pdf
from playwright.async_api import async_playwright, TimeoutError as PWTimeout

# ===== CONFIG =====
BASE = "http://localhost:1313/p5.quadrille.js/"  # e.g. "http://localhost:1313/"

PATHS = [
    "docs/reformatter/",        # section index
    "docs/reformatter/to_array/",
    "docs/reformatter/to_bigint/",
    "docs/reformatter/to_image/",
    "docs/reformatter/to_fen/",
]

OUT = "reformatter-section.pdf"

VIEWPORT = {"width": 1600, "height": 2400}
SCROLL_STEPS = 14
SCROLL_PAUSE_MS = 200
EXTRA_CANVAS_WAIT_MS = 900
EXTRA_IMAGE_WAIT_MS = 400
NAV_TIMEOUT_MS = 45000

# margins applied to every page (ensures top space on continuations)
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
    # Progressive scroll to trigger lazy content and canvas draws
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


async def main():
    tmp = Path(".playwright-reformatter-tmp")
    tmp.mkdir(exist_ok=True)
    pdfs = []

    async with async_playwright() as play:
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
