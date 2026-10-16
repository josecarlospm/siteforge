import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FactoryStateService } from '../services/factory-state.service';
import { FactorySiteType } from '../models/factory.model';

@Component({
  selector: 'sf-theme-editor',
  imports: [FormsModule],
  template: `
    <section class="theme-section" aria-labelledby="theme-heading">
      <div class="section-header">
        <div class="title-wrap">
          <p class="section-kicker">03 · Theme</p>
          <h2 class="section-title" id="theme-heading">Content & branding</h2>
          <p class="section-subtitle">Domain topic, commercial name, and brand color overrides</p>
        </div>

        <div class="sample-row">
          <span class="sample-label">Load sample</span>
          <button type="button" class="sample-btn" (click)="loadSample('learning_platform')">PlantCare learning</button>
          <button type="button" class="sample-btn" (click)="loadSample('ecommerce')">Keyboards store</button>
          <button type="button" class="sample-btn" (click)="loadSample('newsletter')">Agentic digest</button>
          <button type="button" class="sample-btn" (click)="loadSample('landing_page')">Factory launch</button>
        </div>
      </div>

      <div class="editor-grid">
        <div class="form-group">
          <label class="form-label" for="siteName">Site name</label>
          <input
            id="siteName"
            type="text"
            class="form-input"
            [ngModel]="siteName()"
            (ngModelChange)="update('siteName', $event)"
            placeholder="e.g. PlantCare Academy"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="topic">Topic / domain</label>
          <input
            id="topic"
            type="text"
            class="form-input"
            [ngModel]="topic()"
            (ngModelChange)="update('topic', $event)"
            placeholder="e.g. Indoor Houseplant Care"
          />
        </div>

        <div class="form-group full-width">
          <label class="form-label" for="tagline">Tagline</label>
          <input
            id="tagline"
            type="text"
            class="form-input"
            [ngModel]="tagline()"
            (ngModelChange)="update('tagline', $event)"
            placeholder="One supporting line"
          />
        </div>

        <div class="form-group full-width">
          <label class="form-label" for="description">Description</label>
          <textarea
            id="description"
            class="form-textarea"
            rows="2"
            [ngModel]="description()"
            (ngModelChange)="update('description', $event)"
            placeholder="Brief mission and content overview"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label" for="primaryColor">Primary color</label>
          <div class="color-picker-wrap">
            <input
              id="primaryColor"
              type="color"
              class="color-input"
              [ngModel]="primaryColor()"
              (ngModelChange)="update('primaryColor', $event)"
            />
            <input
              type="text"
              class="form-input font-mono"
              [ngModel]="primaryColor()"
              (ngModelChange)="update('primaryColor', $event)"
              aria-label="Primary color hex"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="secondaryColor">Secondary color</label>
          <div class="color-picker-wrap">
            <input
              id="secondaryColor"
              type="color"
              class="color-input"
              [ngModel]="secondaryColor()"
              (ngModelChange)="update('secondaryColor', $event)"
            />
            <input
              type="text"
              class="form-input font-mono"
              [ngModel]="secondaryColor()"
              (ngModelChange)="update('secondaryColor', $event)"
              aria-label="Secondary color hex"
            />
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: var(--spacing-3, 12px);
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
    .sample-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .sample-label {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }
    .sample-btn {
      font-size: 0.75rem;
      padding: 6px 10px;
      border-radius: var(--radius-btn);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text-main);
      cursor: pointer;
    }
    .sample-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    .editor-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-4, 16px);
      background: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      padding: var(--spacing-6, 24px);
    }
    .full-width {
      grid-column: 1 / -1;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-label {
      font-size: var(--text-xs, 0.75rem);
      font-weight: 650;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }
    .form-input, .form-textarea {
      background: var(--color-bg);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-btn);
      padding: var(--spacing-2, 8px) var(--spacing-3, 12px);
      font-size: var(--text-sm, 0.875rem);
      color: var(--color-text-main);
      font-family: inherit;
      outline: none;
    }
    .form-input:focus, .form-textarea:focus {
      border-color: var(--color-primary);
    }
    .font-mono {
      font-family: var(--font-mono);
    }
    .color-picker-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .color-input {
      width: 38px;
      height: 38px;
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-btn);
      cursor: pointer;
      padding: 0;
      background: none;
    }
    @media (max-width: 640px) {
      .editor-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ThemeEditorComponent {
  private readonly state = inject(FactoryStateService);

  readonly siteName = this.state.siteName;
  readonly topic = this.state.topic;
  readonly tagline = this.state.tagline;
  readonly description = this.state.description;
  readonly primaryColor = this.state.primaryColor;
  readonly secondaryColor = this.state.secondaryColor;

  update(
    field:
      | 'topic'
      | 'siteName'
      | 'tagline'
      | 'description'
      | 'primaryColor'
      | 'secondaryColor',
    val: string,
  ): void {
    this.state.updateField(field, val);
  }

  loadSample(siteType: FactorySiteType): void {
    this.state.loadSample(siteType);
  }
}
