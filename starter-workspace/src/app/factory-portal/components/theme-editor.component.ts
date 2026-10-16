import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactoryStateService } from '../services/factory-state.service';
import { FactorySiteType } from '../models/factory.model';

@Component({
  selector: 'sf-theme-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="theme-section">
      <div class="section-header">
        <div class="title-wrap">
          <h3 class="section-title">3. Domain Theme & Content Parameters</h3>
          <span class="section-subtitle">Define what your website is about and customize branding</span>
        </div>

        <div class="sample-pills">
          <span class="pill-label">Quick Samples:</span>
          <button class="sample-btn" (click)="loadSample('learning_platform')">🌱 Plants E-Learning</button>
          <button class="sample-btn" (click)="loadSample('ecommerce')">⌨️ Keyboards Store</button>
          <button class="sample-btn" (click)="loadSample('newsletter')">🤖 Agentic Newsletter</button>
          <button class="sample-btn" (click)="loadSample('landing_page')">⚡ Web Factory SaaS</button>
        </div>
      </div>

      <div class="editor-grid">
        <!-- Site Name -->
        <div class="form-group">
          <label class="form-label" for="siteName">Commercial / Site Name</label>
          <input
            id="siteName"
            type="text"
            class="form-input"
            [ngModel]="siteName()"
            (ngModelChange)="update('siteName', $event)"
            placeholder="e.g. PlantCare Academy"
          />
        </div>

        <!-- Topic -->
        <div class="form-group">
          <label class="form-label" for="topic">Content Topic / Domain</label>
          <input
            id="topic"
            type="text"
            class="form-input"
            [ngModel]="topic()"
            (ngModelChange)="update('topic', $event)"
            placeholder="e.g. Indoor Houseplant Care"
          />
        </div>

        <!-- Tagline -->
        <div class="form-group full-width">
          <label class="form-label" for="tagline">Tagline</label>
          <input
            id="tagline"
            type="text"
            class="form-input"
            [ngModel]="tagline()"
            (ngModelChange)="update('tagline', $event)"
            placeholder="e.g. Cultivate your indoor jungle with botanical masterclasses"
          />
        </div>

        <!-- Description -->
        <div class="form-group full-width">
          <label class="form-label" for="description">Meta Description & Overview</label>
          <textarea
            id="description"
            class="form-textarea"
            rows="2"
            [ngModel]="description()"
            (ngModelChange)="update('description', $event)"
            placeholder="Brief description of the website content and mission"
          ></textarea>
        </div>

        <!-- Colors -->
        <div class="form-group">
          <label class="form-label">Primary Brand Color</label>
          <div class="color-picker-wrap">
            <input
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
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Secondary Brand Color</label>
          <div class="color-picker-wrap">
            <input
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
            />
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .theme-section {
      margin-bottom: var(--spacing-8, 32px);
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: var(--spacing-3, 12px);
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
    .sample-pills {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .pill-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-muted);
    }
    .sample-btn {
      font-size: 0.75rem;
      padding: 4px 8px;
      border-radius: var(--radius-pill);
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text-main);
      cursor: pointer;
      transition: all 120ms ease;
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
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
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
      transition: border-color var(--transition-fast, 150ms ease);
    }
    .form-input:focus, .form-textarea:focus {
      border-color: var(--color-primary);
    }
    .font-mono {
      font-family: ui-monospace, monospace;
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

  update(field: any, val: string): void {
    this.state.updateField(field, val);
  }

  loadSample(siteType: FactorySiteType): void {
    this.state.loadSample(siteType);
  }
}
