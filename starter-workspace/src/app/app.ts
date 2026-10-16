import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryPortalComponent } from './factory-portal/factory-portal.component';
import { PlantCareShowcaseComponent } from './showcase/plantcare/plantcare-showcase.component';
import { CtoTelemetryComponent } from './cto-telemetry/cto-telemetry.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FactoryPortalComponent,
    PlantCareShowcaseComponent,
    CtoTelemetryComponent,
  ],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  readonly title = 'SiteForge — The Autonomous Angular Web Factory';
  readonly activeTab = signal<'portal' | 'showcase' | 'telemetry'>('portal');

  setTab(tab: 'portal' | 'showcase' | 'telemetry'): void {
    this.activeTab.set(tab);
  }
}
