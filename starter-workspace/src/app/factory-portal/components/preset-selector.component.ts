import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryStateService } from '../services/factory-state.service';
import { ThemeService } from '../../core/services/theme.service';
import { DesignPresetName, DESIGN_PRESETS } from '../../core/models/design-tokens.model';

@Component({
  selector: 'sf-preset-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="preset-section">
      <div class="section-header">
        <h3 class="section-title">2. Design.md Aesthetic Preset</h3>
        <span class="section-subtitle">Real-time design token switching mapped directly to Design.md specification</span>
      </div>

      <div class="preset-grid">
        @for (preset of presets; track preset.name) {
          <div
            class="preset-card"
            [class.selected]="selectedPreset() === preset.name"
            (click)="selectPreset(preset.name)"
          >
            <div class="preset-header">
              <span class="preset-name">{{ preset.displayName }}</span>
              @if (selectedPreset() === preset.name) {
                <span class="sf-badge sf-badge-primary">Active</span>
              }
            </div>

            <p class="preset-desc">{{ preset.description }}</p>

            <!-- Live Color Swatches -->
            <div class="swatches-row">
              <span
                class="swatch"
                [style.background-color]="preset.colors.bg"
                title="Background: {{ preset.colors.bg }}"
              ></span>
              <span
                class="swatch"
                [style.background-color]="preset.colors.surface"
                title="Surface: {{ preset.colors.surface }}"
              ></span>
              <span
                class="swatch"
                [style.background-color]="preset.colors.primary"
                title="Primary: {{ preset.colors.primary }}"
              ></span>
              <span
                class="swatch"
                [style.background-color]="preset.colors.secondary"
                title="Secondary: {{ preset.colors.secondary }}"
              ></span>
              <span
                class="swatch"
                [style.background-color]="preset.colors.accent"
                title="Accent: {{ preset.colors.accent }}"
              ></span>
            </div>

            <div class="preset-meta">
              <span class="meta-item">🔤 {{ preset.typography.fontHeading.split(',')[0].replace(/'/g, '') }}</span>
              <span class="meta-item">📐 Radius {{ preset.shape.radiusCard }}</span>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .preset-section {
      margin-bottom: var(--spacing-8, 32px);
    }
    .section-header {
      margin-bottom: var(--spacing-4, 16px);
    }
    .section-title {
      font-size: var(--text-lg, 1.125rem);
      font-weight: 700;
      color: var(--color-text-main);
    }
    .section-subtitle {
      font-size: var(--text-sm, 0.875rem);
      color: var(--color-text-muted);
    }
    .preset-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: var(--spacing-4, 16px);
    }
    .preset-card {
      background: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      padding: var(--spacing-4, 16px);
      cursor: pointer;
      transition: all var(--transition-fast, 150ms ease);
      display: flex;
      flex-direction: column;
    }
    .preset-card:hover {
      border-color: var(--color-primary);
      transform: translateY(-2px);
    }
    .preset-card.selected {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px var(--color-primary), var(--shadow-card);
    }
    .preset-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-2, 8px);
    }
    .preset-name {
      font-weight: 700;
      font-size: var(--text-sm, 0.875rem);
      color: var(--color-text-main);
    }
    .preset-desc {
      font-size: var(--text-xs, 0.75rem);
      color: var(--color-text-muted);
      line-height: 1.35;
      margin-bottom: var(--spacing-3, 12px);
      flex: 1;
    }
    .swatches-row {
      display: flex;
      gap: 6px;
      margin-bottom: var(--spacing-3, 12px);
    }
    .swatch {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid rgba(0,0,0,0.15);
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    .preset-meta {
      display: flex;
      justify-content: space-between;
      border-top: 1px dashed var(--color-border);
      padding-top: var(--spacing-2, 8px);
      font-size: 0.7rem;
      color: var(--color-text-muted);
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
