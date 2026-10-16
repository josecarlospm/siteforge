import { Component, inject } from '@angular/core';
import { FactoryStateService } from '../services/factory-state.service';
import { DesignPresetName, DESIGN_PRESETS } from '../../core/models/design-tokens.model';

@Component({
  selector: 'sf-preset-selector',
  template: `
    <section class="preset-section" aria-labelledby="preset-heading">
      <div class="section-header">
        <h2 class="section-title" id="preset-heading">Design preset</h2>
        <p class="section-subtitle">
          Live previews mapped to API <code>designPreset</code> values from Design.md
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
            >
              <div
                class="preview-nav"
                [style.background]="preset.colors.surface"
                [style.border-bottom-color]="preset.colors.border"
              >
                <span
                  class="preview-mark"
                  [style.background]="preset.colors.primary"
                  [style.border-radius]="preset.shape.radiusBtn"
                ></span>
                <span
                  class="preview-line"
                  [style.background]="preset.colors.textMuted"
                ></span>
              </div>
              <div class="preview-body">
                <span
                  class="preview-title"
                  [style.color]="preset.colors.textMain"
                  [style.font-family]="preset.typography.fontHeading"
                >
                  Aa
                </span>
                <span
                  class="preview-cta"
                  [style.background]="preset.colors.primary"
                  [style.color]="preset.name === 'neo-brutalist' ? '#000' : '#fff'"
                  [style.border-radius]="preset.shape.radiusBtn"
                  [style.box-shadow]="preset.elevation.shadowButton"
                ></span>
                <span
                  class="preview-accent"
                  [style.background]="preset.colors.accent"
                ></span>
              </div>
            </div>

            <div class="preset-meta">
              <span class="preset-name">{{ preset.displayName }}</span>
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
      margin-bottom: var(--spacing-5, 20px);
    }
    .section-title {
      font-size: var(--text-xl, 1.25rem);
      font-weight: 600;
      color: var(--color-text-main);
      margin-bottom: var(--spacing-1, 4px);
    }
    .section-subtitle {
      font-size: var(--text-sm, 0.875rem);
      color: var(--color-text-muted);
    }
    .section-subtitle code {
      font-family: var(--font-mono);
      font-size: 0.8em;
      color: var(--color-accent);
    }
    .preset-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--spacing-4, 16px);
    }
    .preset-card {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3, 12px);
      text-align: left;
      padding: 0;
      background: transparent;
      border: none;
      cursor: pointer;
      color: inherit;
      transition: transform var(--transition-fast, 150ms ease);
    }
    .preset-card:hover {
      transform: translateY(-2px);
    }
    .preset-card.selected .preset-preview {
      outline: 2px solid var(--color-primary);
      outline-offset: 3px;
    }
    .preset-preview {
      height: 112px;
      border-style: solid;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .preview-nav {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-bottom: 1px solid;
    }
    .preview-mark {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }
    .preview-line {
      height: 4px;
      width: 40%;
      opacity: 0.45;
      border-radius: 1px;
    }
    .preview-body {
      flex: 1;
      display: flex;
      align-items: flex-end;
      gap: 8px;
      padding: 12px 10px;
    }
    .preview-title {
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1;
      margin-right: auto;
    }
    .preview-cta {
      width: 36px;
      height: 12px;
    }
    .preview-accent {
      width: 8px;
      height: 12px;
      opacity: 0.85;
    }
    .preset-name {
      display: block;
      font-weight: 650;
      font-size: var(--text-sm, 0.875rem);
      color: var(--color-text-main);
    }
    .api-key {
      display: block;
      margin-top: 4px;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--color-accent);
      word-break: break-all;
    }
    .preset-desc {
      margin-top: 6px;
      font-size: var(--text-xs, 0.75rem);
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
