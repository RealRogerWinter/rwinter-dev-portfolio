// Pixel-parity snapshots: the look-oracle for the Astro migration. Every page,
// in its default look plus targeted theme variants, must stay pixel-identical
// (within tolerance) as it is ported. Baselines are committed and authoritative
// in the authoring environment (see tests/visual/README.md). Run with
// `npm run test:visual`; refresh deliberately with `npm run test:visual:update`.
import { test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { SHOTS, gotoStable, masks, expect } from './_harness.mjs';
import { maxMeanChannelDelta } from './_pixeldiff.mjs';

const SNAP_DIR = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  '__screenshots__',
  'pages.spec.mjs',
);

for (const shot of SHOTS) {
  test(`visual: ${shot.name}`, async ({ page }) => {
    await gotoStable(page, { path: shot.page.path, viewport: shot.viewport, tweaks: shot.tweaks });

    // 1. Structural diff against the committed baseline (layout, elements, text).
    await expect(page).toHaveScreenshot(`${shot.name}.png`, {
      fullPage: true,
      mask: masks(page),
    });

    // 2. Uniform colour-drift guard. pixelmatch's perceptual weighting is blind
    // to a site-wide subtle colour/contrast shift; the mean channel value is not.
    const baselinePath = path.join(SNAP_DIR, `${shot.name}.png`);
    if (fs.existsSync(baselinePath)) {
      const current = await page.screenshot({
        fullPage: true,
        mask: masks(page),
        animations: 'disabled',
        caret: 'hide',
      });
      const drift = maxMeanChannelDelta(fs.readFileSync(baselinePath), current);
      expect(drift, `mean colour drift for ${shot.name}`).toBeLessThan(1.5);
    }
  });
}
