import { Component, ElementRef, inject, viewChild } from '@angular/core';
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
      <!-- Marketing composition (2026: brand motion + product plane, not dashboard) -->
      <section class="portal-hero" aria-labelledby="sf-hero-brand">
        <div class="hero-atmosphere" aria-hidden="true">
          <div class="atm-mesh"></div>
          <div class="atm-scan"></div>
          <div class="atm-vignette"></div>
        </div>

        <div class="hero-layout">
          <div class="hero-copy">
            <p class="hero-brand" id="sf-hero-brand">SiteForge</p>
            <h1 class="hero-title">The autonomous Angular web factory.</h1>
            <p class="hero-desc">
              Compose a payload. Preview Design.md aesthetics. Ship a production site to GitHub and Vercel.
            </p>
            <div class="hero-cta">
              <button type="button" class="sf-btn sf-btn-primary cta-primary" (click)="openStudio()">
                Open the factory
              </button>
              <button
                type="button"
                class="sf-btn sf-btn-secondary"
                (click)="openJson()"
              >
                Edit payload JSON
              </button>
            </div>
          </div>

          <aside class="hero-product" aria-hidden="true">
            <div class="product-stage">
              <div class="stage-chrome">
                <span class="stage-dot"></span>
                <span class="stage-dot"></span>
                <span class="stage-dot"></span>
                <span class="stage-path">siteforge · factory</span>
              </div>
              <div class="stage-body">
                <div class="stage-rail">
                  <span class="rail-step active">01 Payload</span>
                  <span class="rail-step">02 Scaffold</span>
                  <span class="rail-step">03 Deploy</span>
                </div>
                <div class="stage-canvas">
                  <div class="canvas-block title-block"></div>
                  <div class="canvas-row">
                    <div class="canvas-block swatch-a"></div>
                    <div class="canvas-block swatch-b"></div>
                    <div class="canvas-block swatch-c"></div>
                  </div>
                  <div class="canvas-block wide-block"></div>
                  <div class="canvas-status">
                    <span class="status-pulse"></span>
                    <span>Orchestrator ready</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <!-- Operational studio (2026: calm density + progressive flow) -->
      <main class="studio" #studioAnchor id="factory-studio" tabindex="-1">
        <header class="studio-toolbar">
          <div class="toolbar-left">
            <h2 class="studio-label">Factory studio</h2>
            <p class="studio-hint">Flow-first configure → connect → run</p>
          </div>
          <div class="toolbar-modes" role="tablist" aria-label="Editing mode">
            <button
              type="button"
              role="tab"
              class="mode-tab"
              [attr.aria-selected]="!isJsonMode()"
              [class.active]="!isJsonMode()"
              (click)="setMode(false)"
            >
              Visual
            </button>
            <button
              type="button"
              role="tab"
              class="mode-tab"
              [attr.aria-selected]="isJsonMode()"
              [class.active]="isJsonMode()"
              (click)="setMode(true)"
            >
              JSON
            </button>
          </div>
          <div class="toolbar-payload" aria-live="polite">
            <code>{{ siteType() }}</code>
            <span class="sep">·</span>
            <code>{{ designPreset() }}</code>
          </div>
        </header>

        <ol class="flow-rail" aria-label="Factory steps">
          <li class="flow-item"><span class="flow-num">01</span> Archetype</li>
          <li class="flow-item"><span class="flow-num">02</span> Design preset</li>
          <li class="flow-item"><span class="flow-num">03</span> Theme</li>
          <li class="flow-item"><span class="flow-num">04</span> Integrations</li>
          <li class="flow-item"><span class="flow-num">05</span> Run</li>
        </ol>

        <div class="studio-body">
          @if (!isJsonMode()) {
            <sf-archetype-selector />
            <sf-preset-selector />
            <sf-theme-editor />
            <sf-connection-cards />
          } @else {
            <sf-json-editor />
          }
          <sf-pipeline-runner />
        </div>
      </main>
    </div>
  `,
  styles: [`
    .factory-portal {
      padding-bottom: var(--spacing-16, 64px);
    }

    /* —— Hero: one composition —— */
    .portal-hero {
      position: relative;
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      isolation: isolate;
      overflow: hidden;
      margin-bottom: var(--spacing-8, 32px);
    }

    .hero-atmosphere {
      position: absolute;
      inset: 0;
      z-index: 0;
      background: #07090C;
    }

    .atm-mesh {
      position: absolute;
      inset: -20%;
      background:
        radial-gradient(ellipse 55% 45% at 72% 28%, rgba(224, 122, 61, 0.28), transparent 60%),
        radial-gradient(ellipse 40% 35% at 18% 70%, rgba(201, 162, 39, 0.10), transparent 55%),
        radial-gradient(ellipse 70% 50% at 50% 100%, rgba(23, 28, 36, 0.9), transparent 70%),
        linear-gradient(165deg, #06080B 0%, #0E1116 50%, #0A0D12 100%);
      animation: mesh-breathe 10s ease-in-out infinite;
    }

    .atm-scan {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        rgba(255, 255, 255, 0.015) 3px,
        rgba(255, 255, 255, 0.015) 4px
      );
      mask-image: linear-gradient(180deg, rgba(0,0,0,0.5), transparent 80%);
      pointer-events: none;
    }

    .atm-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%);
      pointer-events: none;
    }

    .hero-layout {
      position: relative;
      z-index: 1;
      width: min(1200px, calc(100% - 48px));
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
      gap: clamp(32px, 5vw, 64px);
      align-items: center;
      padding: 96px 0 72px;
    }

    .hero-brand {
      font-family: var(--font-heading);
      font-size: clamp(3.25rem, 9vw, 5.5rem);
      font-weight: 700;
      letter-spacing: -0.045em;
      line-height: 0.92;
      color: #F2F0EB;
      margin: 0 0 1.25rem;
      animation: rise 800ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .hero-title {
      font-size: clamp(1.35rem, 2.6vw, 1.85rem);
      font-weight: 500;
      letter-spacing: -0.02em;
      line-height: 1.25;
      color: #F2F0EB;
      margin: 0 0 0.85rem;
      max-width: 18ch;
      animation: rise 800ms cubic-bezier(0.16, 1, 0.3, 1) 70ms both;
    }

    .hero-desc {
      font-size: 1.05rem;
      line-height: 1.55;
      color: #8B93A1;
      max-width: 34rem;
      margin: 0 0 1.75rem;
      animation: rise 800ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
    }

    .hero-cta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      animation: rise 800ms cubic-bezier(0.16, 1, 0.3, 1) 180ms both;
    }

    .cta-primary {
      min-height: 48px;
      padding-inline: 22px;
      font-size: 0.95rem;
      letter-spacing: -0.01em;
    }

    /* Product plane — dominant visual, not a card grid */
    .hero-product {
      animation: rise 900ms cubic-bezier(0.16, 1, 0.3, 1) 160ms both;
    }

    .product-stage {
      border: 1px solid rgba(255, 255, 255, 0.10);
      border-radius: 10px;
      background: linear-gradient(160deg, #12171F 0%, #0B0E13 100%);
      box-shadow:
        0 40px 80px rgba(0, 0, 0, 0.55),
        0 0 0 1px rgba(224, 122, 61, 0.08);
      overflow: hidden;
      transform: perspective(1200px) rotateY(-6deg) rotateX(3deg);
      transform-origin: left center;
      transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .product-stage:hover {
      transform: perspective(1200px) rotateY(-2deg) rotateX(1deg);
    }

    .stage-chrome {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.02);
    }

    .stage-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.18);
    }

    .stage-path {
      margin-left: 10px;
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: #8B93A1;
      letter-spacing: 0.02em;
    }

    .stage-body {
      display: grid;
      grid-template-columns: 112px 1fr;
      min-height: 280px;
    }

    .stage-rail {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 14px 10px;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.25);
    }

    .rail-step {
      font-family: var(--font-mono);
      font-size: 0.62rem;
      color: #5A6A7A;
      padding: 8px 8px;
      border-radius: 4px;
    }

    .rail-step.active {
      color: #F2F0EB;
      background: rgba(224, 122, 61, 0.16);
      box-shadow: inset 2px 0 0 #E07A3D;
    }

    .stage-canvas {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .canvas-block {
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.06);
    }

    .title-block {
      height: 28px;
      width: 55%;
      background: linear-gradient(90deg, rgba(242, 240, 235, 0.22), rgba(242, 240, 235, 0.06));
    }

    .canvas-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
    }

    .swatch-a { height: 72px; background: #145C45; }
    .swatch-b { height: 72px; background: #FFE600; }
    .swatch-c { height: 72px; background: #1B3A4B; }

    .wide-block {
      height: 48px;
      background: linear-gradient(90deg, rgba(224, 122, 61, 0.35), rgba(201, 162, 39, 0.12));
    }

    .canvas-status {
      margin-top: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: #C9A227;
    }

    .status-pulse {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #C9A227;
      box-shadow: 0 0 0 0 rgba(201, 162, 39, 0.5);
      animation: pulse 2.2s ease-out infinite;
    }

    /* —— Studio: calm density —— */
    .studio {
      width: min(1200px, calc(100% - 48px));
      margin: 0 auto;
      outline: none;
    }

    .studio-toolbar {
      position: sticky;
      top: 56px;
      z-index: 40;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 16px;
      padding: 14px 16px;
      margin-bottom: 20px;
      background: color-mix(in srgb, var(--color-surface) 92%, transparent);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      backdrop-filter: blur(10px);
    }

    .studio-label {
      font-size: 0.95rem;
      font-weight: 650;
      letter-spacing: -0.02em;
      margin: 0;
      color: var(--color-text-main);
    }

    .studio-hint {
      margin: 2px 0 0;
      font-size: 0.72rem;
      color: var(--color-text-muted);
    }

    .toolbar-modes {
      display: inline-flex;
      padding: 3px;
      gap: 2px;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-btn);
    }

    .mode-tab {
      min-height: 32px;
      padding: 0 14px;
      border-radius: 3px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-muted);
      background: transparent;
      border: none;
      cursor: pointer;
    }

    .mode-tab.active {
      background: var(--color-surface-muted);
      color: var(--color-text-main);
    }

    .toolbar-payload {
      justify-self: end;
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--color-accent);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toolbar-payload .sep {
      color: var(--color-text-muted);
    }

    .flow-rail {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 6px 18px;
      margin: 0 0 28px;
      padding: 0 4px;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 14px;
    }

    .flow-item {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.75rem;
      font-weight: 550;
      color: var(--color-text-muted);
      letter-spacing: -0.01em;
    }

    .flow-num {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--color-primary);
    }

    .studio-body {
      display: flex;
      flex-direction: column;
      gap: 40px;
    }

    @keyframes rise {
      from { opacity: 0; transform: translateY(22px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes mesh-breathe {
      0%, 100% { transform: scale(1) translate(0, 0); }
      50% { transform: scale(1.04) translate(-1%, 1%); }
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(201, 162, 39, 0.45); }
      70% { box-shadow: 0 0 0 10px rgba(201, 162, 39, 0); }
      100% { box-shadow: 0 0 0 0 rgba(201, 162, 39, 0); }
    }

    @media (max-width: 900px) {
      .hero-layout {
        grid-template-columns: 1fr;
        padding-top: 72px;
      }
      .product-stage {
        transform: none;
      }
      .product-stage:hover {
        transform: none;
      }
      .studio-toolbar {
        grid-template-columns: 1fr;
        justify-items: start;
      }
      .toolbar-payload {
        justify-self: start;
      }
    }
  `],
})
export class FactoryPortalComponent {
  private readonly state = inject(FactoryStateService);
  private readonly studioAnchor = viewChild<ElementRef<HTMLElement>>('studioAnchor');

  readonly isJsonMode = this.state.isJsonMode;
  readonly siteType = this.state.siteType;
  readonly designPreset = this.state.designPreset;

  setMode(isJson: boolean): void {
    if (this.isJsonMode() !== isJson) {
      this.state.toggleJsonMode();
    }
  }

  openStudio(): void {
    this.setMode(false);
    this.scrollToStudio();
  }

  openJson(): void {
    this.setMode(true);
    this.scrollToStudio();
  }

  private scrollToStudio(): void {
    const el = this.studioAnchor()?.nativeElement;
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el?.focus({ preventScroll: true });
  }
}
