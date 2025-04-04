[![p5.js](https://img.shields.io/badge/p5.js-ED225D?logo=p5.js&logoColor=white)](https://p5js.org/)
[![p5.quadrille.js API](https://img.shields.io/badge/p5.quadrille.js_API-ED225D?logo=p5.js&logoColor=white)](https://objetos.github.io/p5.quadrille.js/)
[![Book Draft](https://img.shields.io/badge/Book_Draft-228B22?logo=mdbook)](https://objetos.github.io/docs/)
[![SoftwareX Paper](https://img.shields.io/badge/SoftwareX_Paper-0066CC?logo=livejournal)](https://www.sciencedirect.com/science/article/pii/S2352711024002097)
[![Blog](https://img.shields.io/badge/Blog-0A0A0A?logo=dev.to&logoColor=white)](https://jpcharalambosh.co/tags/p5.quadrille.js/)

# p5.quadrille.js

Welcome to the **p5.quadrille.js** source code repository. This open-source [p5.js](https://p5js.org/) library offers a simple yet powerful API for grid-based creative coding, game design, and visual computing. Most methods are demonstrated with interactive sketches for hands-on exploration.

![Quadrille cells sorted by luminance](p5.quadrille.js.png)

- [Usage](#usage)
- [Algorithms \& Performance](#algorithms--performance)
- [Adoption](#adoption)
- [Releases](#releases)
- [System Requirements](#system-requirements)
- [Contribute](#contribute)
- [Further Reading](#further-reading)

# Usage

At its core, using **p5.quadrille.js** can be as minimal or as interactive as you need:

- **2 steps** — storage only: declare and create the quadrille.  
- **3 steps** — add rendering: use `drawQuadrille()` in `draw()`.  
- **4 steps** — add interactivity: call a mutator method (e.g. `fill()`, `clear()`, `replace()`) inside an event like `keyPressed()` or `mousePressed()`.

```js
let q; // Step 1: Declare

function setup() {
  createCanvas(600, 400);
  q = createQuadrille(6, 4); // Step 2: Create
}

function draw() {
  drawQuadrille(q); // Step 3: Render
}

function mousePressed() {
  q.randomize(); // Step 4: Interact
}
```

That’s it—you’re ready to create, display, and manipulate grid-based content.

# Algorithms & Performance

Let `n` be the total number of cells in the quadrille.

- **Grid Operations:** `O(n)` — Applies to transformations and cell iteration via `visitQuadrille()`.  
- **Image Filtering:** `O(n × k²)` — Where `k` is the kernel width/height (assumed square).  
- **Pattern Search & Merging:** `O(n × m)` — Where `m` is the number of cells in the pattern or quadrille being searched/merged.  
- **Drawing:** `O(n)` — Efficient rendering using the p5.js canvas.

**Observations:**

- Optimized for grid-based games and interactive applications, including WebGL-heavy scenarios. Supports rendering JavaScript functions via [`p5.Framebuffer`](https://p5js.org/reference/p5/p5.Framebuffer/) for advanced effects.  
- Produces deterministic results—identical inputs always yield the same outputs.  
- Maintains a clear distinction between mutable and immutable methods, promoting API integrity and predictable behavior.

# Adoption

- Tested in real-world scenarios:  
  – Object-Oriented Programming courses at UNAL.  
  – National and international game jams with the UNGames group.  
- Fosters creativity and problem-solving in both classroom and jam settings.  
- Publicly showcased at [objetos.github.io/docs/showcase](https://objetos.github.io/docs/showcase/), featuring student projects, games, and demos.

# Releases

- [p5.quadrille.js (raw)](https://raw.githubusercontent.com/objetos/p5.quadrille.js/main/p5.quadrille.js)  
- Content Delivery Network (CDN):  
  – [p5.quadrille.js (unminified)](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js)  
  – [p5.quadrille.min.js](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js)  
- [All releases on GitHub](https://github.com/objetos/p5.quadrille.js/releases)

# System Requirements

- **Hardware:** Any modern device—PC, phone, or tablet—with a browser supporting [ES6](https://www.w3schools.com/JS/js_es6.asp) (Firefox 54+, Chrome 51+, Safari 10+, Edge 15+, Opera 38+).  
- **Software:** Like any p5.js sketch—just include **p5.js** (v1+ or v2 beta) and **p5.quadrille.js** via [local file or CDN](#releases).

**Observation**: The library leverages [p5.js](https://p5js.org/) for rendering and modern browser APIs for performance. [WebGL](https://en.wikipedia.org/wiki/WebGL) enhances 3D/GPU examples but is optional.

# Contribute

Your contributions are welcome!

## Support  

Use the [bug report](https://github.com/objetos/p5.quadrille.js/blob/main/.github/ISSUE_TEMPLATE/bug_report.md) or [feature request](https://github.com/objetos/p5.quadrille.js/blob/main/.github/ISSUE_TEMPLATE/feature_request.md) templates to report issues or suggest new features.

## Open TODOs  

Fork the repo and submit a pull request to help with any of the following ([GitHub Guide](https://docs.github.com/en/get-started/quickstart/contributing-to-projects)):

1. Implement `isPolyomino()`  
2. Add `perlin()` and `simplex()` noise-based utilities  
3. Extend `sort()` to support `'webgl'` mode — requires `Framebuffer` support for `sample()` (currently limited to the `P2D` renderer)  
4. Add `WEBGL` support for `screenRow()` and `screenCol()` — may depend on features from [p5.treegl](https://github.com/VisualComputing/p5.treegl/)

# Further Reading

- [![p5.js](https://img.shields.io/badge/p5.js-ED225D?logo=p5.js&logoColor=white)](https://p5js.org/)  
  The creative coding library powering this project. From newcomers to advanced users—explore the [reference](https://p5js.org/reference/), [examples](https://p5js.org/examples/), [tutorials](https://p5js.org/learn/), and [libraries](https://p5js.org/libraries/).
- [![p5.quadrille.js API](https://img.shields.io/badge/p5.quadrille.js_API-ED225D?logo=p5.js&logoColor=white)](https://objetos.github.io/p5.quadrille.js/)  
  Browse the full API reference, including all methods, usage patterns, and detailed explanations—each with interactive examples. Start with `createQuadrille()` and `drawQuadrille()`, then explore shape manipulation, color handling, I/O, WebGL rendering, and more.
- [![Book Draft](https://img.shields.io/badge/Book_Draft-228B22?logo=mdbook)](https://objetos.github.io/docs/)  
  An evolving educational resource covering:  
  – Object-Oriented and Functional Programming essentials  
  – Game design principles  
  – Tutorials & step-by-step guides  
  – Real-world projects by students and jam participants  
  – Advanced demos by the author
- [![SoftwareX Paper](https://img.shields.io/badge/SoftwareX_Paper-0066CC?logo=livejournal)](https://www.sciencedirect.com/science/article/pii/S2352711024002097)  
  Published in *SoftwareX*. Goes beyond technical documentation—explains the motivation, research hypothesis, design rationale, and internal architecture of **p5.quadrille.js**.
- [![Source Code](https://img.shields.io/badge/Source_Code-181717?logo=github)](https://github.com/objetos/p5.quadrille.js)  
  Official GitHub repository.  
  – Fork the repo and contribute via pull requests ([GitHub Guide](https://docs.github.com/en/get-started/quickstart/contributing-to-projects))  
  – Use the [bug report](https://github.com/objetos/p5.quadrille.js/blob/main/.github/ISSUE_TEMPLATE/bug_report.md) or [feature request](https://github.com/objetos/p5.quadrille.js/blob/main/.github/ISSUE_TEMPLATE/feature_request.md) templates for support
- [![Blog](https://img.shields.io/badge/Blog-0A0A0A?logo=dev.to&logoColor=white)](https://jpcharalambosh.co/tags/p5.quadrille.js/)  
  Experimental features, new ideas, and early previews shaping future versions of the library.