import { Component } from '@angular/core';
import { PlantCareShowcaseComponent } from './showcase/plantcare/plantcare-showcase.component';

@Component({
  imports: [PlantCareShowcaseComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  readonly title = 'SiteForge - Angular 19+ Scaffolding Engine';
}
