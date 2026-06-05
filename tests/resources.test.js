// Every local resource a page references (vendor JS, JSX, favicon) must exist —
// guards against the kind of dangling path that the HOME_FILE bug would have been.
import { describe, it, expect } from 'vitest';
import { PAGES, read, existsUrl } from './_lib.js';

describe('HTML references resolve to real files', () => {
  for (const p of PAGES) {
    it(`${p} has no broken local src/href`, () => {
      const refs = [...read(p).matchAll(/(?:src|href)="([^"]+)"/g)]
        .map((m) => m[1])
        .filter((r) => !/^(https?:|#|mailto:|data:)/.test(r));
      expect(refs.length).toBeGreaterThan(0);
      // existsUrl, not exists: a link like /projects/<id> is served from
      // /projects/<id>.html (clean URL), so it has no on-disk file of its own.
      for (const r of refs) expect(existsUrl(r), `${p} -> ${r}`).toBe(true);
    });
  }
});
