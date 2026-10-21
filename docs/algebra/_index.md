---
title: "Algebra"
weight: 6
---

The **quadrille algebra** provides a suite of [static methods](https://developer.mozilla.org/en-US/docs/Glossary/Static_method) for applying logical operations to `quadrille` instances. Inspired by [constructive solid geometry](https://en.wikipedia.org/wiki/Constructive_solid_geometry) and [boolean algebra](https://en.wikipedia.org/wiki/Boolean_algebra), these methods combine and manipulate quadrilles, leading to **new quadrilles** as an aggregation of others.

## Method Overview

- **[not(q, value)](not/):** Performs a logical **NOT** operation, inverting empty and non-empty cells, filling empty cells with a provided `value`.
- **[or(q1, q2, row, col)](or/):** Combines two quadrilles using a logical **OR**, merging their non-empty cells into a new quadrille.
- **[xor(q1, q2, row, col)](xor/):** Returns a new quadrille containing all the non-empty cells that appear in either `q1` or `q2` but not in both.
- **[and(q1, q2, row, col)](and/):** Returns a new quadrille containing only the cells that are non-empty in both `q1` and `q2`.
- **[diff(q1, q2, row, col)](diff/):** Returns a new quadrille containing the non-empty cells from `q1` that do not appear in `q2`.
- **[merge(q1, q2, operator, row, col)](merge/):** Returns a new quadrille by applying a specified logical `operator` to each corresponding cell of `q1` and `q2`.

These algebraic methods offer powerful tools for composing quadrilles, enabling the construction of intricate patterns, designs, or logical transformations. Whether you're combining shapes, masking cells, or creating dynamic compositions, the quadrille algebra brings structure and precision to your work.

> **Note**
>
> All algebra methods also have **destructive, chainable instance** forms: they mutate `q` and return it.
>
> **Single-step:** `q.not('#000')`, `q.and(q2)`, `q.diff(mask)`
> **Chained:** `q.not('#000').or(q2).and(q3)`, `q.or(stamp, 2, -1).diff(mask)`, `q.merge(mask, op, 1, 0).xor(qHole).not('#fff')`
