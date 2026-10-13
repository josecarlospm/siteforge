import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'sf-footer',
  template: `
    <footer class="footer-root">
      <div class="sf-container footer-inner">
        <!-- Brand & Description -->
        <div class="footer-brand">
          <div class="brand-row">
            <span class="brand-icon">🌿</span>
            <span class="brand-title">{{ brandName() }}</span>
          </div>
          <p class="brand-desc">{{ description() }}</p>
          <div class="brand-sub">
            SiteForge Autonomous Web Factory • Built with Angular 19+ Standalone Architecture
          </div>
        </div>

        <!-- Newsletter Signup -->
        <div class="footer-newsletter">
          <h4 class="newsletter-title">Subscribe to Botanical Dispatch</h4>
          <p class="newsletter-subtitle">
            Seasonal watering charts, pest alerts, and lighting reminders sent every Sunday.
          </p>

          @if (subscribed()) {
            <div class="newsletter-success">
              ✓ Subscribed! Welcome to the PlantCare botanical community.
            </div>
          } @else {
            <form class="newsletter-form" (submit)="onSubmit($event)">
              <input
                type="email"
                class="newsletter-input"
                placeholder="Enter your email address"
                [value]="emailInput()"
                (input)="onEmailChange($event)"
                required
              />
              <button type="submit" class="sf-btn sf-btn-primary newsletter-btn">
                Subscribe
              </button>
            </form>
          }
        </div>
      </div>

      <div class="footer-bottom">
        <div class="sf-container bottom-inner">
          <span>© 2026 {{ brandName() }}. All rights reserved.</span>
          <div class="bottom-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#mcp">Angular CLI MCP Powered</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-root {
      background-color: var(--color-surface);
      border-top: var(--border-width) solid var(--color-border);
      padding: var(--spacing-16) 0 0;
      margin-top: var(--spacing-16);
      transition: background-color var(--transition-normal);
    }

    .footer-inner {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: var(--spacing-12);
      padding-bottom: var(--spacing-12);
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .brand-icon {
      font-size: var(--text-2xl);
    }

    .brand-title {
      font-family: var(--font-heading);
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--color-primary);
    }

    .brand-desc {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      max-width: 480px;
      line-height: var(--line-height-relaxed);
    }

    .brand-sub {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      opacity: 0.8;
      margin-top: var(--spacing-2);
    }

    .footer-newsletter {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .newsletter-title {
      font-size: var(--text-base);
      font-weight: 700;
      color: var(--color-text-main);
    }

    .newsletter-subtitle {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      line-height: var(--line-height-normal);
    }

    .newsletter-form {
      display: flex;
      gap: var(--spacing-2);
      margin-top: var(--spacing-2);
    }

    .newsletter-input {
      flex: 1;
      padding: var(--spacing-3) var(--spacing-4);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-btn);
      background-color: var(--color-surface-muted);
      color: var(--color-text-main);
      font-family: var(--font-body);
      font-size: var(--text-sm);
      outline: none;
    }

    .newsletter-input:focus {
      border-color: var(--color-primary);
    }

    .newsletter-btn {
      white-space: nowrap;
    }

    .newsletter-success {
      padding: var(--spacing-3) var(--spacing-4);
      background-color: var(--color-surface-muted);
      border: var(--border-width) solid var(--color-primary);
      border-radius: var(--radius-btn);
      color: var(--color-primary);
      font-size: var(--text-xs);
      font-weight: 700;
    }

    .footer-bottom {
      border-top: var(--border-width) solid var(--color-border);
      padding: var(--spacing-6) 0;
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .bottom-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .bottom-links {
      display: flex;
      gap: var(--spacing-4);
    }

    @media (max-width: 768px) {
      .footer-inner {
        grid-template-columns: 1fr;
      }
      .bottom-inner {
        flex-direction: column;
        gap: var(--spacing-4);
      }
    }
  `],
})
export class FooterComponent {
  readonly brandName = input.required<string>();
  readonly description = input<string>('');

  readonly newsletterSubmit = output<string>();

  readonly emailInput = signal<string>('');
  readonly subscribed = signal<boolean>(false);

  onEmailChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.emailInput.set(target.value);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const email = this.emailInput().trim();
    if (email) {
      this.newsletterSubmit.emit(email);
      this.subscribed.set(true);
    }
  }
}
