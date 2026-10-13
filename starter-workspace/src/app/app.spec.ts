import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { App } from './app';
import { ThemeService } from './core/services/theme.service';
import { PayloadService } from './core/services/payload.service';
import { DESIGN_PRESETS, DesignPresetName } from './core/models/design-tokens.model';

describe('SiteForge Starter Workspace', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        ThemeService,
        PayloadService,
      ],
    }).compileComponents();
  });

  it('should create the App component successfully', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    expect(app.title).toContain('SiteForge');
  });

  it('should initialize ThemeService with warm-organic preset and support dynamic switching', () => {
    const themeService = TestBed.inject(ThemeService);
    expect(themeService.currentPreset()).toBe('warm-organic');
    expect(themeService.currentTokens().displayName).toBe('Warm Organic');

    // Switch to neo-brutalist
    themeService.setPreset('neo-brutalist');
    expect(themeService.currentPreset()).toBe('neo-brutalist');
    expect(themeService.currentTokens().shape.borderWidth).toBe('3px');
    expect(themeService.currentTokens().shape.radiusCard).toBe('0px');

    // Switch to modern-saas-dark
    themeService.setPreset('modern-saas-dark');
    expect(themeService.currentPreset()).toBe('modern-saas-dark');
    expect(themeService.currentTokens().colors.bg).toBe('#09090B');

    // Switch to clean-editorial
    themeService.setPreset('clean-editorial');
    expect(themeService.currentPreset()).toBe('clean-editorial');
    expect(themeService.currentTokens().colors.primary).toBe('#7F1D1D');

    // Switch to corporate-enterprise
    themeService.setPreset('corporate-enterprise');
    expect(themeService.currentPreset()).toBe('corporate-enterprise');
    expect(themeService.currentTokens().colors.primary).toBe('#2563EB');
  });

  it('should manage 5 predefined Design.md presets', () => {
    const themeService = TestBed.inject(ThemeService);
    const presets = themeService.allPresets();
    expect(presets.length).toBe(5);

    const presetNames: DesignPresetName[] = [
      'warm-organic',
      'neo-brutalist',
      'clean-editorial',
      'modern-saas-dark',
      'corporate-enterprise',
    ];

    for (const name of presetNames) {
      expect(DESIGN_PRESETS[name]).toBeDefined();
      expect(DESIGN_PRESETS[name].colors.primary).toBeTruthy();
      expect(DESIGN_PRESETS[name].typography.fontHeading).toBeTruthy();
    }
  });

  it('should filter courses reactively in PayloadService', () => {
    const payloadService = TestBed.inject(PayloadService);
    expect(payloadService.payload().siteType).toBe('learning_platform');
    expect(payloadService.filteredCourses().length).toBe(3);

    // Filter by query "monstera"
    payloadService.setSearchQuery('monstera');
    expect(payloadService.filteredCourses().length).toBe(1);
    expect(payloadService.filteredCourses()[0].id).toBe('course-monstera-101');

    // Reset query and filter by category
    payloadService.setSearchQuery('');
    payloadService.setSelectedCategory('Pest Eradication');
    expect(payloadService.filteredCourses().length).toBe(1);
    expect(payloadService.filteredCourses()[0].id).toBe('course-pest-defense');
  });

  it('should render the PlantCare showcase layout cleanly', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('sf-header')).toBeTruthy();
    expect(compiled.querySelector('sf-hero')).toBeTruthy();
    expect(compiled.querySelector('sf-sidebar')).toBeTruthy();
    expect(compiled.querySelector('sf-footer')).toBeTruthy();
    expect(compiled.textContent).toContain('PlantCare Academy');
  });
});
