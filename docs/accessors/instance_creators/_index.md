---
title: "Instance Creators"
weight: 3
---

_Instance accessors_ generate new `quadrille` instances derived from the original. These methods allow you to create modified versions while preserving the original quadrille’s state:

- **[clone()](clone/):** Creates a [shallow copy](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy) of the quadrille.
- **[row(row)](row/):** Creates a new quadrille containing only the specified `row`.
- **[crop(row, col, width, height, wrap)](crop/):** Creates a new quadrille representing the rectangular region anchored at `(row, col)` with the given `width` and `height`.
- **[ring(row, col, dimension, wrap)](ring/):** Creates a new quadrille representing the square block of radius `dimension` centered at `(row, col)` — center cell included.
- **[trim()](trim/):** Creates a new quadrille containing the minimal [span](../../properties/read_only/span/) of its filled cells.
- **[heatMap(hot, cold)](heat_map/):** Creates a new quadrille of colors ramped by this one's numbers — `hot` at `0`, `cold` at the largest number present.
