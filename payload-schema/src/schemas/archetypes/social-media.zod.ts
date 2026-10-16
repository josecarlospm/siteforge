import { z } from 'zod';

export const socialAuthorSchema = z.object({
  name: z.string().min(1, 'Author name is required'),
  handle: z
    .string()
    .min(1, 'Handle is required')
    .regex(/^@?[a-zA-Z0-9_]+$/, 'Handle must contain alphanumeric characters and underscores'),
  avatarUrl: z.string().optional(),
  verified: z.boolean().optional(),
});

export const feedPostSchema = z.object({
  id: z.string().min(1, 'Post ID is required'),
  author: socialAuthorSchema,
  content: z.string().min(1, 'Post content is required'),
  timestamp: z.string().min(1, 'Timestamp is required'),
  likesCount: z.number().int().min(0, 'likesCount cannot be negative'),
  repliesCount: z.number().int().min(0, 'repliesCount cannot be negative'),
  sharesCount: z.number().int().min(0, 'sharesCount cannot be negative'),
  tags: z.array(z.string().min(1)).optional(),
  mediaUrl: z.string().optional(),
});

export const communityChannelSchema = z.object({
  id: z.string().min(1, 'Channel ID is required'),
  name: z.string().min(1, 'Channel name is required'),
  membersCount: z.number().int().min(0),
  description: z.string().min(1, 'Channel description is required'),
  icon: z.string().optional(),
});

export const communityMetricSchema = z.object({
  label: z.string().min(1, 'Metric label is required'),
  value: z.string().min(1, 'Metric value is required'),
});

export const socialMediaContentSchema = z.object({
  platformType: z.string().min(1, 'Platform type is required'),
  trendingTopics: z.array(z.string().min(1)).min(1, 'At least one trending topic is required'),
  feedPosts: z.array(feedPostSchema).min(1, 'At least one feed post is required'),
  channels: z.array(communityChannelSchema).optional(),
  communityMetrics: z.array(communityMetricSchema).optional(),
});
