import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { ProjectGenerator, SiteForgePayloadInput } from '../src/generator/project-generator.js';
import { SiteType } from '../src/templates/archetype-templates.js';

describe('ProjectGenerator', () => {
  const testOutputDir = path.join(__dirname, '../.tmp-test-output');

  beforeEach(() => {
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testOutputDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  const validPayload: SiteForgePayloadInput = {
    version: '1.0.0',
    siteType: 'learning_platform',
    designPreset: 'warm-organic',
    theme: {
      topic: 'Indoor Houseplant Care',
      name: 'PlantCare Academy',
      tagline: 'Keep Your Jungle Thriving',
      description: 'Science-backed care guides and masterclasses for indoor plant parents.',
    },
    integrations: {
      github: { repoName: 'plantcare-academy-web' },
      vercel: { projectName: 'plantcare-academy' },
    },
  };

  it('should validate valid payload successfully', () => {
    const res = ProjectGenerator.validatePayload(validPayload);
    expect(res.valid).toBe(true);
    expect(res.errors.length).toBe(0);
  });

  it('should reject invalid payload missing required fields', () => {
    const invalid = { version: '2.0.0', siteType: 'invalid_type' };
    const res = ProjectGenerator.validatePayload(invalid);
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
  });

  it('should generate complete Angular workspace for learning_platform', () => {
    const targetDir = path.join(testOutputDir, 'plantcare');
    const result = ProjectGenerator.generateProject(validPayload, targetDir);

    expect(result.success).toBe(true);
    expect(result.projectName).toBe('plantcare-academy-web');
    expect(result.filesGenerated.length).toBeGreaterThan(8);

    // Verify critical files exist
    expect(fs.existsSync(path.join(targetDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'angular.json'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'vercel.json'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'src/main.ts'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'src/design-tokens.css'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'src/app/app.config.ts'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, 'src/app/archetype-view.component.ts'))).toBe(true);

    // Verify Vercel deployment configuration
    const vercelConfig = JSON.parse(
      fs.readFileSync(path.join(targetDir, 'vercel.json'), 'utf-8')
    );
    expect(vercelConfig.framework).toBe('angular');
    expect(vercelConfig.outputDirectory).toBe('dist/plantcare-academy-web/browser');
    expect(vercelConfig.cleanUrls).toBe(true);
    expect(vercelConfig.routes).toHaveLength(2);

    // Verify zoneless change detection and standalone architecture
    const appConfig = fs.readFileSync(path.join(targetDir, 'src/app/app.config.ts'), 'utf-8');
    expect(appConfig).toContain('provideZonelessChangeDetection()');

    const appTs = fs.readFileSync(path.join(targetDir, 'src/app/app.ts'), 'utf-8');
    expect(appTs).toContain('@Component');
    expect(appTs).toContain('ArchetypeViewComponent');

    const tokensCss = fs.readFileSync(path.join(targetDir, 'src/design-tokens.css'), 'utf-8');
    expect(tokensCss).toContain('--color-primary: #145C45;');

    // Verify learning_platform comprehensive template structure
    const archetypeComponent = fs.readFileSync(
      path.join(targetDir, 'src/app/archetype-view.component.ts'),
      'utf-8'
    );
    expect(archetypeComponent).toContain('PlantCare Academy');
    expect(archetypeComponent).toContain('Interactive Lesson Detail Preview');
    expect(archetypeComponent).toContain('video-player-container');
    expect(archetypeComponent).toContain('Foot-Candles & Light Calculator');
    expect(archetypeComponent).toContain('Watering & Substrate Dynamic Matrix');
    expect(archetypeComponent).toContain('Seasonal Plant Care Alerts');
    expect(archetypeComponent).toContain('guideProgressPercent');
  });

  it('should scaffold projects across all 6 archetypes', () => {
    const siteTypes: SiteType[] = [
      'learning_platform',
      'blog',
      'newsletter',
      'ecommerce',
      'social_media',
      'landing_page',
    ];

    for (const siteType of siteTypes) {
      const payload: SiteForgePayloadInput = {
        ...validPayload,
        siteType,
        theme: {
          ...validPayload.theme,
          name: `Test-${siteType}`,
        },
      };

      const outDir = path.join(testOutputDir, siteType);
      const res = ProjectGenerator.generateProject(payload, outDir);
      expect(res.success).toBe(true);

      const componentCode = fs.readFileSync(
        path.join(outDir, 'src/app/archetype-view.component.ts'),
        'utf-8'
      );
      expect(componentCode).toContain('@Component');
      expect(componentCode).toContain('ArchetypeViewComponent');
    }
  });
});
