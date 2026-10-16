import { z } from 'zod';

export const blogPostAuthorSchema = z.object({
  name: z.string().min(1, 'Author name is required'),
  role: z.string().optional(),
  avatarUrl: z.string().optional(),
  bio: z.string().optional(),
});

export const blogPostItemSchema = z.object({
  id: z.string().min(1, 'Post ID is required'),
  title: z.string().min(1, 'Post title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and hyphens'),
  author: blogPostAuthorSchema,
  category: z.string().min(1, 'Category is required'),
  publishedAt: z.string().min(1, 'publishedAt date string is required'),
  readingTime: z.string().min(1, 'readingTime is required'),
  summary: z.string().min(1, 'Post summary is required'),
  contentMarkdown: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string().min(1)),
  featured: z.boolean().optional(),
});

export const blogContentSchema = z.object({
  categories: z
    .array(z.string().min(1))
    .min(1, 'At least one category is required'),
  posts: z.array(blogPostItemSchema).min(1, 'At least one blog post is required'),
  authors: z.array(blogPostAuthorSchema).optional(),
  featuredPostId: z.string().optional(),
  newsletterCta: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      buttonText: z.string().min(1),
    })
    .optional(),
});
