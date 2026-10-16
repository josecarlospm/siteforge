import { Component, inject } from '@angular/core';
import { FactoryStateService } from '../services/factory-state.service';

@Component({
  selector: 'sf-pipeline-runner',
  template: `
    <section class="orchestration-section" aria-labelledby="runner-heading">
      <div class="runner-panel">
        <div class="runner-header">
          <div>
            <p class="section-kicker">05 · Orchestration</p>
            <h2 class="runner-title" id="runner-heading">Run factory</h2>
            <p class="runner-subtitle">
              Validate → scaffold → GitHub sync → Vercel deploy → live verify
            </p>
          </div>

          <button
            type="button"
            class="sf-btn sf-btn-primary generate-cta"
            [disabled]="isGenerating()"
            (click)="startGeneration()"
          >
            @if (isGenerating()) {
              <span class="spinner" aria-hidden="true"></span> Orchestrating…
            } @else {
              Run SiteForge
            }
          </button>
        </div>

        @if (progress() > 0) {
          <div class="progress-wrap" role="progressbar" [attr.aria-valuenow]="progress()" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar" [style.width.%]="progress()"></div>
            <span class="progress-text">{{ progress() }}%</span>
          </div>
        }

        <div class="stages-stepper">
          @for (stage of stages(); track stage.id; let idx = $index) {
            <div
              class="stage-step"
              [class.completed]="stage.status === 'completed'"
              [class.running]="stage.status === 'running'"
              [class.idle]="stage.status === 'idle'"
            >
              <div class="step-indicator" aria-hidden="true">
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

        @if (logs().length > 0) {
          <div class="terminal-window">
            <div class="terminal-bar">
              <span class="terminal-title">siteforge-orchestrator.log</span>
            </div>
            <div class="terminal-body">
              @for (log of logs(); track log) {
                <div class="log-line">{{ log }}</div>
              }
            </div>
          </div>
        }

        @if (result(); as res) {
          <div class="deployment-result">
            <h3 class="result-title">Deployed successfully</h3>
            <p class="result-meta">
              {{ (res.durationMs / 1000).toFixed(1) }}s ·
              {{ res.filesGenerated }} files ·
              <code>{{ res.designPreset }}</code>
            </p>

            <div class="urls-grid">
              <div class="url-box">
                <span class="url-label">Production URL</span>
                <a class="url-link" [href]="res.vercelUrl" target="_blank" rel="noopener">
                  {{ res.vercelUrl }}
                </a>
              </div>
              <div class="url-box">
                <span class="url-label">GitHub repository</span>
                <a class="url-link" [href]="res.githubUrl" target="_blank" rel="noopener">
                  {{ res.githubUrl }}
                </a>
              </div>
            </div>

            <div class="action-row">
              <a class="sf-btn sf-btn-primary" [href]="res.vercelUrl" target="_blank" rel="noopener">
                Open live site
              </a>
              <a class="sf-btn sf-btn-secondary" [href]="res.githubUrl" target="_blank" rel="noopener">
                Inspect repo
              </a>
              <span class="commit-tag">Commit <code>{{ res.commitSha.substring(0, 7) }}</code></span>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .runner-panel {
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
    .section-kicker {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--color-primary);
      margin: 0 0 4px;
      letter-spacing: 0.04em;
    }
    .runner-title {
      font-size: 1.2rem;
      font-weight: 650;
      letter-spacing: -0.02em;
      color: var(--color-text-main);
      margin: 0;
    }
    .runner-subtitle {
      font-size: var(--text-sm, 0.875rem);
      color: var(--color-text-muted);
    }
    .generate-cta {
      padding: 12px 22px;
      font-size: 0.95rem;
    }
    .generate-cta:disabled {
      opacity: 0.7;
      cursor: wait;
    }
    .progress-wrap {
      position: relative;
      height: 6px;
      background: var(--color-surface-muted);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: var(--spacing-6, 24px);
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
      transition: width 300ms ease-out;
    }
    .progress-text {
      position: absolute;
      right: 0;
      top: -18px;
      font-size: 0.7rem;
      font-weight: 650;
      font-family: var(--font-mono);
      color: var(--color-accent);
    }
    .stages-stepper {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 10px;
      margin-bottom: var(--spacing-6, 24px);
    }
    .stage-step {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: var(--radius-card);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      transition: border-color 200ms ease;
    }
    .stage-step.completed {
      border-color: var(--color-primary);
    }
    .stage-step.running {
      border-color: var(--color-accent);
    }
    .step-indicator {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 700;
      background: var(--color-surface-muted);
      color: var(--color-text-muted);
      flex-shrink: 0;
    }
    .stage-step.completed .step-indicator {
      background: var(--color-primary);
      color: #0E1116;
    }
    .stage-step.running .step-indicator {
      background: var(--color-accent);
      color: #0E1116;
    }
    .step-details {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .step-label {
      font-size: 0.78rem;
      font-weight: 650;
      color: var(--color-text-main);
      white-space: nowrap;
    }
    .step-desc {
      font-size: 0.62rem;
      color: var(--color-text-muted);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .terminal-window {
      background: #0A0D12;
      border-radius: var(--radius-card);
      border: 1px solid var(--color-border);
      overflow: hidden;
      margin-bottom: var(--spacing-6, 24px);
    }
    .terminal-bar {
      background: var(--color-surface-muted);
      padding: 8px 12px;
    }
    .terminal-title {
      color: var(--color-text-muted);
      font-size: 0.7rem;
      font-family: var(--font-mono);
    }
    .terminal-body {
      padding: 12px;
      max-height: 160px;
      overflow-y: auto;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--color-accent);
      line-height: 1.5;
    }
    .log-line {
      white-space: pre-wrap;
      word-break: break-all;
    }
    .deployment-result {
      border: 1px solid var(--color-primary);
      border-radius: var(--radius-card);
      padding: var(--spacing-6, 24px);
      background: linear-gradient(135deg, rgba(224, 122, 61, 0.08), rgba(201, 162, 39, 0.06));
    }
    .result-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-text-main);
      margin-bottom: 4px;
    }
    .result-meta {
      font-size: 0.85rem;
      color: var(--color-text-muted);
      margin-bottom: var(--spacing-4, 16px);
    }
    .result-meta code {
      font-family: var(--font-mono);
      color: var(--color-accent);
    }
    .urls-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: var(--spacing-5, 20px);
    }
    @media (max-width: 640px) {
      .urls-grid {
        grid-template-columns: 1fr;
      }
    }
    .url-box {
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-btn);
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .url-label {
      font-size: 0.68rem;
      font-weight: 650;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }
    .url-link {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--color-primary);
      font-weight: 600;
      word-break: break-all;
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
      font-family: var(--font-mono);
    }
    .spinner, .step-spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(14, 17, 22, 0.25);
      border-radius: 50%;
      border-top-color: #0E1116;
      animation: spin 0.8s linear infinite;
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
