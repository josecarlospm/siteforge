import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FactoryStateService } from '../services/factory-state.service';

@Component({
  selector: 'sf-json-editor',
  imports: [FormsModule],
  template: `
    <section class="json-section" aria-labelledby="json-heading">
      <div class="editor-header">
        <div class="title-wrap">
          <h2 class="section-title" id="json-heading">Raw JSON payload</h2>
          <p class="section-subtitle">Two-way sync with the canonical SiteForge payload contract</p>
        </div>

        <div class="btn-group">
          @if (copied()) {
            <span class="copied-indicator">Copied</span>
          }
          <button type="button" class="sf-btn sf-btn-secondary btn-sm" (click)="copyJson()">
            Copy JSON
          </button>
          <button type="button" class="sf-btn sf-btn-secondary btn-sm" (click)="formatJson()">
            Format
          </button>
        </div>
      </div>

      @if (error(); as err) {
        <div class="error-banner" role="alert">
          JSON syntax error: {{ err }}
        </div>
      }

      <div class="textarea-container">
        <textarea
          class="json-textarea"
          rows="18"
          [ngModel]="jsonString()"
          (ngModelChange)="onJsonChange($event)"
          spellcheck="false"
          aria-label="JSON payload editor"
        ></textarea>
      </div>
    </section>
  `,
  styles: [`
    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: var(--spacing-3, 12px);
    }
    .section-title {
      font-size: var(--text-xl, 1.25rem);
      font-weight: 600;
      color: var(--color-text-main);
    }
    .section-subtitle {
      font-size: var(--text-sm, 0.875rem);
      color: var(--color-text-muted);
    }
    .btn-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-sm {
      padding: 6px 12px;
      font-size: 0.75rem;
    }
    .copied-indicator {
      font-size: 0.75rem;
      font-weight: 650;
      color: var(--color-accent);
    }
    .error-banner {
      background: rgba(179, 58, 58, 0.15);
      border: 1px solid rgba(179, 58, 58, 0.45);
      color: #F5B5B5;
      padding: 8px 12px;
      border-radius: var(--radius-btn);
      font-size: 0.8rem;
      font-family: var(--font-mono);
      margin-bottom: 8px;
    }
    .textarea-container {
      background: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      overflow: hidden;
    }
    .json-textarea {
      width: 100%;
      background: #0A0D12;
      color: #E8E6E1;
      padding: 16px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      line-height: 1.5;
      border: none;
      outline: none;
      resize: vertical;
    }
  `],
})
export class JsonEditorComponent {
  private readonly state = inject(FactoryStateService);

  readonly jsonString = this.state.rawJsonString;
  readonly error = this.state.jsonError;
  readonly copied = signal(false);

  copyJson(): void {
    navigator.clipboard?.writeText(this.jsonString());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }

  formatJson(): void {
    this.state.syncJsonStringFromFields();
  }

  onJsonChange(val: string): void {
    this.state.updateRawJson(val);
  }
}
