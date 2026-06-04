// Self-test: proves the harness's pixel oracle actually has teeth — it reports
// zero diff for two identical renders (no false positives) and a real diff when
// a change is injected (no silent always-pass). Environment-independent, so it
// runs in CI as well as locally and guards the harness itself from rotting.
import { test, expect } from '@playwright/test';
import { diffPixelCount } from './_pixeldiff.mjs';

const fixture = (extra = '') =>
  'data:text/html,' +
  encodeURIComponent(
    `<body style="margin:0;background:#fff"><div style="width:200px;height:120px;background:#3b5bdb">${extra}</div></body>`,
  );

test('the pixel oracle detects an injected change and not identical renders @ci', async ({ page }) => {
  await page.setViewportSize({ width: 240, height: 160 });

  await page.goto(fixture());
  const a = await page.screenshot();

  await page.goto(fixture());
  const aAgain = await page.screenshot();

  await page.goto(fixture('<div style="width:48px;height:48px;background:#e03131"></div>'));
  const changed = await page.screenshot();

  // Identical renders must not be flagged.
  expect(diffPixelCount(a, aAgain)).toBe(0);
  // An injected ~48x48 red box must be detected well above noise.
  expect(diffPixelCount(a, changed)).toBeGreaterThan(500);
});
