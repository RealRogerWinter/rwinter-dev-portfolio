// Drift guard: the src/styles/*.css are generated from the window-global source
// components by scripts/extract-css.mjs and are the single source of truth that
// migrated Astro pages link. Assert each stays in sync, so a CSS edit in the
// source without re-extracting (or vice versa) fails CI instead of silently
// diverging the look.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SHEETS, buildCss } from '../scripts/extract-css.mjs';

const stylesDir = path.join(import.meta.dirname, '..', 'src', 'styles');

describe('extracted CSS-in-JS stylesheets', () => {
  for (const sheet of SHEETS) {
    it(`src/styles/${sheet.out} is in sync with ${sheet.src} (run scripts/extract-css.mjs)`, () => {
      expect(fs.readFileSync(path.join(stylesDir, sheet.out), 'utf8')).toBe(buildCss(sheet));
    });
  }

  it('shell.css carries the chrome rules a migrated page needs', () => {
    const css = fs.readFileSync(path.join(stylesDir, 'shell.css'), 'utf8');
    for (const sel of ['.tm-nav', '.tm-foot', '.pg-h1', '.panel', '.tm-tag', '.tm.rw', '.tm-wrap']) {
      expect(css, sel).toContain(sel);
    }
  });
});
