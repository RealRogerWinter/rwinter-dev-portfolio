// Drift guard: src/styles/shell.css is generated from shell.jsx by
// scripts/extract-css.mjs and is the single source of truth migrated Astro pages
// link. Assert it stays in sync, so a CSS edit in shell.jsx without re-extracting
// (or vice versa) fails CI instead of silently diverging the look.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { buildShellCss } from '../scripts/extract-css.mjs';

const OUT = path.join(import.meta.dirname, '..', 'src', 'styles', 'shell.css');

describe('extracted shell CSS', () => {
  it('src/styles/shell.css is in sync with shell.jsx (run scripts/extract-css.mjs)', () => {
    expect(fs.readFileSync(OUT, 'utf8')).toBe(buildShellCss());
  });

  it('carries the chrome rules a migrated page needs', () => {
    const css = fs.readFileSync(OUT, 'utf8');
    for (const sel of ['.tm-nav', '.tm-foot', '.pg-h1', '.panel', '.tm-tag', '.tm.rw', '.tm-wrap']) {
      expect(css, sel).toContain(sel);
    }
  });
});
