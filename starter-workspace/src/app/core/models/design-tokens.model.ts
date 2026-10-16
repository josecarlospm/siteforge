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

/** Angular runtime map — must stay aligned with Design.md / PRESET_REGISTRY. */
export const DESIGN_PRESETS: Record<DesignPresetName, DesignTokens> = {
  'warm-organic': {
    name: 'warm-organic',
    displayName: 'Greenhouse Lab',
    description:
      'Cool limestone + chlorophyll botanical lab — learning platforms, not spa wellness',
    colors: {
      bg: '#E7EEEA',
      surface: '#F5F9F6',
      surfaceMuted: '#D2DDD6',
      textMain: '#0F241C',
      textMuted: '#3D5A4C',
      primary: '#145C45',
      primaryHover: '#0E4634',
      secondary: '#2F8F6B',
      secondaryHover: '#267A5A',
      accent: '#1A5F7A',
      accentHover: '#144A5F',
      border: '#A8BDB2',
    },
    typography: {
      fontHeading: "'Syne', system-ui, sans-serif",
      fontBody: "'DM Sans', system-ui, sans-serif",
      fontMono: "'IBM Plex Mono', ui-monospace, monospace",
    },
    shape: {
      borderWidth: '1px',
      radiusCard: '8px',
      radiusBtn: '6px',
      radiusPill: '9999px',
    },
    elevation: {
      shadowCard: '0 6px 20px rgba(15, 36, 28, 0.08)',
      shadowAmbient: '0 2px 10px rgba(15, 36, 28, 0.05)',
      shadowButton: '0 2px 8px rgba(20, 92, 69, 0.22)',
    },
  },
  'neo-brutalist': {
    name: 'neo-brutalist',
    displayName: 'Signal Block',
    description:
      'Hard ink borders, electric yellow fields, teal secondary — poster energy, no purple',
    colors: {
      bg: '#FFFDF8',
      surface: '#FFFFFF',
      surfaceMuted: '#FFF0A8',
      textMain: '#000000',
      textMuted: '#333333',
      primary: '#FFE600',
      primaryHover: '#FFD000',
      secondary: '#00C2A8',
      secondaryHover: '#00A890',
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
    displayName: 'Gallery Press',
    description:
      'Cool gallery paper, deep ink, vermillion print — literary without broadsheet grids',
    colors: {
      bg: '#EEF0F2',
      surface: '#FFFFFF',
      surfaceMuted: '#E2E6EA',
      textMain: '#121417',
      textMuted: '#4A525C',
      primary: '#1B3A4B',
      primaryHover: '#142C39',
      secondary: '#5C6B73',
      secondaryHover: '#4A575E',
      accent: '#B33A3A',
      accentHover: '#962F2F',
      border: '#D0D5DA',
    },
    typography: {
      fontHeading: "'Literata', Georgia, serif",
      fontBody: "'Source Sans 3', system-ui, sans-serif",
      fontMono: "'IBM Plex Mono', ui-monospace, monospace",
    },
    shape: {
      borderWidth: '1px',
      radiusCard: '2px',
      radiusBtn: '2px',
      radiusPill: '4px',
    },
    elevation: {
      shadowCard: '0 1px 0 rgba(18, 20, 23, 0.06)',
      shadowAmbient: '0 2px 8px rgba(18, 20, 23, 0.04)',
      shadowButton: '0 1px 3px rgba(27, 58, 75, 0.15)',
    },
  },
  'modern-saas-dark': {
    name: 'modern-saas-dark',
    displayName: 'Forge Night',
    description:
      'Graphite chassis, forge-ember controls, brass telemetry — SiteForge portal shell',
    colors: {
      bg: '#0E1116',
      surface: '#171C24',
      surfaceMuted: '#222833',
      textMain: '#F2F0EB',
      textMuted: '#8B93A1',
      primary: '#E07A3D',
      primaryHover: '#C96830',
      secondary: '#5A6A7A',
      secondaryHover: '#4A5866',
      accent: '#C9A227',
      accentHover: '#B08F1F',
      border: 'rgba(255, 255, 255, 0.10)',
    },
    typography: {
      fontHeading: "'IBM Plex Sans', system-ui, sans-serif",
      fontBody: "'IBM Plex Sans', system-ui, sans-serif",
      fontMono: "'IBM Plex Mono', ui-monospace, monospace",
    },
    shape: {
      borderWidth: '1px',
      radiusCard: '6px',
      radiusBtn: '4px',
      radiusPill: '4px',
    },
    elevation: {
      shadowCard: '0 8px 24px rgba(0, 0, 0, 0.50)',
      shadowAmbient: '0 2px 12px rgba(0, 0, 0, 0.35)',
      shadowButton: '0 2px 8px rgba(224, 122, 61, 0.28)',
    },
  },
  'corporate-enterprise': {
    name: 'corporate-enterprise',
    displayName: 'Ledger',
    description:
      'Swiss institutional white, teal authority, brass accent — calm enterprise structure',
    colors: {
      bg: '#FFFFFF',
      surface: '#F4F6F5',
      surfaceMuted: '#E8ECEA',
      textMain: '#0A1628',
      textMuted: '#4A5560',
      primary: '#0D5C63',
      primaryHover: '#0A4A50',
      secondary: '#3D4F5F',
      secondaryHover: '#2F3D4A',
      accent: '#A67C00',
      accentHover: '#8B6800',
      border: '#D5DCE0',
    },
    typography: {
      fontHeading: "'IBM Plex Sans', system-ui, sans-serif",
      fontBody: "'IBM Plex Sans', system-ui, sans-serif",
      fontMono: "'IBM Plex Mono', ui-monospace, monospace",
    },
    shape: {
      borderWidth: '1px',
      radiusCard: '4px',
      radiusBtn: '4px',
      radiusPill: '4px',
    },
    elevation: {
      shadowCard: '0 2px 8px rgba(10, 22, 40, 0.06)',
      shadowAmbient: '0 1px 2px rgba(10, 22, 40, 0.04)',
      shadowButton: '0 1px 3px rgba(13, 92, 99, 0.20)',
    },
  },
};
