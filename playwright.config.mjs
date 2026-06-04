import { defineConfig } from '@playwright/test';

// Visual-regression harness for the portfolio. See tests/visual/README.md for
// the determinism model. Baselines are the look-oracle for the Astro migration:
// every page must stay pixel-identical (within tolerance) as it is ported.
const PORT = 4317;

export default defineConfig({
  testDir: './tests/visual',
  // Determinism: never parallelise; one worker, no retries, fixed order.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI
    ? [['list'], ['junit', { outputFile: 'test-results/visual-junit.xml' }]]
    : [['list']],
  // Flat, platform-agnostic baseline names (we commit one set, generated in the
  // authoring environment, and treat it as authoritative for the migration).
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFileName}/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      // Absorb sub-pixel anti-aliasing noise; real regressions (layout, colour,
      // missing elements) move far more than 1% of pixels.
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    browserName: 'chromium',
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    // Forces the site's prefers-reduced-motion code paths (static viz states)
    // and the @media(reduce) animation kill-switch in microviz.
    reducedMotion: 'reduce',
    timezoneId: 'UTC',
    locale: 'en-US',
  },
  webServer: {
    command: `node tests/visual/static-server.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}/healthz`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
