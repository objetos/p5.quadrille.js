[![Read the Paper](https://img.shields.io/badge/Read%20the%20Paper-ScienceDirect-blue)](https://www.sciencedirect.com/science/article/pii/S2352711024002097?ref=cra_js_challenge&fr=RR-1)
[![User Manual](https://img.shields.io/badge/User%20Manual-Online%20Book-blue)](https://objetos.github.io/docs/)
[![API Documentation](https://img.shields.io/badge/API%20Documentation-Interactive%20Reference-blue)](https://objetos.github.io/p5.quadrille.js/)

# p5.quadrille.js

[p5.quadrille.js](https://github.com/objetos/p5.quadrille.js) is an open-source [p5.js](https://p5js.org/) library that provides a simple yet powerful API for grid-based creative coding, game design, and visual computing.

![Quadrille cells sorted by luminance](p5.quadrille.js.png)

## Table of Contents

- [p5.quadrille.js](#p5quadrillejs)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
    - [Hardware](#hardware)
    - [Software](#software)
  - [Features](#features)
  - [Documentation](#documentation)
  - [Technical Support](#technical-support)
  - [Impact \& Adoption](#impact--adoption)
  - [Installation](#installation)
  - [Contributing](#contributing)
- [Releases](#releases)

## Requirements

### Hardware
- **Minimum**: Modern web browser (Chrome, Firefox, Safari, Edge) with JavaScript support.
- **Recommended**: GPU for WebGL-based examples (common in most devices, including smartphones).

### Software
- [p5.js](https://p5js.org/) (current stable v1+, upcoming v2 currently in beta).
- Modern browser with ES6 support (Chrome 60+, Firefox 54+, Safari 10+).

**Observation**: The library leverages p5.js for rendering and modern browser APIs for performance. WebGL enhances 3D/GPU examples but is optional.

## Features
- **Grid Manipulation**: Centered around the [Quadrille class](https://github.com/objetos/p5.quadrille.js/blob/19b7bf11f64fb5a5e400187bc3b2e29fb1bf71fe/p5.quadrille.js#L9), the library allows you to create, transform, and visualize 2D grids with cells holding colors, images, or arbitrary objects.  
It supports both [mutable](https://objetos.github.io/p5.quadrille.js/docs/mutable_methods/) and [immutable](https://objetos.github.io/p5.quadrille.js/docs/immutable_methods/) methods.
- **Integrated p5 Functions**: Includes [p5.js functions](https://objetos.github.io/p5.quadrille.js/docs/p5_functions/) to manipulate `Quadrille` instances, including utilities to [customize tiling and rendering](https://objetos.github.io/p5.quadrille.js/docs/p5_functions/draw_quadrille/display_fns/).
- **Game Design Tools**: Built-in support for board games, including [Game of Life](https://objetos.github.io/p5.quadrille.js/) and chess through conversion to and from [bitboards](https://en.wikipedia.org/wiki/Bitboard) and [Forsyth–Edwards Notation (FEN)](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation).
- **Visual Computing**: Offers [geometry transformations](https://objetos.github.io/p5.quadrille.js/docs/geometry_transformations/), [boolean operators](https://objetos.github.io/p5.quadrille.js/docs/boolean_operators/) inspired by [constructive solid geometry](https://en.wikipedia.org/wiki/Constructive_solid_geometry), and [visual computing methods](https://objetos.github.io/p5.quadrille.js/docs/visual_computing/) such as image [convolution filtering](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29) and [triangle rasterization](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/).
- **Adaptability**: Easily integrates with [arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [p5.Image](https://p5js.org/reference/#/p5.Image), and other data representations. Supports custom rendering and shader integration.

## Documentation
- **User Manual**: [Interactive Book](https://objetos.github.io/docs/) with tutorials and design patterns.
- **API Reference**: [Fully Documented Methods](https://objetos.github.io/p5.quadrille.js/) with live code examples.
- **Technical Paper**: [SoftwareX Publication](https://www.sciencedirect.com/science/article/pii/S2352711024002097) detailing algorithms and educational impact.
- **Algorithms**: Well-documented O(n) methods for grid operations, image processing, and game logic.

## Technical Support
- **Issue Tracking**: [Report Bugs](https://github.com/objetos/p5.quadrille.js/issues) using pre-defined templates ([Bug Report](.github/ISSUE_TEMPLATE/bug_report.md), [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)).
- **Community**: Used in courses at [Universidad Nacional de Colombia](https://unal.edu.co) and global game jams (e.g., [UNGames](https://ungames.github.io)).

## Impact & Adoption
- **Academic Use**: Integrated into university curricula for object-oriented programming and game design.
- **Scientific Contribution**: Cited in [SoftwareX](https://doi.org/10.1016/j.softx.2024.101838) for bridging game-based learning and computational thinking.
- **State of the Art**: Implements novel techniques for grid-based visual computing, influencing tools like [p5.js](https://p5js.org/) and [OpenProcessing](https://openprocessing.org).
- **Community Reach**: Deployed in 15+ institutions globally; featured in student showcases and [chess thesis projects](https://objetos.github.io/chess-thesis-website/).

## Installation
Include via CDN:
```html
<script src="https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js"></script>
```
Or download:
- [p5.quadrille.js](https://raw.githubusercontent.com/objetos/p5.quadrille.js/main/p5.quadrille.js)
- [All Releases](https://github.com/objetos/p5.quadrille.js/releases)

## Contributing
Contribute via [GitHub](https://github.com/objetos/p5.quadrille.js) and use [issue templates](.github/ISSUE_TEMPLATE/) for submissions.

# Releases
- [p5.quadrille.js](https://raw.githubusercontent.com/objetos/p5.quadrille.js/main/p5.quadrille.js)
- [CDN: p5.quadrille.js](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js) and [p5.quadrille.min.js](https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js)
- [All Releases](https://github.com/objetos/p5.quadrille.js/releases)