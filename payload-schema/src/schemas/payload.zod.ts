import { z } from 'zod';
import { SITE_TYPES } from '../types/archetypes.js';
import { designPresetSchema, designTokensOverrideSchema, hexColorSchema } from './presets.zod.js';
import { integrationsConfigSchema } from './integrations.zod.js';
import { learningPlatformContentSchema } from './archetypes/learning-platform.zod.js';
import { blogContentSchema } from './archetypes/blog.zod.js';
import { newsletterContentSchema } from './archetypes/newsletter.zod.js';
import { ecommerceContentSchema } from './archetypes/ecommerce.zod.js';
import { socialMediaContentSchema } from './archetypes/social-media.zod.js';
import { landingPageContentSchema } from './archetypes/landing-page.zod.js';

export const payloadVersionSchema = z
  .string()
  .regex(/^1\.\d+\.\d+$/, 'Version must follow SemVer 1.x.x (e.g. 1.0.0)');

export const siteTypeSchema = z.enum(
  [
    'learning_platform',
    'blog',
    'newsletter',
    'ecommerce',
    'social_media',
    'landing_page',
  ] as const,
  {
    message: `Invalid siteType. Must be one of: ${SITE_TYPES.join(', ')}`,
  }
);

export const themeBrandingSchema = z.object({
  primaryColor: hexColorSchema.optional(),
  secondaryColor: hexColorSchema.optional(),
  fontHeading: z.string().min(1).optional(),
  fontBody: z.string().min(1).optional(),
  logoUrl: z.string().min(1).optional(),
  faviconUrl: z.string().min(1).optional(),
});

export function createThemeSchema<T extends z.ZodTypeAny>(contentSchema: T) {
  return z.object({
    topic: z
      .string()
      .min(2, 'Theme topic must be at least 2 characters')
      .max(120, 'Theme topic cannot exceed 120 characters'),
    name: z
      .string()
      .min(2, 'Theme name must be at least 2 characters')
      .max(80, 'Theme name cannot exceed 80 characters'),
    tagline: z
      .string()
      .min(5, 'Theme tagline must be at least 5 characters')
      .max(150, 'Theme tagline cannot exceed 150 characters'),
    description: z
      .string()
      .min(10, 'Theme description must be at least 10 characters')
      .max(500, 'Theme description cannot exceed 500 characters'),
    branding: themeBrandingSchema.optional(),
    content: contentSchema,
  });
}

const basePayloadFields = {
  version: payloadVersionSchema,
  designPreset: designPresetSchema,
  designTokens: designTokensOverrideSchema.optional(),
  integrations: integrationsConfigSchema,
  metadata: z.record(z.string(), z.unknown()).optional(),
};

export const siteForgePayloadLearningPlatformSchema = z.object({
  ...basePayloadFields,
  siteType: z.literal('learning_platform'),
  theme: createThemeSchema(learningPlatformContentSchema),
});

export const siteForgePayloadBlogSchema = z.object({
  ...basePayloadFields,
  siteType: z.literal('blog'),
  theme: createThemeSchema(blogContentSchema),
});

export const siteForgePayloadNewsletterSchema = z.object({
  ...basePayloadFields,
  siteType: z.literal('newsletter'),
  theme: createThemeSchema(newsletterContentSchema),
});

export const siteForgePayloadEcommerceSchema = z.object({
  ...basePayloadFields,
  siteType: z.literal('ecommerce'),
  theme: createThemeSchema(ecommerceContentSchema),
});

export const siteForgePayloadSocialMediaSchema = z.object({
  ...basePayloadFields,
  siteType: z.literal('social_media'),
  theme: createThemeSchema(socialMediaContentSchema),
});

export const siteForgePayloadLandingPageSchema = z.object({
  ...basePayloadFields,
  siteType: z.literal('landing_page'),
  theme: createThemeSchema(landingPageContentSchema),
});

/**
 * Strongly typed discriminated union schema for SiteForge payload.
 */
export const siteForgePayloadSchema = z.discriminatedUnion('siteType', [
  siteForgePayloadLearningPlatformSchema,
  siteForgePayloadBlogSchema,
  siteForgePayloadNewsletterSchema,
  siteForgePayloadEcommerceSchema,
  siteForgePayloadSocialMediaSchema,
  siteForgePayloadLandingPageSchema,
]);

/**
 * Generic payload schema allowing arbitrary content object for early pipeline stages.
 */
export const genericSiteForgePayloadSchema = z.object({
  ...basePayloadFields,
  siteType: siteTypeSchema,
  theme: createThemeSchema(z.record(z.string(), z.unknown())),
});
