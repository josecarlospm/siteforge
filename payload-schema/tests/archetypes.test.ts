import { describe, it, expect } from 'vitest';
import {
  learningPlatformContentSchema,
  blogContentSchema,
  newsletterContentSchema,
  ecommerceContentSchema,
  socialMediaContentSchema,
  landingPageContentSchema,
} from '../src/index.js';

describe('Archetype Content Schemas', () => {
  it('validates learning platform requires at least 1 course and 1 category', () => {
    const emptyResult = learningPlatformContentSchema.safeParse({
      featuredCategories: [],
      courses: [],
    });
    expect(emptyResult.success).toBe(false);

    const validResult = learningPlatformContentSchema.safeParse({
      featuredCategories: ['Gardening'],
      courses: [
        {
          id: 'c1',
          title: 'Title',
          instructor: 'Inst',
          level: 'Beginner',
          duration: '1h',
          lessonsCount: 5,
          rating: 4.8,
          studentsCount: 100,
          summary: 'Summary',
          modules: [{ title: 'Mod 1', duration: '20m' }],
        },
      ],
    });
    expect(validResult.success).toBe(true);
  });

  it('validates blog requires slug matching lowercase alphanumeric pattern', () => {
    const invalidSlug = blogContentSchema.safeParse({
      categories: ['Tech'],
      posts: [
        {
          id: 'p1',
          title: 'Title',
          slug: 'INVALID SLUG WITH SPACES',
          author: { name: 'Author' },
          category: 'Tech',
          publishedAt: '2026-01-01',
          readingTime: '5m',
          summary: 'Sum',
          tags: ['tag'],
        },
      ],
    });
    expect(invalidSlug.success).toBe(false);
  });

  it('validates newsletter requires editions and perks', () => {
    const res = newsletterContentSchema.safeParse({
      cadence: 'Weekly',
      leadIn: 'Join us',
      perks: ['Perk 1'],
      editions: [
        {
          issueNumber: 1,
          title: 'Issue 1',
          publishedAt: '2026-01-01',
          summary: 'Summary',
          highlights: ['Highlight 1'],
        },
      ],
    });
    expect(res.success).toBe(true);
  });

  it('validates ecommerce requires 3-letter currency code and non-negative prices', () => {
    const invalidCurrency = ecommerceContentSchema.safeParse({
      currency: 'DOLLARS',
      collections: ['Plants'],
      products: [
        {
          id: 'p1',
          name: 'Plant',
          slug: 'plant',
          price: -10,
          collection: 'Plants',
          description: 'Desc',
          inStock: true,
          images: ['https://example.com/img.jpg'],
        },
      ],
    });
    expect(invalidCurrency.success).toBe(false);
  });

  it('validates social media requires trending topics and feed posts', () => {
    const res = socialMediaContentSchema.safeParse({
      platformType: 'community',
      trendingTopics: ['#AI'],
      feedPosts: [
        {
          id: 'f1',
          author: { name: 'User', handle: '@user' },
          content: 'Hello world',
          timestamp: 'now',
          likesCount: 10,
          repliesCount: 2,
          sharesCount: 1,
        },
      ],
    });
    expect(res.success).toBe(true);
  });

  it('validates landing page requires hero headline and at least 1 feature', () => {
    const res = landingPageContentSchema.safeParse({
      hero: {
        headline: 'Transform your workflow',
        subheadline: 'Automated code generation',
        primaryCta: { label: 'Get Started', href: '/signup' },
      },
      features: [
        {
          id: 'f1',
          title: 'High Speed',
          description: 'Instant builds',
        },
      ],
    });
    expect(res.success).toBe(true);
  });
});
