// Pixel comparison helper used by the harness self-test to prove the oracle
// actually detects visual change (and does NOT false-positive on identical
// renders). Environment-independent: it compares two screenshots taken in the
// same run, so it is reliable in CI as well as locally.
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

// Returns the number of differing pixels between two PNG buffers. Mismatched
// dimensions count as fully different. `threshold` is the per-pixel colour
// sensitivity (0 strict .. 1 loose), matching Playwright's screenshot default.
export function diffPixelCount(pngA, pngB, { threshold = 0.2 } = {}) {
  const a = PNG.sync.read(pngA);
  const b = PNG.sync.read(pngB);
  if (a.width !== b.width || a.height !== b.height) {
    return Math.max(a.width * a.height, b.width * b.height);
  }
  return pixelmatch(a.data, b.data, null, a.width, a.height, { threshold });
}
