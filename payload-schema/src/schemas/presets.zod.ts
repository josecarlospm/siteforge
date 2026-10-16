import { z } from 'zod';
import { DESIGN_PRESETS } from '../types/presets.js';

export const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const hexColorSchema = z
  .string()
  .regex(hexColorRegex, 'Must be a valid hex color code (e.g. #FFF or #2D5A27)');

export const designPresetSchema = z.enum(
  [
    'neo-brutalist',
    'clean-editorial',
    'modern-saas-dark',
    'warm-organic',
    'corporate-enterprise',
  ] as const,
  {
    message: `Invalid designPreset. Must be one of: ${DESIGN_PRESETS.join(', ')}`,
  }
);

export const colorTokensOverrideSchema = z.object({
  bg: hexColorSchema.optional(),
  surface: hexColorSchema.optional(),
  surfaceMuted: hexColorSchema.optional(),
  textMain: hexColorSchema.optional(),
  textMuted: hexColorSchema.optional(),
  primary: hexColorSchema.optional(),
  primaryHover: hexColorSchema.optional(),
  accent: hexColorSchema.optional(),
  border: hexColorSchema.optional(),
}).strict();

export const typographyTokensOverrideSchema = z.object({
  fontHeading: z.string().min(1).optional(),
  fontBody: z.string().min(1).optional(),
  fontMono: z.string().min(1).optional(),
}).strict();

export const radiiTokensOverrideSchema = z.object({
  radiusSm: z.string().min(1).optional(),
  radiusMd: z.string().min(1).optional(),
  radiusLg: z.string().min(1).optional(),
  radiusPill: z.string().min(1).optional(),
}).strict();

export const shadowTokensOverrideSchema = z.object({
  shadowCard: z.string().min(1).optional(),
  shadowAmbient: z.string().min(1).optional(),
}).strict();

export const designTokensOverrideSchema = z.object({
  colors: colorTokensOverrideSchema.optional(),
  typography: typographyTokensOverrideSchema.optional(),
  radii: radiiTokensOverrideSchema.optional(),
  shadows: shadowTokensOverrideSchema.optional(),
}).strict();
