export type FactorySiteType =
  | 'learning_platform'
  | 'blog'
  | 'newsletter'
  | 'ecommerce'
  | 'social_media'
  | 'landing_page';

export interface ArchetypeDefinition {
  type: FactorySiteType;
  title: string;
  badge: string;
  icon: string;
  description: string;
  features: string[];
}

export const ARCHETYPES: ArchetypeDefinition[] = [
  {
    type: 'learning_platform',
    title: 'E-Learning Portal',
    badge: 'Flagship Reference',
    icon: '🎓',
    description: 'Course catalogs, interactive lessons, progress tracking, and expert instructors.',
    features: ['Curriculum modules', 'Level badges', 'Student ratings', 'Video player stubs'],
  },
  {
    type: 'blog',
    title: 'Editorial & Journal',
    badge: 'Content Heavy',
    icon: '✍️',
    description: 'Articles, category filters, author bios, tags, and reading duration estimates.',
    features: ['Category taxonomy', 'Reading time', 'Author signatures', 'Related stories'],
  },
  {
    type: 'newsletter',
    title: 'Curated Digest',
    badge: 'Audience Builder',
    icon: '📬',
    description: 'Publication landing, issue archives, subscriber counters, and lead capture.',
    features: ['Archive browser', 'Issue counters', '1-Click signup', 'Publishing cadence'],
  },
  {
    type: 'ecommerce',
    title: 'Digital Storefront',
    badge: 'Commerce Ready',
    icon: '🛍️',
    description: 'Showcase collections, inventory badges, multi-currency pricing, and reviews.',
    features: ['Product cards', 'Stock status', 'Currency switch', 'Feature bullets'],
  },
  {
    type: 'social_media',
    title: 'Community Network',
    badge: 'High Engagement',
    icon: '💬',
    description: 'Activity stream, trending hashtags, author handles, and reaction counters.',
    features: ['Live feed', 'Trending hashtags', 'Interactions', 'Avatar badges'],
  },
  {
    type: 'landing_page',
    title: 'Product Launchpad',
    badge: 'Conversion Focused',
    icon: '🚀',
    description: 'High-impact hero banner, value proposition grid, social proof, and primary CTAs.',
    features: ['Headline & tagline', 'Feature cards', 'Dual CTAs', 'Conversion sections'],
  },
];

export interface PipelineStageInfo {
  id: string;
  label: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  durationMs?: number;
  log?: string;
}

export interface FactoryGenerationResult {
  projectName: string;
  siteType: FactorySiteType;
  designPreset: string;
  themeName: string;
  githubUrl: string;
  vercelUrl: string;
  commitSha: string;
  durationMs: number;
  filesGenerated: number;
}
