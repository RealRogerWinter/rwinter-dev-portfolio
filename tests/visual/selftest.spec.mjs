// Self-test: proves both halves of the harness oracle have teeth and do not
// false-positive on identical renders. Environment-independent (it compares two
// screenshots taken in the same run), so it runs in CI and guards the harness
// itself from rotting into an always-pass.
import { test, expect } from '@playwright/test';
import { diffPixelCount, maxMeanChannelDelta } from './_pixeldiff.mjs';

const fixture = (extra = '', bg = '#3b5bdb') =>
  'data:text/html,' +
  encodeURIComponent(
    `<body style="margin:0;background:#fff"><div style="width:200px;height:120px;background:${bg}">${extra}</div></body>`,
  );

test('structural oracle detects an injected element, not identical renders @ci', async ({ page }) => {
  await page.setViewportSize({ width: 240, height: 160 });

  await page.goto(fixture());
  const a = await page.screenshot();

  await page.goto(fixture());
  const aAgain = await page.screenshot();

  await page.goto(fixture('<div style="width:48px;height:48px;background:#e03131"></div>'));
  const changed = await page.screenshot();

  expect(diffPixelCount(a, aAgain), 'identical renders -> no diff').toBe(0);
  expect(diffPixelCount(a, changed), 'injected box -> detected').toBeGreaterThan(500);
});

test('mean-colour guard catches a subtle uniform shift that pixelmatch misses @ci', async ({ page }) => {
  await page.setViewportSize({ width: 240, height: 160 });

  await page.goto(fixture('', '#3b5bdb')); // base
  const base = await page.screenshot();

  await page.goto(fixture('', '#3b5bf3')); // +24 on the blue channel — visible but subtle
  const shifted = await page.screenshot();

  // The whole point: the perceptual diff is blind to this, the mean guard is not.
  expect(diffPixelCount(base, shifted), 'pixelmatch is blind to a uniform blue shift').toBeLessThan(10);
  expect(maxMeanChannelDelta(base, shifted), 'mean guard catches the drift').toBeGreaterThan(2);

  // And the mean guard does not false-positive on identical renders.
  await page.goto(fixture('', '#3b5bdb'));
  const baseAgain = await page.screenshot();
  expect(maxMeanChannelDelta(base, baseAgain), 'identical renders -> ~0 drift').toBeLessThan(1);
});
