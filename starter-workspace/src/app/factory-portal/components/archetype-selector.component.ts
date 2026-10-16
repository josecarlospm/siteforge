import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryStateService } from '../services/factory-state.service';
import { ARCHETYPES, FactorySiteType } from '../models/factory.model';

@Component({
  selector: 'sf-archetype-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="archetype-section">
      <div class="section-header">
        <h3 class="section-title">1. Website Archetype</h3>
        <span class="section-subtitle">Select from 6 production-grade web application architectures</span>
      </div>

      <div class="archetype-grid">
        @for (arch of archetypes; track arch.type) {
          <div
            class="archetype-card"
            [class.selected]="selectedType() === arch.type"
            (click)="selectType(arch.type)"
          >
            <div class="card-top">
              <span class="arch-icon">{{ arch.icon }}</span>
              <span class="sf-badge" [class.sf-badge-primary]="selectedType() === arch.type">
                {{ arch.badge }}
              </span>
            </div>

            <h4 class="arch-title">{{ arch.title }}</h4>
            <p class="arch-desc">{{ arch.description }}</p>

            <ul class="arch-features">
              @for (feat of arch.features; track feat) {
                <li><span class="check">✓</span> {{ feat }}</li>
              }
            </ul>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .archetype-section {
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
    .archetype-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--spacing-4, 16px);
    }
    .archetype-card {
      background: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      padding: var(--spacing-5, 20px);
      cursor: pointer;
      transition: all var(--transition-fast, 150ms ease);
      display: flex;
      flex-direction: column;
    }
    .archetype-card:hover {
      border-color: var(--color-primary);
      transform: translateY(-2px);
      box-shadow: var(--shadow-card);
    }
    .archetype-card.selected {
      border-color: var(--color-primary);
      background-color: var(--color-surface);
      box-shadow: 0 0 0 2px var(--color-primary), var(--shadow-card);
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-3, 12px);
    }
    .arch-icon {
      font-size: 1.75rem;
    }
    .arch-title {
      font-size: var(--text-base, 1rem);
      font-weight: 700;
      margin-bottom: var(--spacing-2, 8px);
      color: var(--color-text-main);
    }
    .arch-desc {
      font-size: var(--text-xs, 0.75rem);
      color: var(--color-text-muted);
      line-height: 1.4;
      margin-bottom: var(--spacing-4, 16px);
      flex: 1;
    }
    .arch-features {
      list-style: none;
      padding: 0;
      margin: 0;
      border-top: 1px dashed var(--color-border);
      padding-top: var(--spacing-3, 12px);
    }
    .arch-features li {
      font-size: var(--text-xs, 0.75rem);
      color: var(--color-text-muted);
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .check {
      color: var(--color-primary);
      font-weight: 700;
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
