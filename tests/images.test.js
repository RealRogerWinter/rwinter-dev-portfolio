// The two multi-megabyte screenshots are served as WebP with a PNG fallback.
// (AVIF + responsive sizes are deferred to the Astro <Image> pipeline.)
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SITE } from './_lib.js';

const ASSETS = path.join(SITE, 'portfolio', 'assets');
const HEAVY = ['onestreamer-stream', 'pricey-stream'];

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
    const pricey = fs.readFileSync(path.join(ASSETS, '..', 'pricey.jsx'), 'utf8');
    const onestreamer = fs.readFileSync(path.join(ASSETS, '..', 'onestreamer.jsx'), 'utf8');
    // pricey uses the image as a CSS background (image-set) and in <picture>.
    expect(pricey, 'bg uses image-set with webp').toMatch(/image-set\([^;]*pricey-stream\.webp/);
    expect(pricey, 'webp <source>').toContain('pricey-stream.webp');
    expect(pricey, 'png fallback retained').toContain('pricey-stream.png');
    expect(onestreamer, 'webp <source>').toContain('onestreamer-stream.webp');
    expect(onestreamer, 'png fallback retained').toContain('onestreamer-stream.png');
  });
});
