/**
 * SiteForge Design Token & Preset Definitions
 * Aligned with Design.md specifications.
 */

export const DESIGN_PRESETS = [
  'neo-brutalist',
  'clean-editorial',
  'modern-saas-dark',
  'warm-organic',
  'corporate-enterprise',
] as const;

export type DesignPreset = (typeof DESIGN_PRESETS)[number];

export interface ColorTokensOverride {
  bg?: string;
  surface?: string;
  surfaceMuted?: string;
  textMain?: string;
  textMuted?: string;
  primary?: string;
  primaryHover?: string;
  accent?: string;
  border?: string;
}

export interface TypographyTokensOverride {
  fontHeading?: string;
  fontBody?: string;
  fontMono?: string;
}

export interface RadiiTokensOverride {
  radiusSm?: string;
  radiusMd?: string;
  radiusLg?: string;
  radiusPill?: string;
}

export interface ShadowTokensOverride {
  shadowCard?: string;
  shadowAmbient?: string;
}

export interface DesignTokensOverride {
  colors?: ColorTokensOverride;
  typography?: TypographyTokensOverride;
  radii?: RadiiTokensOverride;
  shadows?: ShadowTokensOverride;
}
