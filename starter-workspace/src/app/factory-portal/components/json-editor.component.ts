import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactoryStateService } from '../services/factory-state.service';

@Component({
  selector: 'sf-json-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="json-section">
      <div class="editor-header">
        <div class="title-wrap">
          <h3 class="section-title">Raw JSON Payload Contract</h3>
          <span class="section-subtitle">Real-time two-way synchronization with canonical &#64;siteforge/payload-schema</span>
        </div>

        <div class="btn-group">
          @if (copied()) {
            <span class="copied-indicator">✓ Copied</span>
          }
          <button class="sf-btn sf-btn-secondary btn-sm" (click)="copyJson()">
            📋 Copy JSON
          </button>
          <button class="sf-btn sf-btn-secondary btn-sm" (click)="formatJson()">
            ✨ Format
          </button>
        </div>
      </div>

      @if (error(); as err) {
        <div class="error-banner">
          ⚠️ JSON Syntax Error: {{ err }}
        </div>
      }

      <div class="textarea-container">
        <textarea
          class="json-textarea"
          rows="18"
          [ngModel]="jsonString()"
          (ngModelChange)="onJsonChange($event)"
          spellcheck="false"
        ></textarea>
      </div>
    </section>
  `,
  styles: [`
    .json-section {
      margin-bottom: var(--spacing-8, 32px);
    }
    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-3, 12px);
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
      font-weight: 700;
      color: var(--color-primary);
    }
    .error-banner {
      background: #FFF1F0;
      border: 1px solid #FFA39E;
      color: #CF1322;
      padding: 8px 12px;
      border-radius: var(--radius-btn);
      font-size: 0.8rem;
      font-family: ui-monospace, monospace;
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
      background: #0D1117;
      color: #E6EDF3;
      padding: 16px;
      font-family: ui-monospace, monospace;
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
  readonly copied = inject(FactoryStateService).siteType; // state tracker

  copyJson(): void {
    navigator.clipboard?.writeText(this.jsonString());
  }

  formatJson(): void {
    this.state.syncJsonStringFromFields();
  }

  onJsonChange(val: string): void {
    this.state.updateRawJson(val);
  }
}
