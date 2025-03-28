---
title: Introduction
type: docs
aliases:
  - /p5.quadrille.js/api
---

[![p5.js](https://img.shields.io/badge/p5.js-ED225D?logo=p5.js&logoColor=white)](https://p5js.org/)
[![Book Draft](https://img.shields.io/badge/Book_Draft-228B22?logo=mdbook)](https://objetos.github.io/docs/)
[![SoftwareX Paper](https://img.shields.io/badge/SoftwareX_Paper-0066CC?logo=livejournal)](https://www.sciencedirect.com/science/article/pii/S2352711024002097)
[![Source Code](https://img.shields.io/badge/Source_Code-181717?logo=github)](https://github.com/objetos/p5.quadrille.js)
[![Blog](https://img.shields.io/badge/Blog-0A0A0A?logo=dev.to&logoColor=white)](https://jpcharalambosh.co/tags/p5.quadrille.js/)

# p5.quadrille.js API

Welcome to the [p5.quadrille.js](https://github.com/objetos/p5.quadrille.js) Application Programming Interface (API). This open-source [p5.js](https://p5js.org/) library provides a simple yet powerful API for grid-based creative coding, game design, and visual computing. Most methods are illustrated with interactive sketches to help you explore their use.

![Quadrille cells sorted by their luminance levels.](p5.quadrille.js.png)

At the heart of the library lies the `Quadrille` class, coupled with some [p5.js functions]({{< ref "p5_functions" >}}) that allow manipulation and customization of the quadrille's visual appearance. The class provides a set of [properties]({{< ref "properties" >}}), some read-only like [mouseRow]({{< ref "mouse_row" >}}), [mouseCol]({{< ref "mouse_col" >}}), [size]({{< ref "size" >}}), and [order]({{< ref "order" >}}), and others read-write such as [width]({{< ref "width" >}}), [height]({{< ref "height" >}}), and [memory2D]({{< ref "memory_2d" >}}). The class also offers methods to perform geometric [transformations]({{< ref "transforms" >}}), conduct [algebraic operations]({{< ref "algebra" >}}) inspired by [constructive solid geometry](https://en.wikipedia.org/wiki/Constructive_solid_geometry), and perform [visualizations]({{< ref "visual_algorithms" >}}) involving image filtering with [convolution matrices](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29) and [triangle rasterization](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/). Additionally, the class includes various [accessors]({{< ref "accessors" >}}) such as [queries]({{< ref "queries" >}}), [cell contents]({{< ref "cell_contents" >}}), and [instance creators]({{< ref "instance_creators" >}}), along with [mutators]({{< ref "mutators" >}}) like [delete]({{< ref "delete" >}}), [insert]({{< ref "insert" >}}), [randomize]({{< ref "randomize" >}}), [rand]({{< ref "rand" >}}), [swap]({{< ref "swap" >}}), [replace]({{< ref "replace" >}}), [clear]({{< ref "clear" >}}), [fill]({{< ref "fill" >}}), and [sort]({{< ref "sort" >}}) (used to order the images within the logo above), which allow for detailed customization and manipulation of the quadrille's state. Moreover, [reformatters]({{< ref "reformatter" >}}) within the library enable seamless transformation between quadrille instances and various data formats, such as [arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [images](https://p5js.org/reference/#/p5.Image), [bitboards](https://en.wikipedia.org/wiki/Bitboard), and [Forsyth–Edwards Notation (FEN)](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) chess board positions.

# p5.js Web Editor

To start coding right away, right-click the sketch title (`quadrille-api-intro`) and choose “Open Link in New Tab” to edit it directly in the [p5.js Web Editor](https://editor.p5js.org).

(Mouse press randomizes the `quadrille` [Pola](https://en.wikipedia.org/wiki/Policarpa_Salavarrieta); key press resets it.)  
<iframe src="https://editor.p5js.org/nakednous/full/FHb4aijva" width="400" height="442"></iframe>

{{< callout type="info" >}}
Why not take it further? After using the randomizer, try building a simple puzzle game—start by experimenting with [swap(cell1, cell2)]({{< relref "swap_cell1_cell2" >}}) to implement the core mechanic for solving it.
{{< /callout >}}

This sketch demonstrates the complete [4-step `p5.quadrille.js` usage workflow](https://github.com/objetos/p5.quadrille.js?tab=readme-ov-file#usage):

1. **Declare** a `Quadrille` variable.  
2. **Create** it in `setup()`.  
3. **Render** it in `draw()` using [drawQuadrille]({{< relref "create_quadrille_noargs" >}}).  
4. **Interact** through events like `mousePressed()`, calling mutator methods such as [randomize()]({{< relref "randomize" >}}).

To replicate this locally or in the Web Editor, make sure your `index.html` includes:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.3/p5.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.3/addons/p5.sound.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js"></script>
```

Refer to the [Releases](#releases) section below for the latest versions.

{{< callout type="warning" >}}
Note that with **p5.js**, there’s no **“installation”** in the traditional sense. You simply include the necessary scripts to get started. See the [official guide](https://p5js.org/tutorials/setting-up-your-environment/) or the [Getting Started section](https://objetos.github.io/docs/p5_intro/getting_started/#html-template-for-local-development) in the book draft for local setup instructions.
{{< /callout >}}

# Releases

- [p5.quadrille.js (raw)](https://raw.githubusercontent.com/objetos/p5.quadrille.js/main/p5.quadrille.js)  
- Content Delivery Network (CDN):  
  – [p5.quadrille.js (unminified)](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js)  
  – [p5.quadrille.min.js](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js)  
- [All Releases on GitHub](https://github.com/objetos/p5.quadrille.js/releases)

# System Requirements

- **Hardware:** Any modern device—PC, phone, or tablet—with a recent web browser that supports [ES6](https://www.w3schools.com/JS/js_es6.asp) (Firefox 54+, Chrome 51+, Opera 38+, Safari 10+, Edge 15+).
- **Software:** Just like any p5.js sketch—include **p5.js** (v1+ stable or the upcoming v2 currently in beta), along with **p5.quadrille.js** (via [local file or CDN](#releases)).

# Further Reading

- [![p5.js](https://img.shields.io/badge/p5.js-ED225D?logo=p5.js&logoColor=white)](https://p5js.org/)  
  The creative coding library powering this project. From newcomers to advanced users—explore the [reference](https://p5js.org/reference/), [examples](https://p5js.org/examples/), [tutorials](https://p5js.org/learn/), and [libraries](https://p5js.org/libraries/).
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