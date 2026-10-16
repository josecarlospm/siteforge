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
    expect(themeService.currentTokens().displayName).toBe('Greenhouse Lab');
    expect(themeService.currentTokens().colors.bg).toBe('#E7EEEA');
    expect(themeService.currentTokens().colors.accent).toBe('#1A5F7A');

    themeService.setPreset('neo-brutalist');
    expect(themeService.currentPreset()).toBe('neo-brutalist');
    expect(themeService.currentTokens().shape.borderWidth).toBe('3px');
    expect(themeService.currentTokens().shape.radiusCard).toBe('0px');
    expect(themeService.currentTokens().colors.secondary).toBe('#00C2A8');

    themeService.setPreset('modern-saas-dark');
    expect(themeService.currentPreset()).toBe('modern-saas-dark');
    expect(themeService.currentTokens().colors.bg).toBe('#0E1116');
    expect(themeService.currentTokens().colors.primary).toBe('#E07A3D');

    themeService.setPreset('clean-editorial');
    expect(themeService.currentPreset()).toBe('clean-editorial');
    expect(themeService.currentTokens().colors.primary).toBe('#1B3A4B');

    themeService.setPreset('corporate-enterprise');
    expect(themeService.currentPreset()).toBe('corporate-enterprise');
    expect(themeService.currentTokens().colors.primary).toBe('#0D5C63');
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

    payloadService.setSearchQuery('monstera');
    expect(payloadService.filteredCourses().length).toBe(1);
    expect(payloadService.filteredCourses()[0].id).toBe('course-monstera-101');

    payloadService.setSearchQuery('');
    payloadService.setSelectedCategory('Pest Eradication');
    expect(payloadService.filteredCourses().length).toBe(1);
    expect(payloadService.filteredCourses()[0].id).toBe('course-pest-defense');
  });

  it('should render the SF-10 PlantCare Greenhouse Lab reference', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('sf-plantcare-showcase')).toBeTruthy();
    expect(compiled.querySelector('.reference-banner')).toBeTruthy();
    expect(compiled.querySelector('.hero-brand')).toBeTruthy();
    expect(compiled.querySelector('#catalog')).toBeTruthy();
    expect(compiled.querySelector('#lesson-preview')).toBeTruthy();
    expect(compiled.querySelector('.player')).toBeTruthy();
    expect(compiled.querySelector('.guide')).toBeTruthy();
    expect(compiled.querySelector('#newsletter')).toBeTruthy();
    expect(compiled.textContent).toContain('PlantCare Academy');
    expect(compiled.textContent).toContain('Field lab for indoor growers');
    expect(compiled.textContent).toContain('designPreset: warm-organic');
  });

  it('should manage interactive video player stub and step-by-step care checklist', () => {
    const fixture = TestBed.createComponent(PlantCareShowcaseComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isPlaying()).toBe(false);
    expect(component.isMuted()).toBe(false);
    expect(component.playbackSpeed()).toBe('1x');
    expect(component.formattedPlaybackTime()).toBe('02:22');

    component.togglePlay();
    expect(component.isPlaying()).toBe(true);

    component.toggleMute();
    expect(component.isMuted()).toBe(true);

    component.cycleSpeed();
    expect(component.playbackSpeed()).toBe('1.25x');

    expect(component.completedSteps()).toEqual([1]);
    expect(component.guideProgressPercent()).toBe(25);

    component.toggleStep(2);
    component.toggleStep(3);
    expect(component.completedSteps()).toEqual([1, 2, 3]);
    expect(component.guideProgressPercent()).toBe(75);

    component.toggleStep(1);
    expect(component.completedSteps()).toEqual([2, 3]);
    expect(component.guideProgressPercent()).toBe(50);
  });

  it('should compute light diagnostics and watering dynamics matrix', () => {
    const fixture = TestBed.createComponent(PlantCareShowcaseComponent);
    const component = fixture.componentInstance;

    component.selectedOrientation.set('south');
    expect(component.currentLightData().footCandles).toContain('1,500');
    expect(component.currentLightData().recommendation.toLowerCase()).toContain('fiddle leaf');

    component.selectedOrientation.set('north');
    expect(component.currentLightData().footCandles).toContain('200');
    expect(component.currentLightData().recommendation.toLowerCase()).toContain('snake plant');

    component.selectedPot.set('terracotta');
    expect(component.currentWateringAdvice().frequency).toBe('Every 5 – 7 days');

    component.selectedPot.set('plastic');
    component.selectedSubstrate.set('succulent');
    expect(component.currentWateringAdvice().frequency).toBe('Every 14 – 21 days');

    component.selectedSubstrate.set('aroid');
    expect(component.currentWateringAdvice().frequency).toBe('Every 8 – 10 days');
  });

  it('should manage seasonal newsletter subscription state', () => {
    const fixture = TestBed.createComponent(PlantCareShowcaseComponent);
    const component = fixture.componentInstance;

    expect(component.selectedSeason()).toBe('spring');
    expect(component.currentSeasonTip().name).toBe('Spring');
    expect(component.isSubscribed()).toBe(false);

    component.selectedSeason.set('autumn');
    expect(component.currentSeasonTip().name).toBe('Autumn');
    expect(component.currentSeasonTip().focus.toLowerCase()).toContain('daylight transition');

    component.newsletterEmail.set('botanist@plantcare.academy');
    component.onSubscribe(new Event('submit'));
    expect(component.isSubscribed()).toBe(true);
  });
});
