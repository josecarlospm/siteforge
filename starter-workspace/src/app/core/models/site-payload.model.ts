import { DesignPresetName } from './design-tokens.model';

export type SiteType =
  | 'learning_platform'
  | 'blog'
  | 'newsletter'
  | 'ecommerce'
  | 'social_media'
  | 'landing_page';

export interface CourseModule {
  title: string;
  duration: string;
}

export interface CourseEntity {
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
  modules: CourseModule[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

export interface PlantCareContent {
  featuredCategories: string[];
  courses: CourseEntity[];
  stats: StatItem[];
  testimonials: TestimonialItem[];
}

export interface ThemeConfig<TContent = PlantCareContent> {
  topic: string;
  name: string;
  tagline: string;
  description: string;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontHeading?: string;
    fontBody?: string;
  };
  content?: TContent;
}

export interface IntegrationsConfig {
  github: {
    repoName: string;
    owner?: string;
    isPrivate?: boolean;
    autoInit?: boolean;
  };
  vercel: {
    projectName: string;
    teamId?: string;
    framework?: string;
    envVariables?: Record<string, string>;
  };
}

export interface SiteForgePayload<TContent = PlantCareContent> {
  version: '1.0.0';
  siteType: SiteType;
  designPreset: DesignPresetName;
  theme: ThemeConfig<TContent>;
  integrations: IntegrationsConfig;
}
