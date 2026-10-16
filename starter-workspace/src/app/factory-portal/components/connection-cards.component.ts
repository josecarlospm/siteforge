import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactoryStateService } from '../services/factory-state.service';

@Component({
  selector: 'sf-connection-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="integrations-section">
      <div class="section-header">
        <h3 class="section-title">4. Cloud Integrations & Git Deployment</h3>
        <span class="section-subtitle">Connect your repository and host for zero-touch continuous deployment</span>
      </div>

      <div class="cards-grid">
        <!-- GitHub Connection Card -->
        <div class="integration-card">
          <div class="card-header">
            <div class="service-brand">
              <span class="service-icon">🐙</span>
              <div>
                <h4 class="service-name">GitHub Integration</h4>
                <span class="service-auth">Account: <strong>josecarlospm</strong></span>
              </div>
            </div>
            <span class="sf-badge sf-badge-primary">● Active</span>
          </div>

          <div class="card-body">
            <div class="form-group">
              <label class="form-label" for="repoName">Repository Name</label>
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

            <div class="integration-meta">
              <span>Branch: <code>main</code></span>
              <span>Author: <code>Jose Carlos Perez &lt;jos3k4&#64;gmail.com&gt;</code></span>
              <span>Visibility: <strong>Public</strong></span>
            </div>
          </div>
        </div>

        <!-- Vercel Deployment Card -->
        <div class="integration-card">
          <div class="card-header">
            <div class="service-brand">
              <span class="service-icon">▲</span>
              <div>
                <h4 class="service-name">Vercel Deployment</h4>
                <span class="service-auth">Team: <strong>SiteForge Production</strong></span>
              </div>
            </div>
            <span class="sf-badge sf-badge-primary">● Zero-Config</span>
          </div>

          <div class="card-body">
            <div class="form-group">
              <label class="form-label" for="projectName">Vercel Project Target</label>
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

            <div class="integration-meta">
              <span>Framework: <code>Angular 19+ (Zoneless)</code></span>
              <span>Build: <code>npm run build</code></span>
              <span>Output: <code>dist/{{ vercelProject() }}/browser</code></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .integrations-section {
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
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-4, 16px);
    }
    @media (max-width: 768px) {
      .cards-grid {
        grid-template-columns: 1fr;
      }
    }
    .integration-card {
      background: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      padding: var(--spacing-5, 20px);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-4, 16px);
      padding-bottom: var(--spacing-3, 12px);
      border-bottom: 1px dashed var(--color-border);
    }
    .service-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .service-icon {
      font-size: 1.5rem;
    }
    .service-name {
      font-size: var(--text-base, 1rem);
      font-weight: 700;
      color: var(--color-text-main);
    }
    .service-auth {
      font-size: var(--text-xs, 0.75rem);
      color: var(--color-text-muted);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: var(--spacing-3, 12px);
    }
    .form-label {
      font-size: var(--text-xs, 0.75rem);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
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
      font-family: ui-monospace, monospace;
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
      font-family: ui-monospace, monospace;
    }
    .integration-meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }
    .integration-meta code {
      background: var(--color-surface-muted);
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 0.7rem;
    }
  `],
})
export class ConnectionCardsComponent {
  private readonly state = inject(FactoryStateService);

  readonly githubRepo = this.state.githubRepo;
  readonly vercelProject = this.state.vercelProject;

  update(field: any, val: string): void {
    this.state.updateField(field, val);
  }
}
