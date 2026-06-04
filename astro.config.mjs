import { defineConfig } from 'astro/config';

// Incremental migration setup. The existing in-browser-Babel site is served
// verbatim from `site/` (publicDir): Astro copies it into the build output
// untouched. Pages migrated to Astro live in `src/pages/` and override the
// matching path. `format: 'file'` keeps flat URLs (/bio.html, not /bio/).
// The build output (dist/) is what the container serves.
export default defineConfig({
  site: 'https://rogerwinter.dev',
  publicDir: './site',
  outDir: './dist',
  srcDir: './src',
  build: { format: 'file' },
  markdown: {
    shikiConfig: {
      // Dual-theme: each token carries both palettes as CSS vars (--shiki-light/
      // --shiki-dark); writeup.css applies the right one per data-theme, so code
      // is readable in BOTH light and dark (a single dark theme is light-on-light
      // in light mode).
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
