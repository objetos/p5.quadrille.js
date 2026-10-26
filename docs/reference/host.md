---
title: "The host: p5.js and JavaScript"
weight: 2
---

The examples are p5 sketches: they run in p5's global mode, and a cell holds whatever JavaScript a cell can hold. This page lists the p5.js and JavaScript names they call, a line each on what the snippets use it for, and how many examples reach for it.

Three shapes of address, because p5's reference is not uniform:

- a p5 **function, value or cast** has a page of its own, and the name links to it;
- a p5 **constant** — `CENTER`, `CORNER`, `WEBGL`, `PI`, `RGB`, `HSB` — has none: p5 documents it inside the function that takes it, so those rows carry no link;
- a `p5.Element` **method** — `html()`, `value()`, `checked()`, `option()` — is documented on the class page, which is where its row goes.

<!-- uses: host -->
