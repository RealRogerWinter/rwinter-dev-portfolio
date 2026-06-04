# ADR 0001: Migrate the portfolio from in-browser Babel to Astro (islands + MDX + SSG)

- **Status:** Accepted
- **Date:** 2026-06-04
- **Deciders:** Roger Winter (owner)
- **Supersedes:** the "faithful serve" rendering model documented in `docs/architecture.md` (the deploy topology in that document is retained unchanged)

## Context

### What the site is today

The portfolio at rogerwinter.dev is delivered as static files but rendered entirely in the browser. Every one of the eight HTML pages loads React, then `@babel/standalone` (3.0 MB), then a set of `.jsx` files as `<script type="text/babel">`, and Babel transpiles roughly 5,500 lines of JSX in the browser on every visit. Components communicate through `window.*` globals with load-order coupling rather than module imports.

This shape has four structural consequences, all verified against the code:

1. **A 3.0 MB Babel payload plus per-load transpile cost.** The vendor scripts are cached for a week, so this is mostly a first-visit and post-deploy cost, but the in-browser transpile runs on every load and is worst on low-end mobile.
2. **The Content-Security-Policy is forced to allow `script-src 'unsafe-inline' 'unsafe-eval'`.** The `'unsafe-eval'` directive exists only because the in-browser Babel runtime needs `eval`, so removing Babel drops it unconditionally. The `'unsafe-inline'` directive drops too, but only once the one remaining inline script (the pre-paint theme bootstrap introduced in Phase A) is pinned with a CSP hash or externalized to a `'self'` file. The nginx config comment already notes that a precompiled build is what lets the relaxations drop.
3. **Page bodies are invisible to crawlers and to LLMs that do not execute JavaScript.** The served HTML body is an empty `<div id="root">`; only the static `<head>` metadata is present. For a brand whose premise is being found and read, this is the most strategically costly gap.
4. **There is no content pipeline.** A new tutorial today means hand-authored JSX. The owner's stated mission is writing tutorials, so this is the single largest capability gap.

Two facts discovered during analysis are load-bearing for the plan:

- **The repository contains zero `.css` files.** One hundred percent of the visual identity lives as nineteen `*_CSS` JavaScript template-literal strings that reach the DOM only at React runtime via `<style>{BASE_CSS + ...}</style>`. The theme (accent, light/dark, background, layout) is applied as attributes and CSS variables on the React-root `.tm` `<div>`, not on `<html>`.
- **`style-src 'unsafe-inline'` cannot be removed** while CSS ships as React `<style>` children and the shell injects a lightbox `<style>` at runtime. Only the `script-src` relaxations are recoverable.

### What is good and must be preserved

The deployment and security posture is production grade and is explicitly out of scope for change: a hardened non-root, read-only nginx-unprivileged container; Cloudflare (proxy, WAF, mTLS Authenticated Origin Pull) to a shared Caddy to loopback nginx; and a CircleCI pipeline with secret scanning, GHCR digest pinning, a manual-approval gate, and auto-rollback. Any build step introduced by this migration must slot into that pipeline and keep the runtime image shipping static files with zero Node.

### The drivers

The owner's mission is to build AI-native software and publish the tutorials that explain it, with live demos. The future of the site is prose-heavy, frequently published, demo-rich content that humans and LLM crawlers can read. Four decisions were taken in interview:

| Decision | Answer | Effect on the plan |
|---|---|---|
| Tutorial cadence | Steady stream, demos inline | Justifies MDX content collections and a real framework now |
| Crawlability of existing project pages | The project pages too | Full SSG of all pages is in scope, not just net-new writeups |
| Theme flash tolerance for returning visitors | No visible flash, ever | A visual-regression harness becomes mandatory, not optional |
| Willingness to own a framework | Willing | Greenlights Astro over a hand-rolled build |

## Decision

Migrate the site to **Astro**, using its **islands architecture** for the interactive demos, **MDX content collections** for tutorials, and **static site generation** for every page.

Astro renders the existing React components to static HTML at build time and ships JavaScript only for the islands that need interactivity. This delivers crawlable page bodies, a first-class markdown and MDX content pipeline, built-in image optimization, and the removal of in-browser Babel (which lets the CSP drop `script-src 'unsafe-eval'` unconditionally, and `'unsafe-inline'` once the pre-paint theme bootstrap is CSP-hashed), while keeping the output a directory of static files for the existing nginx container.

### Why Astro over the alternatives

Five options were designed and adversarially red-teamed. Scored one to five where five is most favorable:

| Option | Perf | SEO | Security | Content fit | Low effort | Low risk | Future fit | Total |
|---|---|---|---|---|---|---|---|---|
| **C. Astro (islands + MDX)** | 5 | 5 | 4 | 5 | 1 | 2 | 5 | **27** |
| E. Vite + React SSG | 4 | 5 | 4 | 5 | 2 | 2 | 4 | 26 |
| D. Eleventy (11ty) | 4 | 5 | 4 | 4 | 1 | 2 | 4 | 24 |
| B. Minimal esbuild precompile | 4 | 1 | 4 | 1 | 4 | 4 | 3 | 21 |
| A. Status quo plus fixes | 2 | 1 | 2 | 1 | 5 | 5 | 2 | 18 |

Astro wins on the axes that match the mission (content fit, SEO, future fit) at the cost of effort and migration risk. It is preferred over the other generators specifically because:

- **Eleventy** would force rewriting the page chrome into Nunjucks templates and hand-building the React-island integration that Astro provides natively, for the same SEO outcome.
- **Vite plus React SSG** ships more per-page JavaScript (whole-page hydration rather than per-island) and lands the same verified theme-flash and Twitch hydration issues without giving back island economics or MDX.

The lower-effort options (B minimal build, A status quo) were rejected for this owner because they leave SEO and the content pipeline unsolved, which the interview established as the whole point. They remain the correct answer for a low-cadence site, which is not this one.

## The de-risked plan

The migration is sequenced so that the look-preservation constraint becomes verifiable before anything changes, and so each page moves behind that safety net one at a time. Effort and risk are concentrated in Phase C and contained by the Phase A harness.

### Phase A: de-risking foundation (the live site is untouched)

- **Visual-regression harness.** A Playwright pixel-diff suite snapshots all eight pages across the real look matrix (accent, background, light/dark, rw-mode) on the current site. Run inside the pinned official Playwright Docker image so baselines generated locally match CircleCI exactly. This is the oracle that turns "do not change the look" and "no flash, ever" into a CI gate. It lands first.
- **Resolve the three verified blockers in principle.** Theme flash: a tiny pre-paint script, pinned with a `script-src` sha256 hash so it does not reintroduce `'unsafe-inline'`, reads the saved tweaks and sets the full theme (light/dark, accent, background, layout, and font variables) on `<html>` before first paint. Twitch embed: the `&parent=` host is injected at build from the canonical hostname rather than read from `window.location.hostname` (which is empty at build). Noto Music: the clef glyph font is hand-vendored because it is absent from `@fontsource`.
- **Asset and font wins.** Convert the two multi-megabyte PNGs (and the long tail of 150 to 390 KB PNGs) to WebP/AVIF, self-host fonts, and extend the smoke and resource asset checks to recognize `avif`. These are framework-independent, reversible, and Noto Music self-hosting is needed regardless.

### Phase B: single source of truth for the look

Extract the nineteen CSS template-literal blocks into real stylesheets and the Nav/Footer/shell chrome into Astro components, so the look exists as a served stylesheet rather than only at React runtime. Because the theme selectors are currently scoped to the `.tm` root div (which does not exist before React mounts), this phase also rescopes them so the pre-paint bootstrap can apply the saved theme to a root element. Prove pixel parity on the simplest page (bio or contact, which has no inline visualizations) before touching anything harder.

### Phase C: demos become islands, one page at a time

Convert the `window.*`-global components to ES module React islands mounted with `client:visible`. Migrate each project page individually, gated on the harness. This is where page bodies become crawlable, demos stay interactive, and in-browser Babel is removed (dropping `script-src 'unsafe-eval'`, and `'unsafe-inline'` given the hashed pre-paint bootstrap).

### Phase D: content collections and MDX writeups

Add Astro content collections for `/writeups`, with MDX so live demos can be woven mid-article. Frontmatter drives per-page head metadata, the sitemap, and robots. Seed at least one real tutorial end to end.

### Phase E: cutover

`astro build` feeds the existing hardened nginx image through one CircleCI build job. Migrate the test invariants (structure, SEO, resources, integrity) to the built output, add the visual-regression gate, tighten the CSP, and keep the entire Cloudflare to Caddy to nginx chain and manual-approval deploy unchanged.

## Constraints honored

- **Do not change the look.** Enforced by the Phase A harness, which gates every later phase.
- **Do not break functionality.** The interactive demos, the Twitch embed, and the cross-page theme persistence are migrated behind the harness and exercised in tests.
- **Preserve the deploy and security posture.** Only a build job is added; the runtime image still ships static files and zero Node.
- **Test-driven.** Failing tests are written before the code that satisfies them, wherever the work admits a test.

## Non-goals (what we are deliberately not doing)

- **No server-side application runtime.** Astro is used in static output mode. The site stays static.
- **No headless CMS.** Tutorials are markdown and MDX files in the repo.
- **We do not promise to drop `style-src 'unsafe-inline'`.** It is required by the styling model even after migration (React `<style>` children, the runtime lightbox `<style>`, inline `style` attributes, and the inline accent variable). Only the `script-src` relaxations are removed, and `script-src 'unsafe-inline'` only because the single pre-paint script is CSP-hashed.
- **No speculative abstractions.** Component structure and naming are preserved where they already read well; refactoring is for modularity that the migration actually needs.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Look regression during migration | The Phase A pixel harness gates every page; nothing merges that fails parity |
| Returning-visitor theme flash | Pre-paint inline theme bootstrap on `<html>`, verified by the harness with a saved non-default theme |
| Twitch embed breaks under SSG | Build-time injection of the canonical parent host; verified the iframe renders |
| Snapshot nondeterminism between local and CI | All snapshots generated and compared inside the same pinned Playwright Docker image |
| Scope creep stalls the mission | Each phase is an independently valuable, reviewed, merged PR; the harness and content pipeline deliver value before the full migration completes |
| Single maintainer upkeep | Astro plus a small, pinned dependency set; the runtime stays a single static image |

## Success criteria

- In-browser Babel is gone from the wire. `script-src` drops `'unsafe-eval'` unconditionally, and drops `'unsafe-inline'` because the one pre-paint theme bootstrap is pinned by a `script-src` sha256 hash (or externalized to a `'self'` file).
- Every page's body prose is present in the served static HTML (verifiable with JavaScript disabled).
- A `/writeups` pipeline is live with at least one tutorial whose full body is in the served HTML and which can embed a live demo.
- Returning visitors with a saved theme see it applied with no visible flash, proven by the harness.
- The hardened deploy is unchanged: same container, same Cloudflare to Caddy to nginx chain, same CircleCI lint, test, verify, manual-approval, auto-rollback flow, with one added build job.
- The existing test invariants are preserved or replaced by equal-or-stronger guarantees, plus the new visual-regression gate.

## Consequences

Positive: crawlable and LLM-readable content on every page, a real tutorials pipeline with inline demos, a smaller and faster cold load, a tighter CSP, and page authoring that no longer requires hand-wiring `window.*` globals and script order.

Negative: a genuine migration of roughly 5,500 lines, a new framework dependency surface to maintain, and a one-time look-reverification cost. The harness is the primary control for the reverification cost; the dependency surface is accepted per the owner's interview decision.

## References

- `docs/architecture.md` for the current rendering model and the deploy topology that is retained.
- The architecture evaluation and adversarial red-team that produced this decision (session record, 2026-06-04).
