import { describe, it, expect } from 'vitest';
import { TokenCompiler } from '../src/compiler/token-compiler.js';
import { PRESET_REGISTRY, DesignPresetName } from '../src/presets/design-presets.js';

describe('TokenCompiler', () => {
  it('should compile warm-organic preset to CSS variables', () => {
    const css = TokenCompiler.compilePresetToCss('warm-organic');
    expect(css).toContain('--color-bg: #F7F5F0;');
    expect(css).toContain('--color-primary: #2D5A27;');
    expect(css).toContain('--radius-card: 16px;');
    expect(css).toContain('--font-heading:');
  });

  it('should compile neo-brutalist preset with hard borders and shadows', () => {
    const css = TokenCompiler.compilePresetToCss('neo-brutalist');
    expect(css).toContain('--border-width: 3px;');
    expect(css).toContain('--radius-card: 0px;');
    expect(css).toContain('--shadow-card: 4px 4px 0px #000000;');
    expect(css).toContain('--color-primary: #FFE600;');
  });

  it('should compile modern-saas-dark with zinc canvas and border glow', () => {
    const css = TokenCompiler.compilePresetToCss('modern-saas-dark');
    expect(css).toContain('--color-bg: #09090B;');
    expect(css).toContain('--color-primary: #6366F1;');
    expect(css).toContain('--radius-card: 12px;');
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
    }
  });
});
