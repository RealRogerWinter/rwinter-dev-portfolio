// Generated sitemap. Main pages are listed explicitly; their URLs are stable
// whether served verbatim or by Astro. The /writeups section is offline for now
// (its routes were removed), so it is not advertised here; re-add a writeups
// loop (getCollection('writeups', ({ data }) => !data.draft)) when it returns.
const SITE = 'https://rogerwinter.dev';
const MAIN = [
  '/', '/bio.html', '/contact.html',
  '/projects/multilingual-seo', '/projects/onestreamer',
  '/projects/price-games', '/projects/pricey', '/projects/sheet-llm',
];

export function GET() {
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    MAIN.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
