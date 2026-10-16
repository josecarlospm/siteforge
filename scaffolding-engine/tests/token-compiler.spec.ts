import { describe, it, expect } from 'vitest';
import { TokenCompiler } from '../src/compiler/token-compiler.js';
import { PRESET_REGISTRY, DesignPresetName } from '../src/presets/design-presets.js';

describe('TokenCompiler', () => {
  it('should compile warm-organic (Greenhouse Lab) preset to CSS variables', () => {
    const css = TokenCompiler.compilePresetToCss('warm-organic');
    expect(css).toContain('--color-bg: #E7EEEA;');
    expect(css).toContain('--color-primary: #145C45;');
    expect(css).toContain('--color-accent: #1A5F7A;');
    expect(css).toContain('--radius-card: 8px;');
    expect(css).toContain('--radius-btn: 6px;');
    expect(css).toContain('--font-heading:');
    expect(css).not.toContain('#F7F5F0');
    expect(css).not.toContain('#C86D51');
    expect(css).not.toContain('Fraunces');
  });

  it('should compile neo-brutalist preset with hard borders and teal secondary', () => {
    const css = TokenCompiler.compilePresetToCss('neo-brutalist');
    expect(css).toContain('--border-width: 3px;');
    expect(css).toContain('--radius-card: 0px;');
    expect(css).toContain('--shadow-card: 4px 4px 0px #000000;');
    expect(css).toContain('--color-primary: #FFE600;');
    expect(css).toContain('--color-secondary: #00C2A8;');
    expect(css).not.toContain('#6C5CE7');
  });

  it('should compile modern-saas-dark (Forge Night) without indigo glow', () => {
    const css = TokenCompiler.compilePresetToCss('modern-saas-dark');
    expect(css).toContain('--color-bg: #0E1116;');
    expect(css).toContain('--color-primary: #E07A3D;');
    expect(css).toContain('--radius-card: 6px;');
    expect(css).not.toContain('#6366F1');
    expect(css).not.toContain('#8B5CF6');
  });

  it('should apply custom branding color overrides', () => {
    const css = TokenCompiler.compilePresetToCss('warm-organic', {
      primaryColor: '#123456',
      secondaryColor: '#abcdef',
      fontHeading: 'CustomSerif',
    });
    expect(css).toContain('--color-primary: #123456;');
    expect(css).toContain('--color-secondary: #abcdef;');
    expect(css).toContain("'CustomSerif'");
  });

  it('should compile all 5 presets into a unified stylesheet', () => {
    const allCss = TokenCompiler.compileAllPresets();
    const presets: DesignPresetName[] = [
      'warm-organic',
      'neo-brutalist',
      'clean-editorial',
      'modern-saas-dark',
      'corporate-enterprise',
    ];
    for (const preset of presets) {
      expect(allCss).toContain(`data-theme="${preset}"`);
      expect(PRESET_REGISTRY[preset]).toBeDefined();
    }
  });

  it('should expose reinvented display names from Design.md', () => {
    expect(PRESET_REGISTRY['warm-organic'].displayName).toBe('Greenhouse Lab');
    expect(PRESET_REGISTRY['modern-saas-dark'].displayName).toBe('Forge Night');
    expect(PRESET_REGISTRY['clean-editorial'].displayName).toBe('Gallery Press');
    expect(PRESET_REGISTRY['corporate-enterprise'].displayName).toBe('Ledger');
    expect(PRESET_REGISTRY['neo-brutalist'].displayName).toBe('Signal Block');
  });
});
