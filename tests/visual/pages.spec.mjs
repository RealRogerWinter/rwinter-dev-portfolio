// Pixel-parity snapshots: the look-oracle for the Astro migration. Every page,
// in its default look plus targeted theme variants, must stay pixel-identical
// (within tolerance) as it is ported. Baselines are committed and authoritative
// in the authoring environment (see tests/visual/README.md). Run with
// `npm run test:visual`; refresh deliberately with `npm run test:visual:update`.
import { test } from '@playwright/test';
import { SHOTS, gotoStable, masks, expect } from './_harness.mjs';

for (const shot of SHOTS) {
  test(`visual: ${shot.name}`, async ({ page }) => {
    await gotoStable(page, { path: shot.page.path, viewport: shot.viewport, tweaks: shot.tweaks });
    await expect(page).toHaveScreenshot(`${shot.name}.png`, {
      fullPage: true,
      mask: masks(page),
    });
  });
}
