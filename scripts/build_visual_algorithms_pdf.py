#!/usr/bin/env python3

import asyncio
from pathlib import Path
from pikepdf import Pdf
from playwright.async_api import async_playwright, TimeoutError as PWTimeout

# ===== CONFIG =====
BASE = "http://localhost:1313/p5.quadrille.js/"

PATHS = [
    "docs/visual_algorithms/",
    "docs/visual_algorithms/filter/",
    "docs/visual_algorithms/sort/",
    "docs/visual_algorithms/sample/",
    "docs/visual_algorithms/rasterize/",
    "docs/visual_algorithms/colorize/",
    "docs/visual_algorithms/rasterize_triangle/",
    "docs/visual_algorithms/colorize_triangle/",
]

# Heavy assets (optional warm-up)
ASSETS = [
    "docs/visual_algorithms/mandrill.png",
    "docs/visual_algorithms/p1.jpg",  "docs/visual_algorithms/p2.jpg",
    "docs/visual_algorithms/p3.jpg",  "docs/visual_algorithms/p4.jpg",
    "docs/visual_algorithms/p5.jpg",  "docs/visual_algorithms/p6.jpg",
    "docs/visual_algorithms/p7.jpg",  "docs/visual_algorithms/p8.jpg",
    "docs/visual_algorithms/p9.jpg",  "docs/visual_algorithms/p10.jpg",
    "docs/visual_algorithms/p11.jpg", "docs/visual_algorithms/p12.jpg",
    "docs/visual_algorithms/p13.jpg", "docs/visual_algorithms/p14.jpg",
    "docs/visual_algorithms/p15.jpg", "docs/visual_algorithms/p16.jpg",
    "docs/visual_algorithms/p17.jpg", "docs/visual_algorithms/p18.jpg",
    "docs/visual_algorithms/p19.jpg", "docs/visual_algorithms/p20.jpg",
    "docs/visual_algorithms/p21.jpg", "docs/visual_algorithms/p22.jpg",
    "docs/visual_algorithms/p23.jpg", "docs/visual_algorithms/p24.jpg",
    "docs/visual_algorithms/p25.jpg", "docs/visual_algorithms/p26.jpg",
    "docs/visual_algorithms/p27.jpg", "docs/visual_algorithms/p28.jpg",
    "docs/visual_algorithms/p29.jpg", "docs/visual_algorithms/p30.jpg",
]

OUT = "visual-algorithms-section.pdf"

# Retry budgets (extra waits after page fully idle)
EXTRA_WAITS_MS = [20000, 30000, 45000, 60000]
RETRIES = len(EXTRA_WAITS_MS)
MIN_PDF_SIZE = 60000  # bytes

VIEWPORT = {"width": 1600, "height": 2400}
SCROLL_STEPS = 14
SCROLL_PAUSE_MS = 200
EXTRA_CANVAS_WAIT_MS = 900
EXTRA_IMAGE_WAIT_MS = 400
NAV_TIMEOUT_MS = 60000  # a bit higher for heavy pages

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
            timeout=20000
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
            timeout=20000
        )
    except PWTimeout:
        pass
    await page.wait_for_timeout(EXTRA_CANVAS_WAIT_MS)


async def warm_assets(ctx, base: str, assets: list[str]):
    # Soft-warm large assets into Chromium cache
    for a in assets:
        url = f"{base}{a}"
        try:
            await ctx.request.get(url, timeout=5000)
        except Exception:
            pass


async def render_to_pdf(play, base: str, rel_path: str, target: Path, extra_wait_ms: int) -> bool:
    browser = await play.chromium.launch(headless=True, args=LAUNCH_ARGS)
    ctx = await browser.new_context(viewport=VIEWPORT)
    page = await ctx.new_page()

    try:
        await page.emulate_media(media="print")
        # Pre-warm this page once (helps CSS, images)
        try:
            await ctx.request.get(f"{base}{rel_path}", timeout=10000)
        except Exception:
            pass

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

        # Extra wait budget (mimics --virtual-time-budget for heavy demos)
        if extra_wait_ms > 0:
            await page.wait_for_timeout(extra_wait_ms)

        await page.pdf(
            path=str(target),
            print_background=True,
            display_header_footer=False,
            prefer_css_page_size=True,
            margin=PRINT_MARGIN,
            scale=1.0
        )

    finally:
        await ctx.close()
        await browser.close()

    return target.exists() and target.stat().st_size >= MIN_PDF_SIZE


async def main():
    tmp = Path(".playwright-visual-algorithms-tmp")
    tmp.mkdir(exist_ok=True)
    pdfs = []

    async with async_playwright() as play:
        # Warm-up heavy assets globally
        print("Warm-up de assets (opcional)…")
        # Use a short-lived context for asset prefetch
        pre_ctx = await play.chromium.launch(headless=True, args=LAUNCH_ARGS)
        pre_browser_ctx = await pre_ctx.new_context(viewport=VIEWPORT)
        try:
            await warm_assets(pre_browser_ctx, BASE, ASSETS)
        finally:
            await pre_browser_ctx.close()
            await pre_ctx.close()

        # Render pages with retries and growing wait budgets
        for i, p in enumerate(PATHS, start=1):
            name_part = (Path(p).name or "index")
            name = f"{i:02d}_{name_part}.pdf"
            target = tmp / name
            print(f"[{i:02d}] {BASE}{p} -> {target}")

            ok = False
            for attempt, extra_wait in enumerate(EXTRA_WAITS_MS, start=1):
                print(f"  → intento {attempt} (extra-wait={extra_wait} ms)")
                try:
                    # Remove previous attempt file if exists
                    if target.exists():
                        target.unlink()
                    ok = await render_to_pdf(play, BASE, p, target, extra_wait)
                    if ok:
                        break
                except Exception as e:
                    print(f"    ⚠️  Error en intento {attempt}: {e}")

            if not ok:
                print(f"⚠️  Advertencia: {target.name} parece pequeño o vacío. Continuo igualmente.")
            pdfs.append(target)

    # Merge
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
