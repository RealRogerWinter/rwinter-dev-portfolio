// Single source of truth for site-wide identity/contact data, mirroring the
// canonical values in site/portfolio/data.jsx (window.PORTFOLIO). Migrated Astro
// pages import from here instead of re-hardcoding. Project data lives in
// src/data/portfolio.js.
export const email = 'rogerdwinter@gmail.com';

export const social = {
  github: { href: 'https://github.com/RealRogerWinter', handle: 'RealRogerWinter' },
  linkedin: {
    href: 'https://www.linkedin.com/in/roger-winter-content-strategy',
    handle: 'in/roger-winter-content-strategy',
  },
  // Domain handle: @rogerwinter.dev is claimed via an _atproto DNS TXT record
  // (Cloudflare), not a file here. This is just the public profile link.
  bluesky: {
    href: 'https://bsky.app/profile/rogerwinter.dev',
    handle: '@rogerwinter.dev',
  },
};

export const repo = 'https://github.com/RealRogerWinter/rwinter-dev-portfolio';
