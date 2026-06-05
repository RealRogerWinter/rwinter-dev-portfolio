import { getCollection } from 'astro:content';

// Generated sitemap — overrides the old verbatim site/sitemap.xml so writeups
// are listed automatically as they are published. The main pages are listed
// explicitly (their URLs are stable whether served verbatim or by Astro).
const SITE = 'https://rogerwinter.dev';
const MAIN = [
  '/', '/bio.html', '/contact.html',
  '/projects/multilingual-seo', '/projects/onestreamer',
  '/projects/price-games', '/projects/pricey', '/projects/sheet-llm',
  '/writeups.html',
];

export async function GET() {
  const writeups = await getCollection('writeups', ({ data }) => !data.draft);
  const locs = [...MAIN, ...writeups.map((w) => `/writeups/${w.slug}.html`)];
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    locs.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
