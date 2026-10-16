import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryStateService } from '../services/factory-state.service';

@Component({
  selector: 'sf-pipeline-runner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="orchestration-section">
      <div class="runner-card">
        <div class="runner-header">
          <div>
            <h3 class="runner-title">5. Autonomous Factory Orchestration Runner</h3>
            <span class="runner-subtitle">Validates payload, scaffolds Angular 19+ repo, pushes to GitHub & deploys to Vercel</span>
          </div>

          <button
            class="sf-btn sf-btn-primary generate-cta"
            [disabled]="isGenerating()"
            (click)="startGeneration()"
          >
            @if (isGenerating()) {
              <span class="spinner"></span> Orchestrating...
            } @else {
              ⚡ Run SiteForge Web Factory
            }
          </button>
        </div>

        <!-- Progress Bar -->
        @if (progress() > 0) {
          <div class="progress-wrap">
            <div class="progress-bar" [style.width.%]="progress()"></div>
            <span class="progress-text">{{ progress() }}% Complete</span>
          </div>
        }

        <!-- Stages Stepper -->
        <div class="stages-stepper">
          @for (stage of stages(); track stage.id; let idx = $index) {
            <div
              class="stage-step"
              [class.completed]="stage.status === 'completed'"
              [class.running]="stage.status === 'running'"
              [class.idle]="stage.status === 'idle'"
            >
              <div class="step-indicator">
                @if (stage.status === 'completed') {
                  <span class="icon-check">✓</span>
                } @else if (stage.status === 'running') {
                  <span class="step-spinner"></span>
                } @else {
                  <span class="step-num">{{ idx + 1 }}</span>
                }
              </div>
              <div class="step-details">
                <span class="step-label">{{ stage.label }}</span>
                <span class="step-desc">{{ stage.description }}</span>
              </div>
            </div>
          }
        </div>

        <!-- Real-Time Console Logs -->
        @if (logs().length > 0) {
          <div class="terminal-window">
            <div class="terminal-bar">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
              <span class="terminal-title">siteforge-factory-orchestrator.log</span>
            </div>
            <div class="terminal-body">
              @for (log of logs(); track log) {
                <div class="log-line">{{ log }}</div>
              }
            </div>
          </div>
        }

        <!-- Final Deployment Showcase Card -->
        @if (result(); as res) {
          <div class="deployment-result-card">
            <div class="result-badge">
              <span class="celebration-icon">🎉</span>
              <div>
                <h4 class="result-title">Website Generated & Deployed Successfully!</h4>
                <p class="result-meta">
                  Published in <strong>{{ (res.durationMs / 1000).toFixed(1) }}s</strong> (Target: &lt; 3 minutes) •
                  <strong>{{ res.filesGenerated }} files</strong> • Preset: <code>{{ res.designPreset }}</code>
                </p>
              </div>
            </div>

            <div class="urls-grid">
              <div class="url-box primary-box">
                <span class="url-label">Production Vercel URL</span>
                <a class="url-link primary-link" [href]="res.vercelUrl" target="_blank" rel="noopener">
                  {{ res.vercelUrl }} ↗
                </a>
              </div>

              <div class="url-box">
                <span class="url-label">GitHub Repository</span>
                <a class="url-link" [href]="res.githubUrl" target="_blank" rel="noopener">
                  {{ res.githubUrl }} ↗
                </a>
              </div>
            </div>

            <div class="action-row">
              <a class="sf-btn sf-btn-primary" [href]="res.vercelUrl" target="_blank" rel="noopener">
                🚀 Open Live Website
              </a>
              <a class="sf-btn sf-btn-secondary" [href]="res.githubUrl" target="_blank" rel="noopener">
                🐙 Inspect GitHub Repo
              </a>
              <span class="commit-tag">Commit: <code>{{ res.commitSha.substring(0, 7) }}</code></span>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .orchestration-section {
      margin-bottom: var(--spacing-8, 32px);
    }
    .runner-card {
      background: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      padding: var(--spacing-6, 24px);
    }
    .runner-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-4, 16px);
      margin-bottom: var(--spacing-6, 24px);
    }
    .runner-title {
      font-size: var(--text-lg, 1.125rem);
      font-weight: 700;
      color: var(--color-text-main);
    }
    .runner-subtitle {
      font-size: var(--text-sm, 0.875rem);
      color: var(--color-text-muted);
    }
    .generate-cta {
      padding: 12px 24px;
      font-size: 1rem;
      border-radius: var(--radius-pill);
      box-shadow: 0 4px 14px rgba(45, 90, 39, 0.25);
    }
    .progress-wrap {
      position: relative;
      height: 12px;
      background: var(--color-surface-muted);
      border-radius: var(--radius-pill);
      overflow: hidden;
      margin-bottom: var(--spacing-6, 24px);
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
      transition: width 300ms ease-out;
    }
    .progress-text {
      position: absolute;
      right: 8px;
      top: -18px;
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--color-primary);
    }
    .stages-stepper {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-bottom: var(--spacing-6, 24px);
    }
    .stage-step {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: var(--radius-card);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      transition: all 200ms ease;
    }
    .stage-step.completed {
      border-color: var(--color-primary);
      background: var(--color-surface);
    }
    .stage-step.running {
      border-color: var(--color-accent);
      background: var(--color-surface);
      box-shadow: 0 0 0 2px var(--color-accent);
    }
    .step-indicator {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      background: var(--color-surface-muted);
      color: var(--color-text-muted);
    }
    .stage-step.completed .step-indicator {
      background: var(--color-primary);
      color: #FFFFFF;
    }
    .stage-step.running .step-indicator {
      background: var(--color-accent);
      color: #FFFFFF;
    }
    .step-details {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .step-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--color-text-main);
      white-space: nowrap;
    }
    .step-desc {
      font-size: 0.65rem;
      color: var(--color-text-muted);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .terminal-window {
      background: #0D1117;
      border-radius: var(--radius-card);
      border: 1px solid #30363D;
      overflow: hidden;
      margin-bottom: var(--spacing-6, 24px);
    }
    .terminal-bar {
      background: #161B22;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .terminal-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .terminal-dot.red { background: #FF5F56; }
    .terminal-dot.yellow { background: #FFBD2E; }
    .terminal-dot.green { background: #27C93F; }
    .terminal-title {
      color: #8B949E;
      font-size: 0.7rem;
      font-family: ui-monospace, monospace;
      margin-left: 8px;
    }
    .terminal-body {
      padding: 12px;
      max-height: 160px;
      overflow-y: auto;
      font-family: ui-monospace, monospace;
      font-size: 0.75rem;
      color: #58A6FF;
      line-height: 1.5;
    }
    .log-line {
      white-space: pre-wrap;
      word-break: break-all;
    }
    .deployment-result-card {
      background: linear-gradient(135deg, rgba(45, 90, 39, 0.08) 0%, rgba(143, 188, 143, 0.12) 100%);
      border: 2px solid var(--color-primary);
      border-radius: var(--radius-card);
      padding: var(--spacing-6, 24px);
    }
    .result-badge {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: var(--spacing-4, 16px);
    }
    .celebration-icon {
      font-size: 2.25rem;
    }
    .result-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--color-text-main);
    }
    .result-meta {
      font-size: 0.85rem;
      color: var(--color-text-muted);
    }
    .urls-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: var(--spacing-5, 20px);
    }
    .url-box {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-btn);
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .url-box.primary-box {
      border-color: var(--color-primary);
      background: #FFFFFF;
    }
    .url-label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
    }
    .url-link {
      font-family: ui-monospace, monospace;
      font-size: 0.85rem;
      color: var(--color-primary);
      font-weight: 600;
      text-decoration: underline;
    }
    .action-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .commit-tag {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin-left: auto;
    }
    .spinner, .step-spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 0.8s linear infinite;
    }
    .step-spinner {
      border-color: rgba(0,0,0,0.2);
      border-top-color: var(--color-accent);
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class PipelineRunnerComponent {
  private readonly state = inject(FactoryStateService);

  readonly isGenerating = this.state.isGenerating;
  readonly progress = this.state.progressPercentage;
  readonly stages = this.state.stages;
  readonly logs = this.state.consoleLogs;
  readonly result = this.state.generationResult;

  startGeneration(): void {
    this.state.triggerGeneration();
  }
}
