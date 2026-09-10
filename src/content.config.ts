import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const publishable = {
  draft: z.boolean().default(true),
  reviewed: z.boolean().default(false),
};

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string().max(80),
    summary: z.string().max(160),
    period: z.string(),
    org: z.string(),
    role: z.string(),
    featured: z.boolean().default(false),
    order: z.number().int().default(99),
    outcome: z
      .object({ metric: z.string(), before: z.string().optional(), after: z.string().optional() })
      .optional(),
    stack: z.array(z.string()).max(8),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
    ...publishable,
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string().max(80),
    summary: z.string().max(160),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    status: z.enum(['seed', 'growing', 'evergreen']),
    tags: z.array(z.string()).max(6).default([]),
    ...publishable,
  }),
});

const now = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/now' }),
  schema: z.object({
    updated: z.coerce.date(),
    headline: z.string().max(80),
  }),
});

export const collections = { work, notes, now };
