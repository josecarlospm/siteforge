import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FactoryPortalComponent } from './factory-portal.component';
import { FactoryStateService } from './services/factory-state.service';
import { ThemeService } from '../core/services/theme.service';
import { ARCHETYPES } from './models/factory.model';
import { DESIGN_PRESETS } from '../core/models/design-tokens.model';

describe('SiteForge Self-Serve Web Factory Portal', () => {
  let stateService: FactoryStateService;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryPortalComponent],
      providers: [
        provideZonelessChangeDetection(),
        FactoryStateService,
        ThemeService,
      ],
    }).compileComponents();

    stateService = TestBed.inject(FactoryStateService);
    themeService = TestBed.inject(ThemeService);
    // SF-11: portal chrome is Forge Night; payload preset stays independent
    themeService.setPreset('modern-saas-dark');
  });

  it('should initialize factory state with default learning_platform and warm-organic preset', () => {
    expect(stateService.siteType()).toBe('learning_platform');
    expect(stateService.designPreset()).toBe('warm-organic');
    expect(stateService.siteName()).toBe('PlantCare Academy');
    expect(stateService.githubRepo()).toBe('plantcare-academy-web');
    expect(stateService.vercelProject()).toBe('plantcare-academy');

    const payload = stateService.payloadObject();
    expect(payload.version).toBe('1.0.0');
    expect(payload.siteType).toBe('learning_platform');
    expect(payload.designPreset).toBe('warm-organic');
    expect(payload.theme.topic).toContain('Houseplant');
  });

  it('should support switching between all 6 website archetypes', () => {
    expect(ARCHETYPES.length).toBe(6);

    for (const arch of ARCHETYPES) {
      stateService.setSiteType(arch.type);
      expect(stateService.siteType()).toBe(arch.type);
      expect(stateService.payloadObject().siteType).toBe(arch.type);
    }
  });

  it('should update payload preset without leaving Forge Night portal shell', () => {
    expect(themeService.currentPreset()).toBe('modern-saas-dark');

    stateService.setPreset('neo-brutalist');
    expect(stateService.designPreset()).toBe('neo-brutalist');
    expect(stateService.primaryColor()).toBe(DESIGN_PRESETS['neo-brutalist'].colors.primary);
    expect(themeService.currentPreset()).toBe('modern-saas-dark');

    stateService.setPreset('modern-saas-dark');
    expect(stateService.designPreset()).toBe('modern-saas-dark');
    expect(stateService.primaryColor()).toBe(DESIGN_PRESETS['modern-saas-dark'].colors.primary);
    expect(themeService.currentPreset()).toBe('modern-saas-dark');
  });

  it('should synchronize two-way between fields and JSON string editor', () => {
    stateService.updateField('siteName', 'Quantum CMS');
    expect(stateService.rawJsonString()).toContain('Quantum CMS');

    const updatedJson = JSON.stringify({
      version: '1.0.0',
      siteType: 'blog',
      designPreset: 'clean-editorial',
      theme: {
        topic: 'Astrophysics',
        name: 'Cosmos Today',
        tagline: 'Exploring deep space',
        description: 'Astronomy journal',
      },
      integrations: {
        github: { repoName: 'cosmos-today-blog' },
        vercel: { projectName: 'cosmos-today' },
      },
    });

    stateService.updateRawJson(updatedJson);
    expect(stateService.siteType()).toBe('blog');
    expect(stateService.designPreset()).toBe('clean-editorial');
    expect(stateService.siteName()).toBe('Cosmos Today');
    expect(stateService.topic()).toBe('Astrophysics');
    expect(stateService.jsonError()).toBeNull();
  });

  it('should execute pipeline runner under SLA and output live deployment URLs', async () => {
    expect(stateService.isGenerating()).toBe(false);

    const genPromise = stateService.triggerGeneration();
    expect(stateService.isGenerating()).toBe(true);

    await genPromise;

    expect(stateService.isGenerating()).toBe(false);
    expect(stateService.progressPercentage()).toBe(100);

    const result = stateService.generationResult();
    expect(result).not.toBeNull();
    expect(result?.vercelUrl).toContain('.vercel.app');
    expect(result?.githubUrl).toContain('github.com/josecarlospm/');
    expect(result?.durationMs).toBeLessThan(180000);

    for (const stage of stateService.stages()) {
      expect(stage.status).toBe('completed');
    }
  });

  it('should render brand-led hero without anti-slop chrome', () => {
    const fixture = TestBed.createComponent(FactoryPortalComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.portal-hero')).toBeTruthy();
    expect(compiled.querySelector('.hero-brand')).toBeTruthy();
    expect(compiled.querySelector('.hero-stats')).toBeNull();
    expect(compiled.querySelector('.stat-pill')).toBeNull();
    expect(compiled.querySelector('sf-archetype-selector')).toBeTruthy();
    expect(compiled.querySelector('sf-preset-selector')).toBeTruthy();
    expect(compiled.querySelector('sf-theme-editor')).toBeTruthy();
    expect(compiled.querySelector('sf-connection-cards')).toBeTruthy();
    expect(compiled.querySelector('sf-pipeline-runner')).toBeTruthy();
    expect(compiled.textContent).toContain('SiteForge');

    const brand = compiled.querySelector('.hero-brand');
    expect(brand?.textContent?.trim()).toBe('SiteForge');
    expect(compiled.querySelectorAll('.preset-preview').length).toBe(5);
    expect(compiled.textContent).toContain('designPreset');
  });
});
