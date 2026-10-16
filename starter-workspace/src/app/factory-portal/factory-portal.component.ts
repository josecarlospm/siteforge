import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryStateService } from './services/factory-state.service';
import { ArchetypeSelectorComponent } from './components/archetype-selector.component';
import { PresetSelectorComponent } from './components/preset-selector.component';
import { ThemeEditorComponent } from './components/theme-editor.component';
import { ConnectionCardsComponent } from './components/connection-cards.component';
import { JsonEditorComponent } from './components/json-editor.component';
import { PipelineRunnerComponent } from './components/pipeline-runner.component';

@Component({
  selector: 'sf-factory-portal',
  standalone: true,
  imports: [
    CommonModule,
    ArchetypeSelectorComponent,
    PresetSelectorComponent,
    ThemeEditorComponent,
    ConnectionCardsComponent,
    JsonEditorComponent,
    PipelineRunnerComponent,
  ],
  template: `
    <div class="factory-portal">
      <!-- Portal Hero Banner -->
      <section class="portal-hero">
        <div class="hero-content">
          <div class="brand-eyebrow">
            <span class="sf-badge sf-badge-primary">⚡ Stage 3: Factory Portal</span>
            <span class="eyebrow-text">Autonomous Angular Web Factory</span>
          </div>

          <h1 class="hero-title">
            SiteForge
            <span class="highlight">Autonomous Web Factory</span>
          </h1>

          <p class="hero-desc">
            Transform structured JSON payloads into modern, production-deployed Angular 19+ web applications
            published directly to GitHub and Vercel in under 3 minutes.
          </p>

          <div class="hero-stats">
            <div class="stat-pill">
              <span class="stat-val">6</span>
              <span class="stat-lbl">Archetypes</span>
            </div>
            <div class="stat-pill">
              <span class="stat-val">5</span>
              <span class="stat-lbl">Design.md Presets</span>
            </div>
            <div class="stat-pill">
              <span class="stat-val">&lt; 3m</span>
              <span class="stat-lbl">Deployment SLA</span>
            </div>
            <div class="stat-pill">
              <span class="stat-val">100%</span>
              <span class="stat-lbl">Zoneless Angular 19+</span>
            </div>
          </div>
        </div>

        <div class="mode-switch-card">
          <span class="mode-label">Editing Mode</span>
          <div class="switch-buttons">
            <button
              class="sf-btn"
              [class.sf-btn-primary]="!isJsonMode()"
              [class.sf-btn-secondary]="isJsonMode()"
              (click)="setMode(false)"
            >
              🎨 Visual Builder
            </button>
            <button
              class="sf-btn"
              [class.sf-btn-primary]="isJsonMode()"
              [class.sf-btn-secondary]="!isJsonMode()"
              (click)="setMode(true)"
            >
              &#123; &#125; Raw JSON Editor
            </button>
          </div>
        </div>
      </section>

      <!-- Main Studio Body -->
      <main class="studio-body">
        @if (!isJsonMode()) {
          <!-- 1. Archetype Selector -->
          <sf-archetype-selector />

          <!-- 2. Preset Selector -->
          <sf-preset-selector />

          <!-- 3. Theme & Content Editor -->
          <sf-theme-editor />

          <!-- 4. Cloud Integrations -->
          <sf-connection-cards />
        } @else {
          <!-- Raw JSON Editor Mode -->
          <sf-json-editor />
        }

        <!-- 5. Autonomous Factory Orchestration Runner -->
        <sf-pipeline-runner />
      </main>
    </div>
  `,
  styles: [`
    .factory-portal {
      max-width: var(--container-max-w, 1280px);
      margin: 0 auto;
      padding: var(--spacing-6, 24px);
    }
    .portal-hero {
      background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-muted) 100%);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      padding: var(--spacing-8, 32px);
      margin-bottom: var(--spacing-8, 32px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-6, 24px);
      box-shadow: var(--shadow-card);
    }
    .hero-content {
      max-width: 680px;
    }
    .brand-eyebrow {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: var(--spacing-3, 12px);
    }
    .eyebrow-text {
      font-size: var(--text-xs, 0.75rem);
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }
    .hero-title {
      font-size: 2.25rem;
      font-weight: 800;
      line-height: 1.15;
      margin-bottom: var(--spacing-3, 12px);
      color: var(--color-text-main);
    }
    .highlight {
      display: block;
      color: var(--color-primary);
    }
    .hero-desc {
      font-size: var(--text-base, 1rem);
      color: var(--color-text-muted);
      line-height: 1.5;
      margin-bottom: var(--spacing-6, 24px);
    }
    .hero-stats {
      display: flex;
      gap: var(--spacing-4, 16px);
      flex-wrap: wrap;
    }
    .stat-pill {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-btn);
      padding: 8px 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-val {
      font-size: 1.125rem;
      font-weight: 800;
      color: var(--color-primary);
    }
    .stat-lbl {
      font-size: 0.65rem;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--color-text-muted);
    }
    .mode-switch-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      padding: var(--spacing-4, 16px);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .mode-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }
    .switch-buttons {
      display: flex;
      gap: 6px;
    }
    .studio-body {
      display: flex;
      flex-direction: column;
    }
  `],
})
export class FactoryPortalComponent {
  private readonly state = inject(FactoryStateService);

  readonly isJsonMode = this.state.isJsonMode;

  setMode(isJson: boolean): void {
    if (this.isJsonMode() !== isJson) {
      this.state.toggleJsonMode();
    }
  }
}
