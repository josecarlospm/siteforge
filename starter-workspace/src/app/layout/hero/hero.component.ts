import { Component, input, output } from '@angular/core';

@Component({
  selector: 'sf-hero',
  template: `
    <section class="hero-container">
      <div class="sf-container hero-inner">
        <div class="hero-content">
          @if (badge()) {
            <div class="hero-badge-wrapper">
              <span class="sf-badge sf-badge-primary">{{ badge() }}</span>
            </div>
          }

          <h1 class="hero-title">{{ title() }}</h1>
          <p class="hero-subtitle">{{ subtitle() }}</p>

          <div class="hero-actions">
            <a [href]="ctaHref()" class="sf-btn sf-btn-primary hero-btn" (click)="onCtaClick()">
              {{ ctaText() }}
              <span>→</span>
            </a>
            @if (secondaryCtaText()) {
              <a [href]="secondaryCtaHref()" class="sf-btn sf-btn-secondary hero-btn">
                {{ secondaryCtaText() }}
              </a>
            }
          </div>

          @if (stats().length > 0) {
            <div class="hero-stats-grid">
              @for (stat of stats(); track stat.label) {
                <div class="stat-card">
                  <div class="stat-value">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
                </div>
              }
            </div>
          }
        </div>

        <div class="hero-visual">
          <div class="visual-card">
            <div class="visual-art">🌱</div>
            <div class="visual-badge">Botanical Precision</div>
            <p class="visual-quote">"Healthy roots, fenestrated foliage, zero rot."</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-container {
      padding: var(--spacing-16) 0 var(--spacing-12);
      background: linear-gradient(
        180deg,
        var(--color-surface-muted) 0%,
        var(--color-bg) 100%
      );
      border-bottom: var(--border-width) solid var(--color-border);
    }

    .hero-inner {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: var(--spacing-12);
      align-items: center;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .hero-badge-wrapper {
      margin-bottom: var(--spacing-2);
    }

    .hero-title {
      font-size: var(--text-4xl);
      font-weight: 800;
      color: var(--color-text-main);
      letter-spacing: -0.02em;
    }

    .hero-subtitle {
      font-size: var(--text-lg);
      color: var(--color-text-muted);
      max-width: 580px;
      line-height: var(--line-height-relaxed);
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      margin-top: var(--spacing-4);
      flex-wrap: wrap;
    }

    .hero-btn {
      font-size: var(--text-base);
      padding: var(--spacing-3) var(--spacing-8);
    }

    .hero-stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-6);
      margin-top: var(--spacing-8);
      padding-top: var(--spacing-6);
      border-top: var(--border-width) solid var(--color-border);
    }

    .stat-card {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .stat-value {
      font-family: var(--font-heading);
      font-size: var(--text-2xl);
      font-weight: 800;
      color: var(--color-primary);
    }

    .stat-label {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    .hero-visual {
      display: flex;
      justify-content: center;
    }

    .visual-card {
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      padding: var(--spacing-8);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--spacing-4);
      max-width: 340px;
      width: 100%;
      transform: rotate(-1deg);
      transition: transform var(--transition-normal);
    }

    .visual-card:hover {
      transform: rotate(0deg) scale(1.02);
    }

    .visual-art {
      font-size: 5rem;
      line-height: 1;
    }

    .visual-badge {
      font-family: var(--font-heading);
      font-weight: 700;
      color: var(--color-primary);
      font-size: var(--text-base);
    }

    .visual-quote {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      font-style: italic;
    }

    @media (max-width: 900px) {
      .hero-inner {
        grid-template-columns: 1fr;
      }
      .hero-visual {
        order: -1;
      }
    }
  `],
})
export class HeroComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly badge = input<string>('');
  readonly ctaText = input<string>('Explore Courses');
  readonly ctaHref = input<string>('#catalog');
  readonly secondaryCtaText = input<string>('Care Calculator');
  readonly secondaryCtaHref = input<string>('#calculator');
  readonly stats = input<{ value: string; label: string }[]>([]);

  readonly ctaClick = output<void>();

  onCtaClick(): void {
    this.ctaClick.emit();
  }
}
