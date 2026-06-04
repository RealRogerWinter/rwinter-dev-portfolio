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
};

export const repo = 'https://github.com/RealRogerWinter/rwinter-dev-portfolio';
