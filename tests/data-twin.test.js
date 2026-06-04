// Drift guard for the transitional data twin: src/data/portfolio.js (ESM, used by
// migrated Astro pages) must stay identical to the `projects` in the still-live
// window-global site/portfolio/data.jsx (which drives the un-migrated project
// pages). When all project pages migrate and data.jsx is deleted, drop this test.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { projects } from '../src/data/portfolio.js';

function oldProjects() {
  // data.jsx is a plain `window.PORTFOLIO = {...}` object literal (no JSX).
  const code = fs.readFileSync(path.join(import.meta.dirname, '..', 'site', 'portfolio', 'data.jsx'), 'utf8');
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { filename: 'data.jsx' });
  return ctx.window.PORTFOLIO.projects;
}

describe('portfolio data twin', () => {
  it('src/data/portfolio.js projects match the window-global data.jsx (no drift)', () => {
    expect(projects).toEqual(oldProjects());
  });
});
