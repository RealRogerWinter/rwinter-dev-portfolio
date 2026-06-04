// Pixel comparison helpers for the harness. Two complementary checks, because
// neither alone is a complete look-oracle:
//
//  * diffPixelCount (pixelmatch/YIQ) catches STRUCTURAL change — layout shifts,
//    moved/missing elements, edges, text — but its perceptual weighting is
//    deliberately blind to subtle UNIFORM colour shifts (a +48 blue fill reads
//    as zero changed pixels at any sane threshold).
//  * maxMeanChannelDelta catches exactly that blind spot: a site-wide colour or
//    contrast drift moves the mean channel value even when pixelmatch sees zero.
//
// Both are environment-independent (they compare two buffers), so the self-test
// can prove each has teeth and runs in CI.
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

// Number of differing pixels between two PNG buffers (structural diff).
// Mismatched dimensions count as fully different. `threshold` is the per-pixel
// colour sensitivity (0 strict .. 1 loose); 0.1 is stricter than Playwright's
// 0.2 default, which we can afford because comparison is same-environment.
export function diffPixelCount(pngA, pngB, { threshold = 0.1 } = {}) {
  const a = PNG.sync.read(pngA);
  const b = PNG.sync.read(pngB);
  if (a.width !== b.width || a.height !== b.height) {
    return Math.max(a.width * a.height, b.width * b.height);
  }
  return pixelmatch(a.data, b.data, null, a.width, a.height, { threshold });
}

// Average [r, g, b] over all opaque-ish pixels of a PNG buffer.
export function meanColor(png) {
  const img = PNG.sync.read(png);
  const d = img.data;
  let r = 0, g = 0, b = 0;
  const n = img.width * img.height;
  for (let i = 0; i < n; i++) {
    r += d[i * 4];
    g += d[i * 4 + 1];
    b += d[i * 4 + 2];
  }
  return [r / n, g / n, b / n];
}

// Largest per-channel difference of the two images' mean colour. Catches the
// uniform-shift class of regression that diffPixelCount is blind to.
export function maxMeanChannelDelta(pngA, pngB) {
  const a = meanColor(pngA);
  const b = meanColor(pngB);
  return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
}
