import { defineCollection, z } from 'astro:content';

// Writeups: markdown tutorials/deep-dives. Frontmatter is schema-validated, and
// drives the per-article <head> meta + the index listing. MDX (inline live
// demos) is added later, when an article needs an interactive component.
const writeups = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writeups };
