import { Component, inject } from '@angular/core';
import { FactoryStateService } from './services/factory-state.service';
import { ArchetypeSelectorComponent } from './components/archetype-selector.component';
import { PresetSelectorComponent } from './components/preset-selector.component';
import { ThemeEditorComponent } from './components/theme-editor.component';
import { ConnectionCardsComponent } from './components/connection-cards.component';
import { JsonEditorComponent } from './components/json-editor.component';
import { PipelineRunnerComponent } from './components/pipeline-runner.component';

@Component({
  selector: 'sf-factory-portal',
  imports: [
    ArchetypeSelectorComponent,
    PresetSelectorComponent,
    ThemeEditorComponent,
    ConnectionCardsComponent,
    JsonEditorComponent,
    PipelineRunnerComponent,
  ],
  template: `
    <div class="factory-portal">
      <section class="portal-hero" aria-labelledby="sf-hero-brand">
        <div class="hero-plane" aria-hidden="true">
          <div class="forge-grid"></div>
          <div class="forge-ember"></div>
          <div class="forge-beam"></div>
        </div>

        <div class="hero-content">
          <p class="hero-brand" id="sf-hero-brand">SiteForge</p>
          <h1 class="hero-title">Build production Angular sites from a payload.</h1>
          <p class="hero-desc">
            Choose archetype, Design.md preset, and theme — then ship to GitHub and Vercel.
          </p>
          <div class="hero-cta">
            <button
              type="button"
              class="sf-btn sf-btn-primary"
              [class.active]="!isJsonMode()"
              (click)="setMode(false)"
            >
              Visual builder
            </button>
            <button
              type="button"
              class="sf-btn sf-btn-secondary"
              [class.active]="isJsonMode()"
              (click)="setMode(true)"
            >
              Raw JSON
            </button>
          </div>
        </div>
      </section>

      <main class="studio-body">
        @if (!isJsonMode()) {
          <sf-archetype-selector />
          <sf-preset-selector />
          <sf-theme-editor />
          <sf-connection-cards />
        } @else {
          <sf-json-editor />
        }

        <sf-pipeline-runner />
      </main>
    </div>
  `,
  styles: [`
    .factory-portal {
      max-width: var(--container-max-w, 1200px);
      margin: 0 auto;
      padding: 0 var(--spacing-6, 24px) var(--spacing-16, 64px);
    }

    .portal-hero {
      position: relative;
      min-height: min(72vh, 640px);
      display: flex;
      align-items: flex-end;
      margin: 0 calc(-1 * var(--spacing-6, 24px)) var(--spacing-12, 48px);
      padding: var(--spacing-12, 48px) var(--spacing-6, 24px) var(--spacing-10, 40px);
      overflow: hidden;
      isolation: isolate;
    }

    .hero-plane {
      position: absolute;
      inset: 0;
      z-index: 0;
      background:
        radial-gradient(ellipse 80% 60% at 70% 20%, rgba(224, 122, 61, 0.22), transparent 55%),
        radial-gradient(ellipse 50% 40% at 15% 80%, rgba(201, 162, 39, 0.12), transparent 50%),
        linear-gradient(160deg, #0A0D12 0%, #121820 45%, #0E1116 100%);
    }

    .forge-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: linear-gradient(180deg, rgba(0,0,0,0.55), transparent 85%);
      animation: grid-drift 28s linear infinite;
    }

    .forge-ember {
      position: absolute;
      right: -8%;
      top: 10%;
      width: min(52vw, 520px);
      height: min(52vw, 520px);
      border-radius: 50%;
      background: radial-gradient(circle, rgba(224, 122, 61, 0.35) 0%, transparent 68%);
      filter: blur(8px);
      animation: ember-pulse 6s ease-in-out infinite;
    }

    .forge-beam {
      position: absolute;
      left: 8%;
      bottom: 18%;
      width: 42%;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.7), transparent);
      animation: beam-sweep 4.5s ease-in-out infinite;
    }

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 640px;
    }

    .hero-brand {
      font-family: var(--font-heading);
      font-size: clamp(2.75rem, 8vw, 4.5rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 0.95;
      color: var(--color-text-main);
      margin-bottom: var(--spacing-5, 20px);
      animation: brand-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .hero-title {
      font-size: clamp(1.25rem, 2.4vw, 1.625rem);
      font-weight: 500;
      line-height: 1.3;
      color: var(--color-text-main);
      margin-bottom: var(--spacing-3, 12px);
      animation: brand-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both;
    }

    .hero-desc {
      font-size: var(--text-base, 1rem);
      color: var(--color-text-muted);
      line-height: 1.55;
      max-width: 36rem;
      margin-bottom: var(--spacing-6, 24px);
      animation: brand-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) 140ms both;
    }

    .hero-cta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-3, 12px);
      animation: brand-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both;
    }

    .hero-cta .sf-btn.active {
      outline: 1px solid var(--color-accent);
      outline-offset: 2px;
    }

    .studio-body {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-10, 40px);
    }

    @keyframes brand-rise {
      from { opacity: 0; transform: translateY(18px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes ember-pulse {
      0%, 100% { opacity: 0.75; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.06); }
    }

    @keyframes beam-sweep {
      0%, 100% { opacity: 0.35; transform: translateX(0); }
      50% { opacity: 0.9; transform: translateX(12%); }
    }

    @keyframes grid-drift {
      from { background-position: 0 0; }
      to { background-position: 48px 48px; }
    }

    @media (max-width: 720px) {
      .portal-hero {
        min-height: 70vh;
        align-items: flex-end;
      }
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
