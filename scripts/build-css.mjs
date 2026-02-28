/**
 * CSS build script — zero dependencies.
 *
 * 1. Copies modular CSS files to dist/styles/ (for granular imports)
 * 2. Inlines @import directives in popser.css to produce a single flat file
 * 3. Minifies the result → dist/styles/popser.min.css
 */

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const SRC = resolve("src/styles");
const DIST = resolve("dist/styles");

mkdirSync(DIST, { recursive: true });

// ── 1. Copy individual CSS files ────────────────────────────────────
const files = [
  "tokens.css",
  "viewport.css",
  "toast.css",
  "transitions.css",
  "content.css",
  "controls.css",
  "popser.css",
];

for (const file of files) {
  copyFileSync(join(SRC, file), join(DIST, file));
}

// ── 2. Inline @imports and build flat bundle ────────────────────────
const entryCSS = readFileSync(join(SRC, "popser.css"), "utf8");

const inlined = entryCSS.replace(
  /@import\s+["']\.\/([^"']+)["']\s*;/g,
  (_, filename) => {
    return readFileSync(join(SRC, filename), "utf8");
  }
);

// ── 3. Minify (strip comments, collapse whitespace) ─────────────────
function minifyCSS(css) {
  return (
    css
      // Remove block comments (non-greedy)
      .replace(/\/\*[\s\S]*?\*\//g, "")
      // Collapse whitespace around braces, colons, semicolons, commas
      .replace(/\s*([{}:;,>~+])\s*/g, "$1")
      // Collapse remaining runs of whitespace
      .replace(/\s{2,}/g, " ")
      // Remove trailing semicolons before closing braces
      .replace(/;}/g, "}")
      // Remove leading/trailing whitespace
      .trim()
  );
}

const minified = minifyCSS(inlined);

writeFileSync(join(DIST, "popser.min.css"), minified);

const rawKB = (Buffer.byteLength(inlined) / 1024).toFixed(1);
const minKB = (Buffer.byteLength(minified) / 1024).toFixed(1);
console.log(
  `CSS: ${rawKB} KB → ${minKB} KB minified (dist/styles/popser.min.css)`
);
