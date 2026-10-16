import { z } from 'zod';
import { testimonialItemSchema } from './learning-platform.zod.js';

export const productItemSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  slug: z
    .string()
    .min(1, 'Product slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and hyphens'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  compareAtPrice: z.number().min(0).optional(),
  collection: z.string().min(1, 'Collection name is required'),
  rating: z.number().min(1).max(5).optional(),
  reviewsCount: z.number().int().min(0).optional(),
  badge: z.string().optional(),
  description: z.string().min(1, 'Product description is required'),
  features: z.array(z.string().min(1)).optional(),
  inStock: z.boolean().default(true),
  images: z.array(z.string().min(1)).min(1, 'At least one product image is required'),
  sku: z.string().optional(),
});

export const shippingHighlightSchema = z.object({
  title: z.string().min(1, 'Shipping highlight title is required'),
  description: z.string().min(1, 'Shipping highlight description is required'),
  icon: z.string().optional(),
});

export const promotionalBannerSchema = z.object({
  headline: z.string().min(1, 'Banner headline is required'),
  code: z.string().optional(),
  discount: z.string().optional(),
});

export const ecommerceContentSchema = z.object({
  currency: z.string().length(3, 'Currency must be a 3-letter ISO code (e.g. USD, EUR)'),
  currencySymbol: z.string().min(1).max(5).optional(),
  collections: z.array(z.string().min(1)).min(1, 'At least one collection is required'),
  products: z.array(productItemSchema).min(1, 'At least one product is required'),
  shippingHighlights: z.array(shippingHighlightSchema).optional(),
  promotionalBanner: promotionalBannerSchema.optional(),
  reviews: z.array(testimonialItemSchema).optional(),
});
