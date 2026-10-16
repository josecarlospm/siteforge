import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { App } from './app';
import { PlantCareShowcaseComponent } from './showcase/plantcare/plantcare-showcase.component';
import { ThemeService } from './core/services/theme.service';
import { PayloadService } from './core/services/payload.service';
import { DESIGN_PRESETS, DesignPresetName } from './core/models/design-tokens.model';

describe('SiteForge Starter Workspace', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, PlantCareShowcaseComponent],
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
    expect(compiled.querySelector('#lesson-preview')).toBeTruthy();
    expect(compiled.querySelector('.video-player-container')).toBeTruthy();
    expect(compiled.querySelector('.guide-container')).toBeTruthy();
    expect(compiled.querySelector('#newsletter')).toBeTruthy();
    expect(compiled.textContent).toContain('PlantCare Academy');
  });

  it('should manage interactive video player stub and step-by-step care checklist', () => {
    const fixture = TestBed.createComponent(PlantCareShowcaseComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    // Verify initial video player state
    expect(component.isPlaying()).toBe(false);
    expect(component.isMuted()).toBe(false);
    expect(component.playbackSpeed()).toBe('1x');
    expect(component.formattedPlaybackTime()).toBe('02:22');

    // Toggle play/pause
    component.togglePlay();
    expect(component.isPlaying()).toBe(true);

    // Toggle mute
    component.toggleMute();
    expect(component.isMuted()).toBe(true);

    // Cycle speed
    component.cycleSpeed();
    expect(component.playbackSpeed()).toBe('1.25x');

    // Step checklist verification
    expect(component.completedSteps()).toEqual([1]);
    expect(component.guideProgressPercent()).toBe(25);

    // Complete Step 2 and 3
    component.toggleStep(2);
    component.toggleStep(3);
    expect(component.completedSteps()).toEqual([1, 2, 3]);
    expect(component.guideProgressPercent()).toBe(75);

    // Uncheck Step 1
    component.toggleStep(1);
    expect(component.completedSteps()).toEqual([2, 3]);
    expect(component.guideProgressPercent()).toBe(50);
  });

  it('should compute light diagnostics and watering dynamics matrix', () => {
    const fixture = TestBed.createComponent(PlantCareShowcaseComponent);
    const component = fixture.componentInstance;

    // Light orientation
    component.selectedOrientation.set('south');
    expect(component.currentLightData().footCandles).toContain('1,500');
    expect(component.currentLightData().recommendation).toContain('Fiddle Leaf Fig');

    component.selectedOrientation.set('north');
    expect(component.currentLightData().footCandles).toContain('200');
    expect(component.currentLightData().recommendation).toContain('Snake Plant');

    // Watering dynamics matrix
    component.selectedPot.set('terracotta');
    expect(component.currentWateringAdvice().frequency).toBe('Every 5 – 7 Days');

    component.selectedPot.set('plastic');
    component.selectedSubstrate.set('succulent');
    expect(component.currentWateringAdvice().frequency).toBe('Every 14 – 21 Days');

    component.selectedSubstrate.set('aroid');
    expect(component.currentWateringAdvice().frequency).toBe('Every 8 – 10 Days');
  });

  it('should manage seasonal newsletter subscription state', () => {
    const fixture = TestBed.createComponent(PlantCareShowcaseComponent);
    const component = fixture.componentInstance;

    expect(component.selectedSeason()).toBe('spring');
    expect(component.currentSeasonTip().name).toBe('Spring');
    expect(component.isSubscribed()).toBe(false);

    // Switch season to Autumn
    component.selectedSeason.set('autumn');
    expect(component.currentSeasonTip().name).toBe('Autumn');
    expect(component.currentSeasonTip().focus).toContain('Daylight Transition');

    // Submit subscription
    component.newsletterEmail.set('botanist@plantcare.academy');
    component.onSubscribe(new Event('submit'));
    expect(component.isSubscribed()).toBe(true);
  });
});
