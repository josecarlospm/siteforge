import { Component, inject } from '@angular/core';
import { FactoryStateService } from '../services/factory-state.service';
import { ARCHETYPES, FactorySiteType } from '../models/factory.model';

@Component({
  selector: 'sf-archetype-selector',
  template: `
    <section class="archetype-section" aria-labelledby="archetype-heading">
      <div class="section-header">
        <h2 class="section-title" id="archetype-heading">Website archetype</h2>
        <p class="section-subtitle">
          Maps to API <code>siteType</code> — six supported architectures
        </p>
      </div>

      <div class="archetype-row" role="listbox" aria-label="Website archetypes">
        @for (arch of archetypes; track arch.type) {
          <button
            type="button"
            class="archetype-option"
            role="option"
            [attr.aria-selected]="selectedType() === arch.type"
            [class.selected]="selectedType() === arch.type"
            (click)="selectType(arch.type)"
          >
            <span class="arch-title">{{ arch.title }}</span>
            <code class="arch-api">{{ arch.label }}</code>
            <span class="arch-desc">{{ arch.description }}</span>
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
    .archetype-row {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: var(--spacing-3, 12px);
    }
    .archetype-option {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      padding: var(--spacing-4, 16px);
      text-align: left;
      background: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      color: var(--color-text-main);
      cursor: pointer;
      transition: border-color var(--transition-fast), background-color var(--transition-fast);
    }
    .archetype-option:hover {
      border-color: var(--color-secondary);
    }
    .archetype-option.selected {
      border-color: var(--color-primary);
      background: var(--color-surface-muted);
    }
    .arch-title {
      font-weight: 650;
      font-size: var(--text-sm, 0.875rem);
    }
    .arch-api {
      font-family: var(--font-mono);
      font-size: 0.62rem;
      color: var(--color-accent);
    }
    .arch-desc {
      font-size: var(--text-xs, 0.75rem);
      color: var(--color-text-muted);
      line-height: 1.35;
    }
  `],
})
export class ArchetypeSelectorComponent {
  private readonly state = inject(FactoryStateService);
  readonly archetypes = ARCHETYPES;
  readonly selectedType = this.state.siteType;

  selectType(type: FactorySiteType): void {
    this.state.setSiteType(type);
  }
}
