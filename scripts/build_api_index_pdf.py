#!/usr/bin/env python3

import asyncio
from pathlib import Path
from playwright.async_api import async_playwright, TimeoutError as PWTimeout

# ===== CONFIG =====
BASE = "http://localhost:1313/p5.quadrille.js/"  # e.g. "http://localhost:1313/"
API_INDEX = "docs/"              # _index.md for the Quadrille API
OUT = "quadrille-api-index.pdf"

VIEWPORT = {"width": 1600, "height": 2400}
NAV_TIMEOUT_MS = 45000
SCROLL_STEPS = 14
SCROLL_PAUSE_MS = 200
EXTRA_CANVAS_WAIT_MS = 900
EXTRA_IMAGE_WAIT_MS = 400

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

async def scroll_frame(frame):
  try:
    await frame.evaluate(
      """
      async ({steps, pause}) => {
        const total = Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight
        )
        const step = Math.max(1, Math.round((total - window.innerHeight)/steps))
        for (let i = 0; i < steps; i++) {
          window.scrollBy(0, step)
          await new Promise(r => setTimeout(r, pause))
        }
        window.scrollTo(0, 0)
      }
      """,
      {"steps": SCROLL_STEPS, "pause": SCROLL_PAUSE_MS}
    )
  except Exception:
    pass

async def wait_images(frame):
  try:
    await frame.wait_for_function(
      """
      async () => {
        const imgs = Array.from(document.images || [])
        if (imgs.length === 0) return true
        await Promise.all(imgs.map(img => img.decode?.().catch(()=>{})))
        return imgs.every(img => img.complete)
      }
      """,
      timeout=15000
    )
  except PWTimeout:
    pass

async def wait_canvases(frame):
  try:
    await frame.wait_for_function(
      """
      () => {
        const cs = Array.from(document.querySelectorAll('canvas'))
        if (cs.length === 0) return true
        return cs.every(c => (c.width|0) > 0 && (c.height|0) > 0)
      }
      """,
      timeout=18000
    )
  except PWTimeout:
    pass

async def wait_media_in_frame(frame):
  # Progressive scroll (trigger lazy draws), then wait for media
  await scroll_frame(frame)
  await wait_images(frame)
  await frame.wait_for_timeout(EXTRA_IMAGE_WAIT_MS)
  await wait_canvases(frame)
  await frame.wait_for_timeout(EXTRA_CANVAS_WAIT_MS)

async def wait_everything(page):
  # Main document
  await wait_media_in_frame(page.main_frame)

  # Direct child iframes (p5-global-iframe) and any nested frames
  checked = set()
  async def dfs(f):
    if f in checked:
      return
    checked.add(f)
    await wait_media_in_frame(f)
    for c in f.child_frames:
      await dfs(c)
  for fr in page.frames:
    await dfs(fr)

async def render_api_index():
  async with async_playwright() as play:
    browser = await play.chromium.launch(headless=True, args=LAUNCH_ARGS)
    ctx = await browser.new_context(viewport=VIEWPORT)
    page = await ctx.new_page()
    await page.emulate_media(media="print")

    url = f"{BASE}{API_INDEX}"
    print(f"→ {url}")
    await page.goto(url, wait_until="networkidle", timeout=NAV_TIMEOUT_MS)

    # Gentle print CSS to reduce awkward breaks
    await page.add_style_tag(content="""
      @media print {
        h1, h2, h3, table { page-break-inside: avoid; break-inside: avoid; }
        pre, code { overflow-wrap: anywhere; }
      }
    """)

    # Wait for media across main page + iframes (p5, images, videos, canvases)
    await wait_everything(page)

    # Print
    await page.pdf(
      path=OUT,
      print_background=True,
      display_header_footer=False,
      prefer_css_page_size=True,
      margin=PRINT_MARGIN,
      scale=1.0
    )

    await ctx.close()
    await browser.close()
    print(f"✅ Done: {OUT}")

if __name__ == "__main__":
  asyncio.run(render_api_index())
