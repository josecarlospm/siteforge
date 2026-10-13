import { DesignPresetName, PresetTokens, PRESET_REGISTRY } from '../presets/design-presets.js';

export interface TokenOverrides {
  primaryColor?: string;
  secondaryColor?: string;
  fontHeading?: string;
  fontBody?: string;
}

export class TokenCompiler {
  /**
   * Compiles Design.md preset tokens into CSS Custom Properties
   */
  static compilePresetToCss(
    presetName: DesignPresetName,
    overrides?: TokenOverrides
  ): string {
    const basePreset = PRESET_REGISTRY[presetName] ?? PRESET_REGISTRY['warm-organic'];
    const primary = overrides?.primaryColor ?? basePreset.colors.primary;
    const secondary = overrides?.secondaryColor ?? basePreset.colors.secondary;
    const fontHeading = overrides?.fontHeading
      ? `'${overrides.fontHeading}', Georgia, serif`
      : basePreset.typography.fontHeading;
    const fontBody = overrides?.fontBody
      ? `'${overrides.fontBody}', system-ui, sans-serif`
      : basePreset.typography.fontBody;

    return `/* SiteForge Design.md Compiled Tokens: ${basePreset.displayName} */
:root,
:root[data-theme="${basePreset.name}"] {
  --color-bg: ${basePreset.colors.bg};
  --color-surface: ${basePreset.colors.surface};
  --color-surface-muted: ${basePreset.colors.surfaceMuted};
  --color-text-main: ${basePreset.colors.textMain};
  --color-text-muted: ${basePreset.colors.textMuted};
  --color-primary: ${primary};
  --color-primary-hover: ${basePreset.colors.primaryHover};
  --color-secondary: ${secondary};
  --color-secondary-hover: ${basePreset.colors.secondaryHover};
  --color-accent: ${basePreset.colors.accent};
  --color-accent-hover: ${basePreset.colors.accentHover};
  --color-border: ${basePreset.colors.border};

  --font-heading: ${fontHeading};
  --font-body: ${fontBody};
  --font-mono: ${basePreset.typography.fontMono};

  --border-width: ${basePreset.shape.borderWidth};
  --radius-sm: ${basePreset.shape.radiusSm ?? '4px'};
  --radius-md: ${basePreset.shape.radiusMd ?? '8px'};
  --radius-lg: ${basePreset.shape.radiusLg ?? '16px'};
  --radius-card: ${basePreset.shape.radiusCard};
  --radius-btn: ${basePreset.shape.radiusBtn};
  --radius-pill: ${basePreset.shape.radiusPill};

  --shadow-flat: none;
  --shadow-card: ${basePreset.elevation.shadowCard};
  --shadow-ambient: ${basePreset.elevation.shadowAmbient};
  --shadow-button: ${basePreset.elevation.shadowButton};
  --backdrop-blur: ${basePreset.elevation.backdropBlur};

  /* Standard Spatial Scales */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --container-max-w: 1200px;
}
`;
  }

  /**
   * Compiles all 5 presets into a single multi-theme stylesheet
   */
  static compileAllPresets(): string {
    const presets = Object.keys(PRESET_REGISTRY) as DesignPresetName[];
    return presets.map((name) => this.compilePresetToCss(name)).join('\n');
  }

  /**
   * Get resolved tokens for a preset with overrides
   */
  static getResolvedTokens(
    presetName: DesignPresetName,
    overrides?: TokenOverrides
  ): PresetTokens {
    const base = PRESET_REGISTRY[presetName] ?? PRESET_REGISTRY['warm-organic'];
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: overrides?.primaryColor ?? base.colors.primary,
        secondary: overrides?.secondaryColor ?? base.colors.secondary,
      },
      typography: {
        ...base.typography,
        fontHeading: overrides?.fontHeading ?? base.typography.fontHeading,
        fontBody: overrides?.fontBody ?? base.typography.fontBody,
      },
    };
  }
}
