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
  label: string;
  description: string;
}

export const ARCHETYPES: ArchetypeDefinition[] = [
  {
    type: 'learning_platform',
    title: 'Learning platform',
    label: 'siteType: learning_platform',
    description: 'Course catalogs, lessons, and progress tracking.',
  },
  {
    type: 'blog',
    title: 'Blog',
    label: 'siteType: blog',
    description: 'Articles, categories, authors, and reading time.',
  },
  {
    type: 'newsletter',
    title: 'Newsletter',
    label: 'siteType: newsletter',
    description: 'Issue archives and subscriber capture.',
  },
  {
    type: 'ecommerce',
    title: 'Ecommerce',
    label: 'siteType: ecommerce',
    description: 'Collections, pricing, and product detail flows.',
  },
  {
    type: 'social_media',
    title: 'Social media',
    label: 'siteType: social_media',
    description: 'Feed, handles, and interaction surfaces.',
  },
  {
    type: 'landing_page',
    title: 'Landing page',
    label: 'siteType: landing_page',
    description: 'Hero, value proposition, and conversion CTAs.',
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
