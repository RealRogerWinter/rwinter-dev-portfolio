// Locks the Astro build pipeline config: the existing site is served verbatim
// from publicDir (site/), output goes to dist/ (what the container serves), and
// URLs stay flat (.html, not /dir/). A regression here would break the deploy.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const cfg = fs.readFileSync(path.join(import.meta.dirname, '..', 'astro.config.mjs'), 'utf8');

describe('astro build pipeline config', () => {
  it('serves the existing site verbatim from publicDir', () => {
    expect(cfg).toMatch(/publicDir:\s*['"]\.\/site['"]/);
  });
  it('outputs to dist/ (the image input, gitignored, built in CI)', () => {
    expect(cfg).toMatch(/outDir:\s*['"]\.\/dist['"]/);
  });
  it('keeps flat .html URLs (format: file)', () => {
    expect(cfg).toMatch(/format:\s*['"]file['"]/);
  });
});
