import { Component, inject, OnInit, signal } from '@angular/core';
import { FactoryPortalComponent } from './factory-portal/factory-portal.component';
import { PlantCareShowcaseComponent } from './showcase/plantcare/plantcare-showcase.component';
import { CtoTelemetryComponent } from './cto-telemetry/cto-telemetry.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    FactoryPortalComponent,
    PlantCareShowcaseComponent,
    CtoTelemetryComponent,
  ],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly theme = inject(ThemeService);

  readonly title = 'SiteForge — The Autonomous Angular Web Factory';
  readonly activeTab = signal<'portal' | 'showcase' | 'telemetry'>('portal');

  ngOnInit(): void {
    // SF-11 / Design.md: factory portal shell defaults to Forge Night
    this.theme.setPreset('modern-saas-dark');
  }

  setTab(tab: 'portal' | 'showcase' | 'telemetry'): void {
    this.activeTab.set(tab);
    if (tab === 'portal') {
      this.theme.setPreset('modern-saas-dark');
    } else if (tab === 'showcase') {
      this.theme.setPreset('warm-organic');
    }
  }
}
