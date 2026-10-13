import { Component, input, output, model, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { DesignPresetName } from '../../core/models/design-tokens.model';

@Component({
  selector: 'sf-header',
  template: `
    <header class="header-container">
      <div class="sf-container header-inner">
        <!-- Branding -->
        <div class="brand-section">
          <div class="brand-logo">🌿</div>
          <div class="brand-text">
            <span class="brand-name">{{ brandName() }}</span>
            @if (tagline()) {
              <span class="brand-tagline">{{ tagline() }}</span>
            }
          </div>
        </div>

        <!-- Search Bar -->
        <div class="search-section">
          <input
            type="search"
            class="search-input"
            placeholder="Search lessons, plants, care guides..."
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
          />
        </div>

        <!-- Theme Presets Switcher & Navigation -->
        <div class="actions-section">
          <div class="preset-selector-wrapper">
            <label for="preset-select" class="preset-label">Theme Preset:</label>
            <select
              id="preset-select"
              class="preset-select"
              [value]="themeService.currentPreset()"
              (change)="onPresetChange($event)"
            >
              @for (preset of themeService.allPresets(); track preset.name) {
                <option [value]="preset.name">{{ preset.displayName }}</option>
              }
            </select>
          </div>

          <a href="#catalog" class="sf-btn sf-btn-primary nav-cta">Start Learning</a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      background-color: var(--color-surface);
      border-bottom: var(--border-width) solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(var(--backdrop-blur));
      transition: background-color var(--transition-normal);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-6);
      height: 72px;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .brand-logo {
      font-size: var(--text-2xl);
      line-height: 1;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: var(--text-lg);
      color: var(--color-primary);
    }

    .brand-tagline {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .search-section {
      flex: 1;
      max-width: 420px;
    }

    .search-input {
      width: 100%;
      padding: var(--spacing-2) var(--spacing-4);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-pill);
      background-color: var(--color-surface-muted);
      color: var(--color-text-main);
      font-family: var(--font-body);
      font-size: var(--text-sm);
      outline: none;
      transition: border-color var(--transition-fast);
    }

    .search-input:focus {
      border-color: var(--color-primary);
    }

    .actions-section {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }

    .preset-selector-wrapper {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .preset-label {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      font-weight: 600;
    }

    .preset-select {
      padding: var(--spacing-2) var(--spacing-3);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-btn);
      background-color: var(--color-surface);
      color: var(--color-text-main);
      font-family: var(--font-body);
      font-size: var(--text-xs);
      font-weight: 600;
      cursor: pointer;
      outline: none;
    }

    .nav-cta {
      padding: var(--spacing-2) var(--spacing-4);
    }

    @media (max-width: 768px) {
      .search-section, .preset-label {
        display: none;
      }
    }
  `],
})
export class HeaderComponent {
  readonly themeService = inject(ThemeService);

  readonly brandName = input.required<string>();
  readonly tagline = input<string>('');
  readonly searchQuery = model<string>('');

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  onPresetChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.themeService.setPreset(target.value as DesignPresetName);
  }
}
