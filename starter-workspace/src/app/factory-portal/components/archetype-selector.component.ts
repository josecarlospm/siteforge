import { Component, inject } from '@angular/core';
import { FactoryStateService } from '../services/factory-state.service';
import { ARCHETYPES, FactorySiteType } from '../models/factory.model';

@Component({
  selector: 'sf-archetype-selector',
  template: `
    <section class="archetype-section" aria-labelledby="archetype-heading">
      <div class="section-header">
        <div>
          <p class="section-kicker">01 · Payload</p>
          <h2 class="section-title" id="archetype-heading">Website archetype</h2>
        </div>
        <p class="section-subtitle">
          Maps to API <code>siteType</code>
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
    }
    .section-subtitle code {
      font-family: var(--font-mono);
      font-size: 0.8em;
      color: var(--color-accent);
    }
    .archetype-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }
    @media (max-width: 900px) {
      .archetype-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 520px) {
      .archetype-row { grid-template-columns: 1fr; }
    }
    .archetype-option {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      min-height: 108px;
      padding: 14px 14px 16px;
      text-align: left;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      color: var(--color-text-main);
      cursor: pointer;
      transition: border-color 140ms ease, background-color 140ms ease;
    }
    .archetype-option:hover {
      border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
    }
    .archetype-option:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
    .archetype-option.selected {
      border-color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface));
      box-shadow: inset 3px 0 0 var(--color-primary);
    }
    .arch-title {
      font-weight: 650;
      font-size: 0.875rem;
      letter-spacing: -0.01em;
    }
    .arch-api {
      font-family: var(--font-mono);
      font-size: 0.6rem;
      color: var(--color-accent);
    }
    .arch-desc {
      font-size: 0.72rem;
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
