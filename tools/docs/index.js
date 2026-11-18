#!/usr/bin/env node
/**
 * @file Docs generator entry — `npm run docs`: this site's sources and its
 * declaration in, `site/` out.
 * @module tools/docs
 * @license GPL-3.0-only
 *
 * The pipeline is the package's: `@nakednous/scholion/generator` parses the doc
 * blocks, reads the Markdown pages, validates both against the IIFE build,
 * renders the pages and writes `site/` beside the build of the same commit, the
 * static chrome and the editor bundle. This file says where the package is and
 * prints what it did. Run `npm run build` first, and `npm install --prefix
 * tools/docs` once, which is where the package comes from.
 */

import { build } from '@nakednous/scholion/generator';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import config from './docs.config.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const summary = await build(config, { root });

console.log(`[docs] ${summary.files.size} page(s), ${summary.pages} docs/ page(s), ` +
            `${summary.doclets.length} doclet(s), ${summary.sketches} sketch(es), ` +
            `${summary.warnings.length} warning(s) → ${summary.out}/`);
console.log(`[docs] editor ${summary.editor.url} ${(summary.editor.bytes / 1024).toFixed(1)} kB ` +
            `(sha256 ${summary.editor.sha256.slice(0, 16)}…), ${summary.editor.retained} earlier asset(s) kept`);
