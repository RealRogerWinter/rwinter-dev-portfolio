// Supply-chain + self-hosting invariants: vendored libs match their pinned SRI,
// nothing loads from a third-party CDN, and the HOME_FILE 404-fix stays fixed.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { SITE, PAGES, read } from './_lib.js';

describe('vendor integrity & self-hosting', () => {
  it('vendor files match VENDOR.lock SRI hashes', () => {
    const lines = fs
      .readFileSync(path.join(SITE, 'vendor/VENDOR.lock'), 'utf8')
      .split('\n')
      .filter((l) => l.trim() && !l.startsWith('#'));
    expect(lines.length).toBeGreaterThanOrEqual(3);
    for (const line of lines) {
      const [name, sri] = line.trim().split(/\s+/);
      const buf = fs.readFileSync(path.join(SITE, 'vendor', name));
      const got = 'sha384-' + crypto.createHash('sha384').update(buf).digest('base64');
      expect(got, name).toBe(sri);
    }
  });

  it('no third-party CDN script references in any page', () => {
    for (const p of PAGES) expect(read(p), p).not.toMatch(/unpkg\.com|cdn\.jsdelivr|cdnjs\.|jsdelivr\.net/);
  });

  it('HOME_FILE is "/" (nav 404-fix invariant)', () => {
    expect(read('portfolio/shell.jsx')).toMatch(/HOME_FILE\s*=\s*"\/"/);
  });
});
