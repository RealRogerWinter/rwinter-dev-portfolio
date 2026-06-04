// Build-time date formatting, pinned to UTC + en-US so the rendered date (and
// the committed visual baselines) are identical across build environments. A
// frontmatter `date: 2026-06-04` is parsed as UTC midnight; without timeZone:UTC
// a US-timezone builder would render the previous day.
export function fmtDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
