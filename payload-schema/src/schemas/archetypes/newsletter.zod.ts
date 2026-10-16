import { z } from 'zod';
import { testimonialItemSchema } from './learning-platform.zod.js';

export const newsletterEditionSchema = z.object({
  issueNumber: z.union([z.number().int().min(1), z.string().min(1)]),
  title: z.string().min(1, 'Edition title is required'),
  publishedAt: z.string().min(1, 'publishedAt date string is required'),
  summary: z.string().min(1, 'Edition summary is required'),
  highlights: z.array(z.string().min(1)).min(1, 'At least one highlight is required'),
  readUrl: z.string().optional(),
});

export const newsletterSampleIssueSchema = z.object({
  title: z.string().min(1, 'Sample issue title is required'),
  snippet: z.string().min(1, 'Sample issue snippet is required'),
});

export const newsletterContentSchema = z.object({
  cadence: z.string().min(1, 'Newsletter publication cadence is required'),
  subscriberCount: z.union([z.string(), z.number()]).optional(),
  leadIn: z.string().min(1, 'Newsletter lead-in copy is required'),
  perks: z.array(z.string().min(1)).min(1, 'At least one subscriber perk is required'),
  editions: z.array(newsletterEditionSchema).min(1, 'At least one newsletter edition is required'),
  testimonials: z.array(testimonialItemSchema).optional(),
  sampleIssue: newsletterSampleIssueSchema.optional(),
});
