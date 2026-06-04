---
title: "A visual-regression harness as a migration oracle"
description: "How I am moving this site to Astro without changing a pixel, by turning 'do not change the look' from a hope into a test that fails."
date: 2026-06-04
tags: ["astro", "testing", "playwright"]
---

This site started life as a Claude Design export: every page booted React in the
browser and transpiled its JSX with Babel at runtime. That worked, but it shipped
three megabytes of Babel to every visitor, forced an `unsafe-eval` Content
Security Policy, and left the page body invisible to anything that does not run
JavaScript. So I am migrating it to Astro, page by page.

The constraint is the interesting part: the look may not change. Not "should not",
may not. The whole point of a portfolio is the craft, and a migration that quietly
shifts a margin or swaps a font weight is a migration that failed.

"Do not change the look" is usually a hope. I wanted it to be a test that fails.

## The oracle

So before migrating anything, I built a Playwright harness that screenshots every
page and compares it to a committed baseline. A page is only allowed to move to
Astro if its rendered pixels stay identical. The hope became a gate.

The hard part of screenshotting a live, animated site is determinism: two runs of
the same page have to produce the same image, or the diff is noise. The recipe:

```js
// Freeze the page before the shot so the diff is signal, not noise.
await page.addInitScript((tweaks) => {
  localStorage.setItem('rw_tweaks_v1', JSON.stringify(tweaks)); // pin the theme
  let s = 0x2f6e2b1;                                            // seed Math.random
  Math.random = () => (((s = (s + 0x6d2b79f5) | 0), s ^ s >>> 15) >>> 0) / 2 ** 32;
  window.setInterval = () => 0;                                 // stop ticking animations
}, state.tweaks);

await page.emulateMedia({ reducedMotion: 'reduce' });           // kill CSS animation
await expect(page).toHaveScreenshot(`${name}.png`, { animations: 'disabled' });
```

There is a second, sneakier failure mode. The standard perceptual pixel diff is
deliberately blind to a subtle, uniform colour shift, exactly the kind a CSS
refactor can introduce. So the oracle has a second eye: it also compares the mean
colour of the page, which catches the site-wide drift the perceptual diff waves
through.

## What it caught

The harness earned its keep immediately. When I converted the two heaviest
screenshots to WebP, the diff lit up, not because WebP looked worse, but because
`loading="lazy"` without reserved dimensions collapsed a page by six hundred
pixels before the image loaded. Reserve the dimensions, and the collapse goes
away. I would have shipped that.

Every page in this migration crosses the same gate. The one you are reading this
on is served by Astro now. It is, to the pixel, the page it was before.
