# Algebra 1 Tutor — Portfolio Page (Project 06)

**Date:** 2026-06-16
**Status:** Approved (design), pending implementation
**Worktree/branch:** `worktree-feat+algebra-1-tutor-page`

## Goal

Expand the rogerwinter.dev portfolio from 5 to 6 projects by adding a project page
for **Algebra 1 Tutor** (`RealRogerWinter/algebra-1-tutor`). The page must match the
tone, structure, and interactivity of the existing project pages, and the project
must register through the existing single-source-of-truth (`src/data/portfolio.js`)
so the home grid, prev/next nav, and counts update automatically.

## What the project is (source material)

A free, open-source Algebra 1 course with **two surfaces sharing one SymPy-verified
source of truth**:

- A browser textbook (live: `https://realrogerwinter.github.io/algebra-1-tutor/`).
- A **Claude Agent Skill** that turns Claude into a 1:1 interactive tutor (installed
  via Claude Settings > Features > Skills using `algebra-1-tutor.zip`).

Highlights to convey:
- 13 units / 52 lessons, foundations → quadratics + a statistics unit.
- Pedagogy distilled from cited teaching research: concrete→pictorial→symbolic
  progression, ask-before-telling hint ladders, backward-faded worked examples,
  misconception diagnosis (reads the *specific* wrong answer), effort-decoupled
  encouragement, transfer-based comprehension checks.
- Single source of truth verified by **SymPy**: 909 problems, 614 auto-checked, 0
  failures enforced in CircleCI; four surfaces (textbook, tutor, student guide,
  tutor guide) cannot silently diverge.
- Reads **photos of handwritten work** to diagnose and review.
- Optimized for the **free Claude tier (Sonnet 4.6)** with graceful degradation when
  code execution is unavailable; Progress Cards enable stateless session resume;
  prerequisite-aware (jump to any unit, gaps get patched).
- Doubles as a **template for building future interactive tutors**.

## Decisions (locked with user)

- **Tagline:** "A full Algebra 1 course that turns Claude into your personal tutor —
  built on cited teaching research and one SymPy-verified source of truth."
- **Interactive elements (all four):** tutor chat demo, check-my-answer solver,
  curriculum map, concrete→symbolic balance-scale viz.
- **Accent hue:** teal/cyan — `oklch(0.74 0.12 195)` in `projectHue`.
  (Global site accent stays green `#57f08d`; this hue only drives the home-card glow.)
- **Screenshots:** user captures real screenshots later. Ship self-contained coded
  browser-chrome mockups now, with a clearly-labeled gallery whose `<img>` slots
  reference `/portfolio/assets/a1-*.png` and degrade gracefully until filled.
- **"Get the skill" button:** points to the GitHub repo (install instructions),
  not a direct .zip download.
- All generated copy run through the **/copyedit** skill before finalizing.

## Identity / registration

`src/data/portfolio.js` — append entry:

```js
{
  id: 'algebra-1-tutor',
  name: 'Algebra 1 Tutor',
  n: '06',
  status: 'Live',
  desc: '<2–3 sentence card description>',
  tagline: 'A full Algebra 1 course that turns Claude into your personal tutor — built on cited teaching research and one SymPy-verified source of truth.',
  tags: ['Education', 'Claude Skill', 'AI Tutor'],
  demo: 'https://realrogerwinter.github.io/algebra-1-tutor/',
  repo: 'https://github.com/RealRogerWinter/algebra-1-tutor',
  overview: ['<para 1>', '<para 2>'],
  features: [ {h, p} x4 ],
  stack: ['Claude Agent Skill', 'SymPy', 'Python', 'YAML', 'SVG', 'LaTeX/Unicode', 'CircleCI', 'GitHub Pages'],
}
```

`projectHue['algebra-1-tutor'] = 'oklch(0.74 0.12 195)'`.

No `logo`/`clef`. Add a dedicated home-card icon (see below) so the card does not
fall back to "AL" initials.

## Files

**New**
- `src/pages/projects/algebra-1-tutor.astro` — the page (mirrors `price-games.astro`
  rhythm; scoped class prefix `a1-`).
- `src/components/viz/algebra-1-tutor.jsx` — one module bundling: the page hero/CTA
  static diagram(s), `BalanceScaleViz` (concrete→symbolic), `TutorChatDemo`,
  `CheckMyAnswer`, `CurriculumMap`. Stateful demos use `client:visible` with
  deterministic initial render; pure diagrams render with no client directive.
- `src/styles/algebra-1-tutor.css` — page + demo styles (`a1-*` / demo classes),
  following the `price-games.css` patterns (panels, kicker/h2/p, figures, chips,
  `[data-anim]` gate for motion).

**Edited**
- `src/data/portfolio.js` — add entry + hue.
- `src/components/viz/microviz.jsx` — add `AlgebraViz` (home-card + hero micro-viz:
  a balance scale that resolves to `x = …`, or an equation that solves) and wire it
  into `ProjectViz` (`if (id === 'algebra-1-tutor') return <AlgebraViz animate=… />`).
- `src/styles/microviz.css` — styles for the new micro-viz.
- `src/pages/index.astro` — add an icon branch for `id === 'algebra-1-tutor'`
  (small math glyph, e.g. animated `x` with superscript / `=` motif) so the home
  card shows a real icon, not initials; bump copy "five experiments" → "six
  experiments".
- `deploy/default.conf` — only if `npm run csp:hashes` reports new inline-script
  hashes (expected: none, since islands reuse existing hashes).

## Page sections (mirror price-games rhythm)

1. **Hero** — viz island, status "Live", "Project 06", H1 "Algebra 1 Tutor",
   tagline, actions: *Open the textbook ↗* (demo) · *Get the skill ↗* (repo) ·
   *GitHub ↗* (repo) · *← All projects*.
2. **Lede** — free & open course; two surfaces, one verified source; runs on free Claude.
3. **Tutor chat demo** *(interactive, `client:visible`)* — signature piece:
   ask-before-telling → hint ladder → SymPy-checked answer, with a photo-of-work beat.
4. **Pedagogy** — "Teaching methods, distilled from research" — the cited methods,
   with the **concrete→symbolic balance-scale viz** as its figure *(interactive)*.
5. **Check-my-answer solver** *(interactive, `client:visible`)* — solve `8 − 2x = 14`
   step-by-step with illustrative SymPy-style verification.
6. **One source of truth** — SymPy verification story: 909 / 614 / 0 failures, CI
   gates, four surfaces that can't diverge (static SVG verification-flow diagram).
7. **Curriculum map** *(interactive, `client:visible`)* — 13 units / 52 lessons,
   hover/expand, prerequisite-aware.
8. **Built for the free tier** — Sonnet 4.6, graceful degradation, Progress Cards,
   jump-to-any-unit.
9. **A template for the next tutor** — reusable pattern angle.
10. **From the live textbook** — screenshot gallery (browser-chrome frames; coded
    mockups now, drop-in slots for real screenshots at `/portfolio/assets/a1-*.png`).
11. **Tech stack** — data-driven rows from `stack`.
12. **CTA** + **prev/next nav** (auto from `portfolio.js`).

## Constraints / patterns to honor

- Astro + React islands; plain scoped CSS (no Tailwind). Fonts: Syne (display),
  Hanken Grotesk (body), JetBrains Mono (mono). Tokens from `shell.css`.
- Stateful islands: deterministic initial render (no `Math.random()`/Date at SSR;
  `client:visible` for in-viewport hydration; `client:only="react"` for the
  decorative hero/card viz). Respect `prefers-reduced-motion` and the `[data-anim]`
  gate (motion off → static).
- Accessibility: `role="img"` + `aria-label` on diagrams; real buttons for the
  interactive demos; alt text on images.
- Math notation rendered with Unicode (x², √12, ½) and clean inline markup — no
  heavy LaTeX/MathJax dependency added to the static site.
- Hash-locked CSP: after build, run `npm test`; if `csp-hashes` fails, run
  `npm run csp:hashes` and paste into `deploy/default.conf`.

## Verification

- `npm run build` succeeds; `/projects/algebra-1-tutor` emitted in `dist/`.
- `npm test` (vitest) green — especially `structure`, `seo`, `resources`,
  `csp-hashes`, `images`.
- `npm run test:visual` (Playwright) — add/update snapshots for the new page if the
  oracle requires it.
- Manual: home grid shows 6 cards with a real algebra icon + teal glow; page hero,
  all four interactive demos, gallery, tech stack, prev/next all render in
  `npm run dev`; copy passes /copyedit; motion-off and reduced-motion render cleanly.

## Out of scope

- Capturing real screenshots (user will do this later; slots are prepared).
- Any change to the un-migrated legacy `site/portfolio/*.jsx` data (kept 1:1 — if the
  legacy `data.jsx` is still load-bearing, mirror the new entry there too; verify
  during implementation).
- Backend, search-demand, or skill-runtime changes — this is a portfolio page only.
