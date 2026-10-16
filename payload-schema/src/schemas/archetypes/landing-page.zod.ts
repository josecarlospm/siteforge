import { z } from 'zod';
import { statItemSchema, testimonialItemSchema, faqItemSchema } from './learning-platform.zod.js';

export const heroActionSchema = z.object({
  label: z.string().min(1, 'CTA label is required'),
  href: z.string().min(1, 'CTA href is required'),
});

export const landingHeroSchema = z.object({
  headline: z.string().min(1, 'Hero headline is required'),
  subheadline: z.string().min(1, 'Hero subheadline is required'),
  primaryCta: heroActionSchema,
  secondaryCta: heroActionSchema.optional(),
  mediaUrl: z.string().optional(),
});

export const featureItemSchema = z.object({
  id: z.string().min(1, 'Feature ID is required'),
  title: z.string().min(1, 'Feature title is required'),
  description: z.string().min(1, 'Feature description is required'),
  icon: z.string().optional(),
});

export const pricingPlanSchema = z.object({
  id: z.string().min(1, 'Plan ID is required'),
  name: z.string().min(1, 'Plan name is required'),
  price: z.string().min(1, 'Plan price is required'),
  billingPeriod: z.string().min(1, 'Billing period is required'),
  features: z.array(z.string().min(1)).min(1, 'At least one feature is required'),
  isPopular: z.boolean().optional(),
  ctaLabel: z.string().min(1, 'Plan CTA label is required'),
});

export const landingPageContentSchema = z.object({
  hero: landingHeroSchema,
  features: z.array(featureItemSchema).min(1, 'At least one feature is required'),
  socialProof: z.array(statItemSchema).optional(),
  pricingPlans: z.array(pricingPlanSchema).optional(),
  testimonials: z.array(testimonialItemSchema).optional(),
  faqs: z.array(faqItemSchema).optional(),
  ctaSection: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      buttonLabel: z.string().min(1),
      buttonHref: z.string().optional(),
    })
    .optional(),
});
