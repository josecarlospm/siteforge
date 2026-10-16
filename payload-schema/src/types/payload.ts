/**
 * SiteForge Canonical Payload Contracts & Type Definitions
 */

import {
  SiteType,
  LearningPlatformContent,
  BlogContent,
  NewsletterContent,
  EcommerceContent,
  SocialMediaContent,
  LandingPageContent,
} from './archetypes.js';
import { DesignPreset, DesignTokensOverride } from './presets.js';
import { IntegrationsConfig } from './integrations.js';

export interface ThemeBranding {
  /**
   * Primary brand color override (hex format: #RGB or #RRGGBB).
   */
  primaryColor?: string;

  /**
   * Secondary brand color override (hex format: #RGB or #RRGGBB).
   */
  secondaryColor?: string;

  /**
   * Heading font family name (e.g. "Syne", "Space Grotesk").
   */
  fontHeading?: string;

  /**
   * Body font family name (e.g. "DM Sans", "IBM Plex Sans").
   */
  fontBody?: string;

  /**
   * Optional URL for brand logo.
   */
  logoUrl?: string;

  /**
   * Optional URL for browser favicon.
   */
  faviconUrl?: string;
}

export interface ThemeConfig<TContent = unknown> {
  /**
   * Core subject matter of the site (e.g., "Indoor Houseplant Care").
   */
  topic: string;

  /**
   * Commercial name of the website / brand (e.g., "PlantCare Academy").
   */
  name: string;

  /**
   * Marketing tagline.
   */
  tagline: string;

  /**
   * Descriptive copy used for meta descriptions and hero sections.
   */
  description: string;

  /**
   * Optional branding color and typography overrides.
   */
  branding?: ThemeBranding;

  /**
   * Domain entities matching the selected siteType.
   */
  content: TContent;
}

export interface BaseSiteForgePayload<
  TType extends SiteType = SiteType,
  TContent = unknown,
> {
  /**
   * Payload contract schema version.
   * @example "1.0.0"
   */
  version: '1.0.0' | string;

  /**
   * Structural website archetype.
   */
  siteType: TType;

  /**
   * Design token preset mapped to Design.md.
   */
  designPreset: DesignPreset;

  /**
   * Optional design token overrides applied over the preset.
   */
  designTokens?: DesignTokensOverride;

  /**
   * Domain theme, brand copy, and archetype-specific content seed.
   */
  theme: ThemeConfig<TContent>;

  /**
   * Cloud integration credentials and repository provisioning settings.
   */
  integrations: IntegrationsConfig;

  /**
   * Arbitrary metadata or build hooks.
   */
  metadata?: Record<string, unknown>;
}

export type SiteForgePayloadLearningPlatform = BaseSiteForgePayload<
  'learning_platform',
  LearningPlatformContent
>;

export type SiteForgePayloadBlog = BaseSiteForgePayload<
  'blog',
  BlogContent
>;

export type SiteForgePayloadNewsletter = BaseSiteForgePayload<
  'newsletter',
  NewsletterContent
>;

export type SiteForgePayloadEcommerce = BaseSiteForgePayload<
  'ecommerce',
  EcommerceContent
>;

export type SiteForgePayloadSocialMedia = BaseSiteForgePayload<
  'social_media',
  SocialMediaContent
>;

export type SiteForgePayloadLandingPage = BaseSiteForgePayload<
  'landing_page',
  LandingPageContent
>;

/**
 * Canonical discriminated union for SiteForge Payload.
 * Narrowing on `payload.siteType` automatically strongly-types `payload.theme.content`.
 */
export type SiteForgePayload =
  | SiteForgePayloadLearningPlatform
  | SiteForgePayloadBlog
  | SiteForgePayloadNewsletter
  | SiteForgePayloadEcommerce
  | SiteForgePayloadSocialMedia
  | SiteForgePayloadLandingPage;

/**
 * Generic payload representation with unconstrained content object.
 */
export type GenericSiteForgePayload = BaseSiteForgePayload<
  SiteType,
  Record<string, unknown>
>;
