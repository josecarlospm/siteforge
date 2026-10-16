/**
 * Hydrates default archetype content when omitted by the user
 */
export class PayloadHydrator {
  static hydrate(rawPayload: Record<string, any>): Record<string, any> {
    const payload = JSON.parse(JSON.stringify(rawPayload));
    const siteType = payload.siteType || 'learning_platform';
    const theme = payload.theme || {};
    const topic = theme.topic || theme.name || 'General';
    const content = theme.content || {};

    if (!payload.theme) {
      payload.theme = {};
    }

    if (!payload.integrations) {
      payload.integrations = {};
    }
    if (!payload.integrations.github) {
      payload.integrations.github = {
        repoName: theme.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'siteforge-app',
      };
    }
    if (!payload.integrations.vercel) {
      payload.integrations.vercel = {
        projectName: payload.integrations.github.repoName,
      };
    }

    switch (siteType) {
      case 'learning_platform':
        if (!content.featuredCategories || !content.courses) {
          theme.content = {
            featuredCategories: content.featuredCategories || [
              'Beginner Fundamentals',
              'Advanced Techniques',
              'Best Practices & Guides',
              'Masterclass Series',
            ],
            courses: content.courses || [
              {
                id: 'course-foundations-101',
                title: `${topic} 101: Essential Foundations`,
                instructor: 'SiteForge Expert Faculty',
                level: 'Beginner',
                duration: '2h 15m',
                lessonsCount: 6,
                rating: 4.9,
                studentsCount: 1250,
                badge: 'Bestseller',
                summary: `Comprehensive masterclass on ${topic} fundamentals, core workflows, and foundational principles.`,
                thumbnailUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b',
                modules: [
                  { title: 'Core Principles & Architecture', duration: '20 min' },
                  { title: 'Hands-on Practice & Walkthrough', duration: '35 min' },
                  { title: 'Real-world Application & Case Study', duration: '25 min' },
                ],
              },
              {
                id: 'course-mastery-201',
                title: `${topic} Advanced Mastery & Optimization`,
                instructor: 'SiteForge Lead Specialist',
                level: 'Intermediate to Advanced',
                duration: '3h 30m',
                lessonsCount: 10,
                rating: 4.8,
                studentsCount: 890,
                badge: 'Advanced',
                summary: `Deep dive into advanced patterns, systematic debugging, and peak efficiency in ${topic}.`,
                thumbnailUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587',
                modules: [
                  { title: 'Advanced Tactics & Implementation', duration: '30 min' },
                  { title: 'Performance & Scalability Tuning', duration: '40 min' },
                ],
              },
            ],
          };
        }
        break;

      case 'blog':
        if (!content.categories || !content.posts) {
          theme.content = {
            categories: content.categories || ['Guides', 'Insights', 'Industry Trends', 'Tutorials'],
            posts: content.posts || [
              {
                id: 'post-welcome',
                title: `Getting Started with ${topic}: A Complete Guide`,
                slug: 'getting-started-guide',
                excerpt: `Discover the top strategies, insights, and workflows for ${topic}.`,
                author: 'SiteForge Editorial Team',
                publishedAt: '2026-10-15',
                readTime: '5 min read',
                tags: ['guide', 'getting-started', topic.toLowerCase().replace(/[^a-z0-9]/g, '-')],
              },
            ],
          };
        }
        break;

      case 'newsletter':
        if (!content.frequency || !content.latestIssues) {
          theme.content = {
            frequency: content.frequency || 'Weekly on Thursdays',
            subscriberCount: content.subscriberCount || 4200,
            latestIssues: content.latestIssues || [
              {
                issueNumber: 42,
                title: `The Future of ${topic}: Emerging Trends & Deep Dives`,
                date: '2026-10-16',
                excerpt: `In this edition, we analyze breakthrough innovations and actionable tips for ${topic}.`,
                readTime: '4 min read',
              },
            ],
          };
        }
        break;

      case 'ecommerce':
        if (!content.currencies || !content.products) {
          theme.content = {
            currencies: content.currencies || ['USD', 'EUR', 'GBP'],
            products: content.products || [
              {
                id: 'prod-flagship',
                name: `${topic} Premium Starter Kit`,
                price: 79.99,
                currency: 'USD',
                rating: 4.9,
                reviewsCount: 342,
                inStock: true,
                description: `Everything you need to succeed with ${topic}, built with highest grade quality.`,
              },
            ],
          };
        }
        break;

      case 'social_media':
        if (!content.networkName || !content.feedItems) {
          theme.content = {
            networkName: content.networkName || `${theme.name || 'SiteForge'} Community`,
            trendingTopics: content.trendingTopics || [`#${topic.replace(/\s+/g, '')}`, '#Innovation', '#WebFactory'],
            feedItems: content.feedItems || [
              {
                id: 'feed-1',
                author: 'Community Lead',
                handle: '@lead_curator',
                content: `Excited to announce our new community space dedicated to ${topic}! Join the conversation.`,
                likes: 128,
                reposts: 34,
                timestamp: '2 hours ago',
              },
            ],
          };
        }
        break;

      case 'landing_page':
        if (!content.headline || !content.features) {
          theme.content = {
            headline: content.headline || theme.tagline || `Transform Your Experience with ${topic}`,
            subheadline: content.subheadline || theme.description || `The next-generation solution engineered for ${topic}.`,
            callToAction: content.callToAction || {
              primary: { label: 'Get Started Free', href: '#signup' },
              secondary: { label: 'Explore Features', href: '#features' },
            },
            features: content.features || [
              {
                title: 'Intelligent Automation',
                description: `Zero-friction workflows tailored specifically for ${topic}.`,
                icon: 'sparkles',
              },
              {
                title: 'High Performance',
                description: 'Blazing fast load times, modern Angular architecture, and verified reliability.',
                icon: 'zap',
              },
            ],
          };
        }
        break;
    }

    payload.theme = theme;
    return payload;
  }
}
