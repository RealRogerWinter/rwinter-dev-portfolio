// Zero-dependency static file server for the visual-regression harness.
// Serves the Astro build output (`dist/`) exactly as nginx does in production,
// so the harness gates the deployed artifact (verbatim pages + any migrated
// Astro pages). Run `npm run build` first; the Playwright webServer does.
//
// Usage: node tests/visual/static-server.mjs [port]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..', 'dist');
const PORT = Number(process.argv[2]) || 4317;

// Content types kept minimal and explicit. .jsx is fetched-as-text by the
// in-browser Babel loader, so its type is not load-bearing; text/plain is safe.
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.jsx': 'text/plain; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200, { 'content-type': 'text/plain' });
    return res.end('ok');
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400);
    return res.end('bad request');
  }
  if (pathname.endsWith('/')) pathname += 'index.html';

  // Resolve and confine to ROOT using the canonical containment check
  // (path.relative is separator-safe; no startsWith/prefix ambiguity).
  const filePath = path.resolve(ROOT, '.' + pathname);
  const rel = path.relative(ROOT, filePath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    res.writeHead(403);
    return res.end('forbidden');
  }
  fs.readFile(filePath, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      return res.end('not found');
    }
    const type = TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'content-type': type });
    res.end(buf);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`visual static server: http://127.0.0.1:${PORT}/  (root: ${ROOT})`);
});
