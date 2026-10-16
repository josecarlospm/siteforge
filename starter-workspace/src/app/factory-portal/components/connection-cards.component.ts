import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FactoryStateService } from '../services/factory-state.service';

@Component({
  selector: 'sf-connection-cards',
  imports: [FormsModule],
  template: `
    <section class="integrations-section" aria-labelledby="integrations-heading">
      <div class="section-header">
        <p class="section-kicker">04 · Integrations</p>
        <h2 class="section-title" id="integrations-heading">GitHub & Vercel</h2>
        <p class="section-subtitle">Connect repository and host for continuous deployment</p>
      </div>

      <div class="fields-grid">
        <div class="integration-panel">
          <div class="panel-head">
            <h3 class="service-name">GitHub</h3>
            <span class="status-text">Connected · josecarlospm</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="repoName">Repository name</label>
            <div class="input-prefix-group">
              <span class="input-prefix">github.com/josecarlospm/</span>
              <input
                id="repoName"
                type="text"
                class="form-input"
                [ngModel]="githubRepo()"
                (ngModelChange)="update('githubRepo', $event)"
              />
            </div>
          </div>

          <p class="meta-line">Branch <code>main</code> · Public · Author Jose Carlos Perez</p>
        </div>

        <div class="integration-panel">
          <div class="panel-head">
            <h3 class="service-name">Vercel</h3>
            <span class="status-text">Zero-config Angular</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="projectName">Project target</label>
            <div class="input-prefix-group">
              <input
                id="projectName"
                type="text"
                class="form-input"
                [ngModel]="vercelProject()"
                (ngModelChange)="update('vercelProject', $event)"
              />
              <span class="input-suffix">.vercel.app</span>
            </div>
          </div>

          <p class="meta-line">Build <code>npm run build</code> · Output <code>dist/…/browser</code></p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .section-header {
      margin-bottom: var(--spacing-5, 20px);
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
      margin: 0 0 4px;
    }
    .section-subtitle {
      font-size: var(--text-sm, 0.875rem);
      color: var(--color-text-muted);
    }
    .fields-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-4, 16px);
    }
    @media (max-width: 768px) {
      .fields-grid {
        grid-template-columns: 1fr;
      }
    }
    .integration-panel {
      background: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      padding: var(--spacing-5, 20px);
    }
    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      margin-bottom: var(--spacing-4, 16px);
      padding-bottom: var(--spacing-3, 12px);
      border-bottom: 1px solid var(--color-border);
    }
    .service-name {
      font-size: var(--text-base, 1rem);
      font-weight: 650;
      color: var(--color-text-main);
    }
    .status-text {
      font-size: var(--text-xs, 0.75rem);
      color: var(--color-accent);
      font-family: var(--font-mono);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: var(--spacing-3, 12px);
    }
    .form-label {
      font-size: var(--text-xs, 0.75rem);
      font-weight: 650;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }
    .input-prefix-group {
      display: flex;
      align-items: center;
      background: var(--color-bg);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-btn);
      overflow: hidden;
    }
    .input-prefix, .input-suffix {
      font-size: var(--text-xs, 0.75rem);
      color: var(--color-text-muted);
      padding: 0 10px;
      background: var(--color-surface-muted);
      font-family: var(--font-mono);
      white-space: nowrap;
    }
    .form-input {
      border: none;
      background: transparent;
      padding: var(--spacing-2, 8px) var(--spacing-3, 12px);
      font-size: var(--text-sm, 0.875rem);
      color: var(--color-text-main);
      outline: none;
      width: 100%;
      font-family: var(--font-mono);
    }
    .meta-line {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }
    .meta-line code {
      font-family: var(--font-mono);
      color: var(--color-text-main);
    }
  `],
})
export class ConnectionCardsComponent {
  private readonly state = inject(FactoryStateService);

  readonly githubRepo = this.state.githubRepo;
  readonly vercelProject = this.state.vercelProject;

  update(field: 'githubRepo' | 'vercelProject', val: string): void {
    this.state.updateField(field, val);
  }
}
