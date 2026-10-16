/**
 * SiteForge Site Archetype Content Contracts
 * Supports: learning_platform, blog, newsletter, ecommerce, social_media, landing_page.
 */

export const SITE_TYPES = [
  'learning_platform',
  'blog',
  'newsletter',
  'ecommerce',
  'social_media',
  'landing_page',
] as const;

export type SiteType = (typeof SITE_TYPES)[number];

/* =========================================================================
 * 1. Learning Platform
 * ========================================================================= */
export interface CourseModule {
  title: string;
  duration: string;
  summary?: string;
}

export interface CourseItem {
  id: string;
  title: string;
  instructor: string;
  level: string;
  duration: string;
  lessonsCount: number;
  rating: number;
  studentsCount: number;
  badge?: string;
  summary: string;
  thumbnailUrl?: string;
  modules: CourseModule[];
}

export interface StatItem {
  value: string;
  label: string;
  icon?: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  avatarUrl?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface LearningPlatformContent {
  featuredCategories: string[];
  courses: CourseItem[];
  stats?: StatItem[];
  testimonials?: TestimonialItem[];
  faqs?: FaqItem[];
}

/* =========================================================================
 * 2. Blog
 * ========================================================================= */
export interface BlogPostAuthor {
  name: string;
  role?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  author: BlogPostAuthor;
  category: string;
  publishedAt: string;
  readingTime: string;
  summary: string;
  contentMarkdown?: string;
  coverImage?: string;
  tags: string[];
  featured?: boolean;
}

export interface BlogContent {
  categories: string[];
  posts: BlogPostItem[];
  authors?: BlogPostAuthor[];
  featuredPostId?: string;
  newsletterCta?: {
    title: string;
    description: string;
    buttonText: string;
  };
}

/* =========================================================================
 * 3. Newsletter
 * ========================================================================= */
export interface NewsletterEdition {
  issueNumber: number | string;
  title: string;
  publishedAt: string;
  summary: string;
  highlights: string[];
  readUrl?: string;
}

export interface NewsletterSampleIssue {
  title: string;
  snippet: string;
}

export interface NewsletterContent {
  cadence: string;
  subscriberCount?: string | number;
  leadIn: string;
  perks: string[];
  editions: NewsletterEdition[];
  testimonials?: TestimonialItem[];
  sampleIssue?: NewsletterSampleIssue;
}

/* =========================================================================
 * 4. E-Commerce
 * ========================================================================= */
export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  collection: string;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  description: string;
  features?: string[];
  inStock: boolean;
  images: string[];
  sku?: string;
}

export interface ShippingHighlight {
  title: string;
  description: string;
  icon?: string;
}

export interface PromotionalBanner {
  headline: string;
  code?: string;
  discount?: string;
}

export interface EcommerceContent {
  currency: string;
  currencySymbol?: string;
  collections: string[];
  products: ProductItem[];
  shippingHighlights?: ShippingHighlight[];
  promotionalBanner?: PromotionalBanner;
  reviews?: TestimonialItem[];
}

/* =========================================================================
 * 5. Social Media / Community
 * ========================================================================= */
export interface SocialAuthor {
  name: string;
  handle: string;
  avatarUrl?: string;
  verified?: boolean;
}

export interface FeedPost {
  id: string;
  author: SocialAuthor;
  content: string;
  timestamp: string;
  likesCount: number;
  repliesCount: number;
  sharesCount: number;
  tags?: string[];
  mediaUrl?: string;
}

export interface CommunityChannel {
  id: string;
  name: string;
  membersCount: number;
  description: string;
  icon?: string;
}

export interface CommunityMetric {
  label: string;
  value: string;
}

export interface SocialMediaContent {
  platformType: string;
  trendingTopics: string[];
  feedPosts: FeedPost[];
  channels?: CommunityChannel[];
  communityMetrics?: CommunityMetric[];
}

/* =========================================================================
 * 6. Landing Page
 * ========================================================================= */
export interface HeroAction {
  label: string;
  href: string;
}

export interface LandingHero {
  headline: string;
  subheadline: string;
  primaryCta: HeroAction;
  secondaryCta?: HeroAction;
  mediaUrl?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  billingPeriod: string;
  features: string[];
  isPopular?: boolean;
  ctaLabel: string;
}

export interface LandingPageContent {
  hero: LandingHero;
  features: FeatureItem[];
  socialProof?: StatItem[];
  pricingPlans?: PricingPlan[];
  testimonials?: TestimonialItem[];
  faqs?: FaqItem[];
  ctaSection?: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref?: string;
  };
}
