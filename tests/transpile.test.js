// Every JSX component must transpile through the *vendored* Babel that ships in
// the image — catches syntax errors and proves the shipped Babel can build them.
//
// The repo is an ES module ("type":"module"), so a plain require() would load the
// vendored UMD as ESM and lose its module.exports. We instead read the file and
// evaluate it in a vm sandbox with real CommonJS module/exports — exercising the
// exact bytes that ship to the browser.
import { describe, it, expect } from 'vitest';
import vm from 'node:vm';
import fs from 'node:fs';
import { SITE, walk } from './_lib.js';

function loadVendoredBabel() {
  const code = fs.readFileSync(`${SITE}/vendor/babel.min.js`, 'utf8');
  const ctx = { console, process, setTimeout, clearTimeout, setInterval, clearInterval };
  ctx.module = { exports: {} };
  ctx.exports = ctx.module.exports;
  ctx.global = ctx; ctx.globalThis = ctx; ctx.self = ctx; ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: 'babel.min.js' });
  const B = ctx.module.exports;
  if (B && typeof B.transform === 'function') return B;
  return ctx.Babel || ctx.window?.Babel; // fallback if it bound to a global
}

const Babel = loadVendoredBabel();

describe('JSX transpiles via the vendored Babel', () => {
  it('the vendored Babel exposes transform()', () => {
    expect(typeof Babel?.transform).toBe('function');
  });

  // The set shrinks as pages migrate to Astro (their .jsx are removed); just
  // assert the remaining shipped components are found and all transpile.
  const files = walk(SITE, '.jsx');
  it('finds the un-migrated component set', () => expect(files.length).toBeGreaterThan(0));

  for (const f of files) {
    const rel = f.slice(SITE.length + 1);
    it(`transpiles ${rel}`, () => {
      expect(() =>
        Babel.transform(fs.readFileSync(f, 'utf8'), { presets: ['react'], filename: f }),
      ).not.toThrow();
    });
  }
});
