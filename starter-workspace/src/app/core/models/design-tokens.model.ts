export type DesignPresetName =
  | 'warm-organic'
  | 'neo-brutalist'
  | 'clean-editorial'
  | 'modern-saas-dark'
  | 'corporate-enterprise';

export interface DesignTokens {
  name: DesignPresetName;
  displayName: string;
  description: string;
  colors: {
    bg: string;
    surface: string;
    surfaceMuted: string;
    textMain: string;
    textMuted: string;
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    accent: string;
    accentHover: string;
    border: string;
  };
  typography: {
    fontHeading: string;
    fontBody: string;
    fontMono: string;
  };
  shape: {
    borderWidth: string;
    radiusCard: string;
    radiusBtn: string;
    radiusPill: string;
  };
  elevation: {
    shadowCard: string;
    shadowAmbient: string;
    shadowButton: string;
  };
}

export const DESIGN_PRESETS: Record<DesignPresetName, DesignTokens> = {
  'warm-organic': {
    name: 'warm-organic',
    displayName: 'Warm Organic',
    description: 'Natural earthy tones, rounded pill containers, tailored for wellness & botanicals',
    colors: {
      bg: '#F7F5F0',
      surface: '#FFFFFF',
      surfaceMuted: '#EFECE6',
      textMain: '#1E281E',
      textMuted: '#556B55',
      primary: '#2D5A27',
      primaryHover: '#22451E',
      secondary: '#8FBC8F',
      secondaryHover: '#7DAA7D',
      accent: '#C86D51',
      accentHover: '#B55C41',
      border: '#E5E0D8',
    },
    typography: {
      fontHeading: "'Fraunces', Georgia, serif",
      fontBody: "'Plus Jakarta Sans', system-ui, sans-serif",
      fontMono: 'ui-monospace, monospace',
    },
    shape: {
      borderWidth: '1px',
      radiusCard: '16px',
      radiusBtn: '9999px',
      radiusPill: '9999px',
    },
    elevation: {
      shadowCard: '0 10px 30px -10px rgba(45, 90, 39, 0.08)',
      shadowAmbient: '0 4px 20px rgba(45, 90, 39, 0.04)',
      shadowButton: '0 4px 14px rgba(45, 90, 39, 0.18)',
    },
  },
  'neo-brutalist': {
    name: 'neo-brutalist',
    displayName: 'Neo-Brutalist',
    description: 'High contrast solid 3px borders, hard drop shadows, punchy primary accents',
    colors: {
      bg: '#FFFDF8',
      surface: '#FFFFFF',
      surfaceMuted: '#FFF0A8',
      textMain: '#000000',
      textMuted: '#333333',
      primary: '#FFE600',
      primaryHover: '#FFD000',
      secondary: '#6C5CE7',
      secondaryHover: '#5844D8',
      accent: '#FF5C00',
      accentHover: '#E05200',
      border: '#000000',
    },
    typography: {
      fontHeading: "'Space Grotesk', system-ui, sans-serif",
      fontBody: "'Space Grotesk', system-ui, sans-serif",
      fontMono: "'JetBrains Mono', monospace",
    },
    shape: {
      borderWidth: '3px',
      radiusCard: '0px',
      radiusBtn: '0px',
      radiusPill: '0px',
    },
    elevation: {
      shadowCard: '4px 4px 0px #000000',
      shadowAmbient: '6px 6px 0px #000000',
      shadowButton: '3px 3px 0px #000000',
    },
  },
  'clean-editorial': {
    name: 'clean-editorial',
    displayName: 'Clean Editorial',
    description: 'Editorial serif headings, generous whitespace, understated publication luxury',
    colors: {
      bg: '#FAF8F5',
      surface: '#FFFFFF',
      surfaceMuted: '#F3EFEA',
      textMain: '#1C1917',
      textMuted: '#57534E',
      primary: '#7F1D1D',
      primaryHover: '#601414',
      secondary: '#B45309',
      secondaryHover: '#92400E',
      accent: '#14532D',
      accentHover: '#0F3E22',
      border: '#E7E5E4',
    },
    typography: {
      fontHeading: "'Playfair Display', Georgia, serif",
      fontBody: "'Inter', -apple-system, sans-serif",
      fontMono: 'ui-monospace, monospace',
    },
    shape: {
      borderWidth: '1px',
      radiusCard: '6px',
      radiusBtn: '4px',
      radiusPill: '9999px',
    },
    elevation: {
      shadowCard: '0 4px 20px rgba(0, 0, 0, 0.04)',
      shadowAmbient: '0 2px 10px rgba(0, 0, 0, 0.02)',
      shadowButton: '0 2px 6px rgba(127, 29, 29, 0.12)',
    },
  },
  'modern-saas-dark': {
    name: 'modern-saas-dark',
    displayName: 'Modern SaaS Dark',
    description: 'Deep zinc slate canvas, neon indigo/cyan glow accents, glassmorphic cards',
    colors: {
      bg: '#09090B',
      surface: '#18181B',
      surfaceMuted: '#27272A',
      textMain: '#FAFAFA',
      textMuted: '#A1A1AA',
      primary: '#6366F1',
      primaryHover: '#4F46E5',
      secondary: '#8B5CF6',
      secondaryHover: '#7C3AED',
      accent: '#06B6D4',
      accentHover: '#0891B2',
      border: 'rgba(255, 255, 255, 0.12)',
    },
    typography: {
      fontHeading: "'Plus Jakarta Sans', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",
      fontMono: "'JetBrains Mono', monospace",
    },
    shape: {
      borderWidth: '1px',
      radiusCard: '12px',
      radiusBtn: '8px',
      radiusPill: '9999px',
    },
    elevation: {
      shadowCard: '0 8px 32px rgba(0, 0, 0, 0.45)',
      shadowAmbient: '0 4px 24px rgba(99, 102, 241, 0.12)',
      shadowButton: '0 4px 16px rgba(99, 102, 241, 0.35)',
    },
  },
  'corporate-enterprise': {
    name: 'corporate-enterprise',
    displayName: 'Corporate Enterprise',
    description: 'Clean navy/slate palettes, structured data cards, corporate reliability',
    colors: {
      bg: '#FFFFFF',
      surface: '#F8FAFC',
      surfaceMuted: '#F1F5F9',
      textMain: '#0F172A',
      textMuted: '#475569',
      primary: '#2563EB',
      primaryHover: '#1D4ED8',
      secondary: '#64748B',
      secondaryHover: '#475569',
      accent: '#0284C7',
      accentHover: '#0369A1',
      border: '#E2E8F0',
    },
    typography: {
      fontHeading: "'Inter', system-ui, -apple-system, sans-serif",
      fontBody: "'Inter', system-ui, -apple-system, sans-serif",
      fontMono: 'ui-monospace, monospace',
    },
    shape: {
      borderWidth: '1px',
      radiusCard: '8px',
      radiusBtn: '6px',
      radiusPill: '9999px',
    },
    elevation: {
      shadowCard: '0 4px 12px rgba(15, 23, 42, 0.06)',
      shadowAmbient: '0 1px 3px rgba(15, 23, 42, 0.05)',
      shadowButton: '0 2px 4px rgba(37, 99, 235, 0.2)',
    },
  },
};
