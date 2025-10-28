---
title: Introduction
type: docs
---

[![npm version](https://img.shields.io/npm/v/p5.quadrille.svg)](https://www.npmjs.com/package/p5.quadrille)
[![p5.js](https://img.shields.io/badge/p5.js-ED225D?logo=p5.js&logoColor=white)](https://beta.p5js.org/)
[![SoftwareX Paper](https://img.shields.io/badge/SoftwareX_Paper-0066CC?logo=livejournal)](https://www.sciencedirect.com/science/article/pii/S2352711024002097)
[![Source Code](https://img.shields.io/badge/Source_Code-181717?logo=github)](https://github.com/objetos/p5.quadrille.js)
[![Blog](https://img.shields.io/badge/Blog-0A0A0A?logo=dev.to&logoColor=white)](https://jpcharalambosh.co/tags/p5.quadrille.js/)
<!--
[![Book Draft](https://img.shields.io/badge/Book_Draft-228B22?logo=mdbook)](https://objetos.github.io/docs/)
-->

# p5.quadrille.js <!-- API -->

<!--Welcome to the [p5.quadrille.js](https://github.com/objetos/p5.quadrille.js) Application Programming Interface (API). This open-source [p5.js](https://beta.p5js.org/) library provides a simple yet powerful API for grid-based creative coding, game design, and visual computing. Most methods are illustrated with interactive sketches to help you explore their use.-->

The [p5.quadrille.js](https://github.com/objetos/p5.quadrille.js) open-source [p5.js](https://beta.p5js.org/) library provides a simple yet powerful API for grid-based creative coding, game design, and visual computing. Most methods are illustrated with interactive sketches to help you explore their use.

{{< figure src="p5.quadrille.js.png" caption="***Paintings sorted according to their [luma](https://en.wikipedia.org/wiki/Luma_(video)) using quadrille [sort]({{< relref sort >}})***" alt="Paintings sorted by luma using quadrille.sort()" >}}

At the heart of the library lies the `Quadrille` class, coupled with some [p5.js functions]({{< ref "p5_functions" >}}) that allow manipulation and customization of the quadrille's visual appearance. The class provides [iterators]({{< ref "iterators" >}}) for [declarative](https://en.wikipedia.org/wiki/Declarative_programming) traversal of filled or filtered cells. It also exposes a set of [properties]({{< ref "properties" >}}), some read-only like [mouseRow]({{< ref "mouse_row" >}}), [mouseCol]({{< ref "mouse_col" >}}), [size]({{< ref "size" >}}), and [order]({{< ref "order" >}}), and others read-write such as [width]({{< ref "width" >}}), [height]({{< ref "height" >}}), and [memory2D]({{< ref "memory_2d" >}}). The class also offers methods to perform geometric [transformations]({{< ref "transforms" >}}), conduct [algebraic operations]({{< ref "algebra" >}}) inspired by [constructive solid geometry](https://en.wikipedia.org/wiki/Constructive_solid_geometry), and perform [visualizations]({{< ref "visual_algorithms" >}}) involving image filtering with [convolution matrices](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29) and [triangle rasterization](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/). Additionally, the class includes various [accessors]({{< ref "accessors" >}}) such as [queries]({{< ref "queries" >}}), [cell contents]({{< ref "cell_contents" >}}), and [instance creators]({{< ref "instance_creators" >}}), along with [mutators]({{< ref "mutators" >}}) like [delete]({{< ref "delete" >}}), [insert]({{< ref "insert" >}}), [randomize]({{< ref "randomize" >}}), [rand]({{< ref "rand" >}}), [swap]({{< ref "swap" >}}), [replace]({{< ref "replace" >}}), [clear]({{< ref "clear" >}}), [fill]({{< ref "fill" >}}), and [sort]({{< ref "sort" >}}) (used to order the images within the logo above), which allow for detailed customization and manipulation of the quadrille's state. Moreover, [reformatters]({{< ref "reformatter" >}}) within the library enable seamless transformation between quadrille instances and various data formats, such as [arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [images](https://beta.p5js.org/reference/#/p5.Image), [bitboards](https://en.wikipedia.org/wiki/Bitboard), and [Forsyth–Edwards Notation (FEN)](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) chess board positions.

# p5.js Web Editor

To start coding right away, right-click the sketch title (`quadrille-api-intro`) and choose “Open Link in New Tab” to edit it directly in the [p5.js Web Editor](https://editor.p5js.org).

(Mouse press randomizes the `quadrille` [Pola](https://en.wikipedia.org/wiki/Policarpa_Salavarrieta); key press resets it.)  
<iframe src="https://editor.p5js.org/nakednous/full/FHb4aijva" width="400" height="442"></iframe>

{{< callout type="info" >}}
Why not take it further? Try implementing a simple puzzle game where the player swaps cells using [swap(cell1, cell2)]({{< relref "swap_cell1_cell2" >}}) to restore the original image after it has been randomized.
{{< /callout >}}

This sketch demonstrates the complete [4-step `p5.quadrille.js` usage workflow](https://github.com/objetos/p5.quadrille.js?tab=readme-ov-file#usage):

1. **Declare** a `Quadrille` variable.  
2. **Create** it in `setup()`.  
3. **Render** it in `draw()` using [drawQuadrille]({{< relref "create_quadrille_noargs" >}}).  
4. **Interact** through events like `mousePressed()`, calling mutator methods such as [randomize()]({{< relref "randomize" >}}).

To replicate this locally or in the Web Editor, make sure your `index.html` includes:

```html
<script src="https://cdn.jsdelivr.net/npm/p5/lib/p5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/p5.quadrille/dist/p5.quadrille.min.js"></script>
```

Refer to the [Releases](#releases) section below for the latest versions.

{{< callout type="warning" >}}
Note that with **p5.js**, there’s no **“installation”** in the traditional sense. You simply include the necessary scripts to get started. See the [official guide](https://beta.p5js.org/tutorials/setting-up-your-environment/). 
<!--
or the [Getting Started section](https://objetos.github.io/docs/p5_intro/getting_started/#html-template-for-local-development) in the book draft for local setup instructions
-->
{{< /callout >}}

# Releases

- **Latest (v3.0.0):**  
  These links always point to the latest stable version on npm.
  - [p5.quadrille.js (unminified)](https://cdn.jsdelivr.net/npm/p5.quadrille/dist/p5.quadrille.js)
  - [p5.quadrille.min.js (minified)](https://cdn.jsdelivr.net/npm/p5.quadrille/dist/p5.quadrille.min.js)
  - [npm package](https://www.npmjs.com/package/p5.quadrille)

- **Current tagged version (v3.0.0):**  
  Use these if you want to lock to a specific version.
  - [p5.quadrille@3.0.0.js (unminified)](https://cdn.jsdelivr.net/npm/p5.quadrille@3.0.0/dist/p5.quadrille.js)
  - [p5.quadrille@3.0.0.min.js (minified)](https://cdn.jsdelivr.net/npm/p5.quadrille@3.0.0/dist/p5.quadrille.min.js)
  - [npm package (v3.0.0)](https://www.npmjs.com/package/p5.quadrille/v/3.0.0)

- **Legacy (v2.x):**  
  GitHub CDN links compatible with p5 v1.
  - [p5.quadrille.js (GitHub CDN)](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js)
  - [All GitHub releases](https://github.com/objetos/p5.quadrille.js/releases)

# System Requirements

- **Hardware:** Any modern device—PC, phone, or tablet—with a browser supporting [ES6](https://www.w3schools.com/JS/js_es6.asp) (Firefox 54+, Chrome 51+, Safari 10+, Edge 15+, Opera 38+).  
- **Software:** Like any p5.js sketch—just include **p5.js** and **p5.quadrille.js** via [local file or CDN](#releases).

**Observation**: The library leverages [p5.js](https://beta.p5js.org/) for rendering and modern browser APIs for performance. [WebGL](https://en.wikipedia.org/wiki/WebGL) enhances 3D/GPU examples but is optional.

# Further Reading

- [![npm version](https://img.shields.io/npm/v/p5.quadrille.svg)](https://www.npmjs.com/package/p5.quadrille)  
  Always use the latest version of **p5.quadrille.js** from npm. Supports modern p5.js v2 and includes ESM and IIFE builds.  
  Install with `npm i p5.quadrille`.
- [![p5.js](https://img.shields.io/badge/p5.js-ED225D?logo=p5.js&logoColor=white)](https://beta.p5js.org/)  
  The creative coding library powering this project. From newcomers to advanced users—explore the [reference](https://beta.p5js.org/reference/), [examples](https://beta.p5js.org/examples/), [tutorials](https://beta.p5js.org/learn/), and [libraries](https://beta.p5js.org/libraries/).
<!-- 
- [![Book Draft](https://img.shields.io/badge/Book_Draft-228B22?logo=mdbook)](https://objetos.github.io/docs/)  
  An evolving educational resource covering:  
  – Object-Oriented and Functional Programming essentials  
  – Game design principles  
  – Tutorials & step-by-step guides  
  – Real-world projects by students and jam participants  
  – Advanced demos by the author
-->
- [![SoftwareX Paper](https://img.shields.io/badge/SoftwareX_Paper-0066CC?logo=livejournal)](https://www.sciencedirect.com/science/article/pii/S2352711024002097)  
  Published in *SoftwareX*. Goes beyond technical documentation—explains the motivation, research hypothesis, design rationale, and internal architecture of **p5.quadrille.js**.
- [![Source Code](https://img.shields.io/badge/Source_Code-181717?logo=github)](https://github.com/objetos/p5.quadrille.js)  
  Official GitHub repository.  
  – Fork the repo and contribute via pull requests ([GitHub Guide](https://docs.github.com/en/get-started/quickstart/contributing-to-projects))  
  – Use the [bug report](https://github.com/objetos/p5.quadrille.js/blob/main/.github/ISSUE_TEMPLATE/bug_report.md) or [feature request](https://github.com/objetos/p5.quadrille.js/blob/main/.github/ISSUE_TEMPLATE/feature_request.md) templates for support
- [![Blog](https://img.shields.io/badge/Blog-0A0A0A?logo=dev.to&logoColor=white)](https://jpcharalambosh.co/tags/p5.quadrille.js/)  
  Experimental features, new ideas, and early previews shaping future versions of the library.