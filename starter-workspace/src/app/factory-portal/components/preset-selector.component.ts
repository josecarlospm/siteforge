import { Component, inject } from '@angular/core';
import { FactoryStateService } from '../services/factory-state.service';
import { DesignPresetName, DESIGN_PRESETS } from '../../core/models/design-tokens.model';

@Component({
  selector: 'sf-preset-selector',
  template: `
    <section class="preset-section" aria-labelledby="preset-heading">
      <div class="section-header">
        <div>
          <p class="section-kicker">02 · Design.md</p>
          <h2 class="section-title" id="preset-heading">Aesthetic preset</h2>
        </div>
        <p class="section-subtitle">
          Live previews mapped to API <code>designPreset</code>
        </p>
      </div>

      <div class="preset-grid" role="listbox" aria-label="Design.md presets">
        @for (preset of presets; track preset.name) {
          <button
            type="button"
            class="preset-card"
            role="option"
            [attr.aria-selected]="selectedPreset() === preset.name"
            [class.selected]="selectedPreset() === preset.name"
            (click)="selectPreset(preset.name)"
          >
            <div
              class="preset-preview"
              [style.background]="preset.colors.bg"
              [style.border-color]="preset.colors.border"
              [style.border-width]="preset.shape.borderWidth"
              [style.border-radius]="preset.shape.radiusCard"
              [style.box-shadow]="preset.elevation.shadowCard"
              [style.font-family]="preset.typography.fontHeading"
            >
              <div
                class="preview-bar"
                [style.background]="preset.colors.surface"
                [style.border-bottom-color]="preset.colors.border"
              >
                <span
                  class="preview-logo"
                  [style.background]="preset.colors.primary"
                  [style.border-radius]="preset.shape.radiusBtn"
                ></span>
                <span class="preview-navline" [style.background]="preset.colors.textMuted"></span>
                <span class="preview-navline short" [style.background]="preset.colors.textMuted"></span>
              </div>
              <div class="preview-hero" [style.background]="preset.colors.surfaceMuted">
                <span class="preview-type" [style.color]="preset.colors.textMain">Aa</span>
                <span
                  class="preview-cta"
                  [style.background]="preset.colors.primary"
                  [style.color]="preset.name === 'neo-brutalist' ? '#000' : '#fff'"
                  [style.border-radius]="preset.shape.radiusBtn"
                  [style.box-shadow]="preset.elevation.shadowButton"
                ></span>
              </div>
              <div class="preview-strip">
                <span [style.background]="preset.colors.primary"></span>
                <span [style.background]="preset.colors.secondary"></span>
                <span [style.background]="preset.colors.accent"></span>
                <span [style.background]="preset.colors.surface"></span>
                <span [style.background]="preset.colors.textMain"></span>
              </div>
            </div>

            <div class="preset-meta">
              <div class="meta-top">
                <span class="preset-name">{{ preset.displayName }}</span>
                @if (selectedPreset() === preset.name) {
                  <span class="selected-mark">Selected</span>
                }
              </div>
              <code class="api-key">designPreset: "{{ preset.name }}"</code>
              <p class="preset-desc">{{ preset.description }}</p>
            </div>
          </button>
        }
      </div>
    </section>
  `,
  styles: [`
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    .section-kicker {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--color-primary);
      margin: 0 0 4px;
      letter-spacing: 0.04em;
    }
    .section-title {
      font-size: 1.2rem;
      font-weight: 650;
      letter-spacing: -0.02em;
      color: var(--color-text-main);
      margin: 0;
    }
    .section-subtitle {
      font-size: 0.85rem;
      color: var(--color-text-muted);
      margin: 0;
      max-width: 28rem;
    }
    .section-subtitle code {
      font-family: var(--font-mono);
      font-size: 0.8em;
      color: var(--color-accent);
    }
    .preset-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 18px;
    }
    .preset-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: left;
      padding: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      color: inherit;
      transition: transform 160ms ease;
    }
    .preset-card:hover { transform: translateY(-3px); }
    .preset-card:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 4px;
    }
    .preset-card.selected .preset-preview {
      outline: 2px solid var(--color-primary);
      outline-offset: 3px;
    }
    .preset-preview {
      height: 148px;
      border-style: solid;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .preview-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 10px;
      border-bottom: 1px solid;
    }
    .preview-logo {
      width: 12px;
      height: 12px;
      flex-shrink: 0;
    }
    .preview-navline {
      height: 3px;
      width: 28%;
      opacity: 0.4;
      border-radius: 1px;
    }
    .preview-navline.short { width: 14%; }
    .preview-hero {
      flex: 1;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 14px 12px;
    }
    .preview-type {
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.04em;
    }
    .preview-cta {
      width: 42px;
      height: 14px;
    }
    .preview-strip {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      height: 8px;
    }
    .preview-strip span { display: block; }
    .meta-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }
    .preset-name {
      font-weight: 650;
      font-size: 0.875rem;
      color: var(--color-text-main);
    }
    .selected-mark {
      font-family: var(--font-mono);
      font-size: 0.62rem;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .api-key {
      display: block;
      margin-top: 4px;
      font-family: var(--font-mono);
      font-size: 0.62rem;
      color: var(--color-accent);
      word-break: break-all;
    }
    .preset-desc {
      margin-top: 6px;
      font-size: 0.72rem;
      color: var(--color-text-muted);
      line-height: 1.4;
    }
  `],
})
export class PresetSelectorComponent {
  private readonly state = inject(FactoryStateService);
  readonly presets = Object.values(DESIGN_PRESETS);
  readonly selectedPreset = this.state.designPreset;

  selectPreset(preset: DesignPresetName): void {
    this.state.setPreset(preset);
  }
}
