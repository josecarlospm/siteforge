import { Component, input, output } from '@angular/core';

@Component({
  selector: 'sf-card',
  template: `
    <article class="card-root">
      <!-- Card Header / Badge -->
      <div class="card-top">
        <div class="card-icon">{{ icon() }}</div>
        @if (badge()) {
          <span class="sf-badge sf-badge-accent">{{ badge() }}</span>
        }
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <h3 class="card-title">{{ title() }}</h3>
        @if (subtitle()) {
          <p class="card-subtitle">{{ subtitle() }}</p>
        }
        @if (summary()) {
          <p class="card-summary">{{ summary() }}</p>
        }
      </div>

      <!-- Card Metadata (Rating, students, duration) -->
      @if (rating() !== undefined || meta()) {
        <div class="card-meta">
          @if (rating() !== undefined) {
            <span class="meta-rating">★ {{ rating() }}</span>
          }
          @if (meta()) {
            <span class="meta-text">{{ meta() }}</span>
          }
        </div>
      }

      <!-- Projected Content (e.g. Modules list) -->
      <div class="card-content">
        <ng-content />
      </div>

      <!-- Card Footer / Action -->
      <div class="card-footer">
        <button type="button" class="sf-btn sf-btn-primary card-action-btn" (click)="onAction()">
          {{ actionLabel() }}
          <span>→</span>
        </button>
      </div>
    </article>
  `,
  styles: [`
    .card-root {
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      padding: var(--spacing-6);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: var(--spacing-4);
      transition: all var(--transition-normal);
      position: relative;
    }

    .card-root:hover {
      box-shadow: var(--shadow-ambient);
      transform: translateY(-2px);
      border-color: var(--color-primary);
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-icon {
      font-size: var(--text-2xl);
      line-height: 1;
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
      flex: 1;
    }

    .card-title {
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--color-text-main);
      line-height: var(--line-height-tight);
    }

    .card-subtitle {
      font-size: var(--text-xs);
      color: var(--color-primary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .card-summary {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      line-height: var(--line-height-normal);
    }

    .card-meta {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding-top: var(--spacing-2);
      border-top: var(--border-width) solid var(--color-border);
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .meta-rating {
      font-weight: 700;
      color: var(--color-accent);
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .card-footer {
      margin-top: var(--spacing-2);
    }

    .card-action-btn {
      width: 100%;
    }
  `],
})
export class CardComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly summary = input<string>('');
  readonly badge = input<string>('');
  readonly icon = input<string>('🌿');
  readonly meta = input<string>('');
  readonly rating = input<number | undefined>(undefined);
  readonly studentsCount = input<number | undefined>(undefined);
  readonly actionLabel = input<string>('Enroll Now');

  readonly action = output<void>();

  onAction(): void {
    this.action.emit();
  }
}
