// The two multi-megabyte screenshots are served as WebP with a PNG fallback.
// (AVIF + responsive sizes are deferred to the Astro <Image> pipeline.)
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SITE } from './_lib.js';

const ROOT = path.join(SITE, '..');
const ASSETS = path.join(SITE, 'portfolio', 'assets');
const HEAVY = ['onestreamer-stream', 'pricey-stream'];
const readRoot = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

describe('heavy screenshots optimized to WebP (PNG kept as fallback)', () => {
  it('each heavy screenshot has a much-smaller WebP sibling', () => {
    for (const base of HEAVY) {
      const png = path.join(ASSETS, `${base}.png`);
      const webp = path.join(ASSETS, `${base}.webp`);
      expect(fs.existsSync(webp), `${base}.webp missing`).toBe(true);
      const pngSize = fs.statSync(png).size;
      const webpSize = fs.statSync(webp).size;
      expect(webpSize, `${base}.webp should be < 50% of the PNG`).toBeLessThan(pngSize * 0.5);
    }
  });

  it('components serve the WebP with a PNG fallback intact', () => {
    // Both pages migrated to Astro: <picture> markup in the page, the CSS
    // image-set background + .{os,pcy}-tour rule in the stylesheet.
    const pricey = readRoot('src/pages/project-pricey.astro');
    const priceyCss = readRoot('src/styles/pricey.css');
    const onestreamer = readRoot('src/pages/project-onestreamer.astro');
    // pricey uses the image as a CSS background (image-set) and in <picture>.
    expect(priceyCss, 'bg uses image-set with webp').toMatch(/image-set\([^;]*pricey-stream\.webp/);
    expect(pricey, 'webp <source>').toContain('pricey-stream.webp');
    expect(pricey, 'png fallback retained').toContain('pricey-stream.png');
    expect(onestreamer, 'webp <source>').toContain('onestreamer-stream.webp');
    expect(onestreamer, 'png fallback retained').toContain('onestreamer-stream.png');
  });

  it('the <img> reserve their 2560x1440 dimensions (CLS guard)', () => {
    const pricey = readRoot('src/pages/project-pricey.astro');
    const onestreamer = readRoot('src/pages/project-onestreamer.astro');
    expect(pricey).toMatch(/pricey-stream\.png" width="2560" height="1440"/);
    expect(onestreamer).toMatch(/onestreamer-stream\.png" width="2560" height="1440"/);
    // width:100% needs height:auto or the height attr distorts the image.
    expect(readRoot('src/styles/pricey.css')).toMatch(/\.pcy-tour img\{[^}]*height:auto/);
    expect(readRoot('src/styles/onestreamer.css')).toMatch(/\.os-tour img\{[^}]*height:auto/);
  });
});
