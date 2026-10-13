import { Injectable, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  DesignPresetName,
  DesignTokens,
  DESIGN_PRESETS,
} from '../models/design-tokens.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  /** Active preset signal */
  readonly currentPreset = signal<DesignPresetName>('warm-organic');

  /** Computed tokens derived reactively from active preset */
  readonly currentTokens = computed<DesignTokens>(() => {
    const preset = this.currentPreset();
    return DESIGN_PRESETS[preset] ?? DESIGN_PRESETS['warm-organic'];
  });

  /** List of all supported presets for UI selectors */
  readonly allPresets = signal<DesignTokens[]>(Object.values(DESIGN_PRESETS));

  constructor() {
    this.applyTheme(this.currentPreset());
  }

  /**
   * Switch the active Design.md preset dynamically
   */
  setPreset(preset: DesignPresetName): void {
    if (DESIGN_PRESETS[preset]) {
      this.currentPreset.set(preset);
      this.applyTheme(preset);
    }
  }

  /**
   * Apply CSS custom property overrides to root element
   */
  applyCustomColorOverrides(primary?: string, secondary?: string): void {
    const root = this.document.documentElement;
    if (primary) {
      root.style.setProperty('--color-primary', primary);
      root.style.setProperty('--color-primary-hover', primary);
    }
    if (secondary) {
      root.style.setProperty('--color-secondary', secondary);
    }
  }

  private applyTheme(preset: DesignPresetName): void {
    if (this.document?.documentElement) {
      this.document.documentElement.setAttribute('data-theme', preset);
    }
  }
}
