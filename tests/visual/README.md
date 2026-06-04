# Visual-regression harness

The look-oracle for the Astro migration (see `docs/adr/0001-migrate-to-astro-islands.md`).
The site's whole point is that it must look identical before and after the
migration. This harness makes "do not change the look" an enforceable check:
every page is screenshotted now, and each migrated page must stay pixel-identical
(within tolerance) to its committed baseline.

## What it does

- `pages.spec.mjs` — full-page screenshots of all eight pages in their default
  look, plus targeted variants that exercise the theme system (light theme, an
  alternate accent, an alternate background) and a mobile width. These compare
  against committed baselines in `__screenshots__/` with two complementary
  checks: a structural pixel diff (pixelmatch), plus a **mean-colour guard** that
  catches site-wide uniform colour/contrast drift, which the perceptual pixel
  diff is deliberately blind to. **This is the migration look-gate.**
- `rendersmoke.spec.mjs` — proves every page's client render produces real
  content (not an empty `#root`) with no uncaught errors. Environment-independent.
- `selftest.spec.mjs` — proves both oracle halves have teeth: pixelmatch detects
  an injected element, the mean-colour guard detects a subtle uniform shift
  pixelmatch misses, and neither false-positives on identical renders. This is
  what stops the harness from silently rotting into an always-pass.
  Environment-independent.

## Running it

```bash
npm run test:visual          # compare all pages against committed baselines (the gate)
npm run test:visual:update   # regenerate baselines (only after an INTENTIONAL look change)
npm run test:visual:ci       # render-smoke + self-test only (environment-independent)
```

Playwright's Chromium is installed once with `npx playwright install chromium`.

## Determinism model

The migration is performed in the authoring environment, so the committed
baselines are generated and compared in that same environment — comparison is
apples-to-apples and stable. To make full-page screenshots of a client-rendered,
animated site deterministic, the harness:

- forces `prefers-reduced-motion: reduce`, which trips the site's own reduced-motion
  paths and the `@media(reduce)` animation kill-switch in `microviz`;
- seeds `Math.random` (so the one-shot price visualization is fixed) and neutralises
  `setInterval` (the keyword-rank rotation ignores reduced-motion) via an init
  script that runs before any page script;
- seeds the saved tweaks (`rw_tweaks_v1`) so the page boots directly into the
  requested theme/accent/background, with `vizAnim`/`blink` off;
- waits for `document.fonts.ready` and network idle before capturing;
- masks the one irreducibly non-deterministic region — the live Twitch player
  iframe on the Pricey page.

### CI vs local

CI runs `test:visual:ci` (render-smoke + self-test) in the pinned
`mcr.microsoft.com/playwright` image — these are environment-independent and
guard that the pages render and the oracle works. The **pixel comparison
(`test:visual`) is the authoring-environment gate** run during the migration; it
is not gated cross-environment because sub-pixel font anti-aliasing differs
between hosts. Migration PRs report local `test:visual` results as evidence.

## Updating baselines

Only run `test:visual:update` when a look change is **intentional**. Review the
regenerated PNGs in the diff before committing, the same way you would review
code. An unexplained baseline change in a migration PR is a regression, not a
new baseline.

## The matrix

The committed set is a deliberately small, meaningful slice (all pages default +
a few theme variants), not the full accent × background × theme cross-product.
The full cross-product is the migration's manual look-review surface, not a
per-run gate. Extend `SHOTS` in `_harness.mjs` to add coverage.
