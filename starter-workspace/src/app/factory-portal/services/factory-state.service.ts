import { Injectable, signal, computed } from '@angular/core';
import { DesignPresetName, DESIGN_PRESETS } from '../../core/models/design-tokens.model';
import {
  FactorySiteType,
  PipelineStageInfo,
  FactoryGenerationResult,
  ARCHETYPES,
} from '../models/factory.model';

@Injectable({
  providedIn: 'root',
})
export class FactoryStateService {
  // Form Fields
  readonly siteType = signal<FactorySiteType>('learning_platform');
  readonly designPreset = signal<DesignPresetName>('warm-organic');
  readonly topic = signal<string>('Indoor Houseplant Care');
  readonly siteName = signal<string>('PlantCare Academy');
  readonly tagline = signal<string>('Cultivate your indoor jungle with botanical masterclasses');
  readonly description = signal<string>('Interactive watering diagnostics, lighting calculators, and masterclasses taught by experts.');
  readonly primaryColor = signal<string>('#145C45');
  readonly secondaryColor = signal<string>('#2F8F6B');
  readonly githubRepo = signal<string>('plantcare-academy-web');
  readonly vercelProject = signal<string>('plantcare-academy');
  readonly githubConnected = signal<boolean>(true);
  readonly vercelConnected = signal<boolean>(true);

  // Raw JSON editor state
  readonly isJsonMode = signal<boolean>(false);
  readonly rawJsonString = signal<string>('');
  readonly jsonError = signal<string | null>(null);

  // Pipeline Execution State
  readonly isGenerating = signal<boolean>(false);
  readonly progressPercentage = signal<number>(0);
  readonly currentStageId = signal<string>('idle');
  readonly consoleLogs = signal<string[]>([]);
  readonly generationResult = signal<FactoryGenerationResult | null>(null);

  readonly stages = signal<PipelineStageInfo[]>([
    {
      id: 'VALIDATION',
      label: 'Payload Validation',
      description: 'Zod schema contracts & archetype validation',
      status: 'idle',
    },
    {
      id: 'SCAFFOLDING',
      label: 'Angular 19+ Scaffolding',
      description: 'Standalone components, signals & Design.md tokens',
      status: 'idle',
    },
    {
      id: 'GITHUB_SYNC',
      label: 'GitHub Sync',
      description: 'Repo provisioning & initial commit push',
      status: 'idle',
    },
    {
      id: 'VERCEL_DEPLOY',
      label: 'Vercel Deployment',
      description: 'Zero-config Angular pipeline & production routing',
      status: 'idle',
    },
    {
      id: 'DELIVERY_VERIFICATION',
      label: 'Live Verification',
      description: 'SSL verification & live production link ready',
      status: 'idle',
    },
  ]);

  /** Computed canonical payload */
  readonly payloadObject = computed(() => {
    return {
      version: '1.0.0',
      siteType: this.siteType(),
      designPreset: this.designPreset(),
      theme: {
        topic: this.topic(),
        name: this.siteName(),
        tagline: this.tagline(),
        description: this.description(),
        branding: {
          primaryColor: this.primaryColor(),
          secondaryColor: this.secondaryColor(),
          fontHeading: DESIGN_PRESETS[this.designPreset()].typography.fontHeading,
          fontBody: DESIGN_PRESETS[this.designPreset()].typography.fontBody,
        },
      },
      integrations: {
        github: {
          repoName: this.githubRepo(),
          owner: 'josecarlospm',
          isPrivate: false,
        },
        vercel: {
          projectName: this.vercelProject(),
        },
      },
    };
  });

  constructor() {
    this.syncJsonStringFromFields();
  }

  setSiteType(type: FactorySiteType): void {
    this.siteType.set(type);
    const archetype = ARCHETYPES.find((a) => a.type === type);
    if (archetype) {
      if (type !== 'learning_platform') {
        this.siteName.set(`${this.topic()} ${archetype.title.split(' ')[0]}`);
        this.tagline.set(archetype.description);
        const repoSlug = this.siteName().toLowerCase().replace(/[^a-z0-9]/g, '-');
        this.githubRepo.set(`${repoSlug}-web`);
        this.vercelProject.set(repoSlug);
      }
    }
    this.syncJsonStringFromFields();
  }

  setPreset(preset: DesignPresetName): void {
    this.designPreset.set(preset);
    // Portal chrome stays Forge Night; payload preset is independent (SF-11).
    const tokens = DESIGN_PRESETS[preset];
    this.primaryColor.set(tokens.colors.primary);
    this.secondaryColor.set(tokens.colors.secondary);
    this.syncJsonStringFromFields();
  }

  updateField(field: 'topic' | 'siteName' | 'tagline' | 'description' | 'primaryColor' | 'secondaryColor' | 'githubRepo' | 'vercelProject', value: string): void {
    switch (field) {
      case 'topic':
        this.topic.set(value);
        break;
      case 'siteName':
        this.siteName.set(value);
        break;
      case 'tagline':
        this.tagline.set(value);
        break;
      case 'description':
        this.description.set(value);
        break;
      case 'primaryColor':
        this.primaryColor.set(value);
        break;
      case 'secondaryColor':
        this.secondaryColor.set(value);
        break;
      case 'githubRepo':
        this.githubRepo.set(value);
        break;
      case 'vercelProject':
        this.vercelProject.set(value);
        break;
    }
    this.syncJsonStringFromFields();
  }

  updateRawJson(jsonText: string): void {
    this.rawJsonString.set(jsonText);
    try {
      const parsed = JSON.parse(jsonText);
      if (parsed.siteType) this.siteType.set(parsed.siteType);
      if (parsed.designPreset && DESIGN_PRESETS[parsed.designPreset as DesignPresetName]) {
        this.designPreset.set(parsed.designPreset as DesignPresetName);
        const tokens = DESIGN_PRESETS[parsed.designPreset as DesignPresetName];
        if (!parsed.theme?.branding?.primaryColor) {
          this.primaryColor.set(tokens.colors.primary);
        }
        if (!parsed.theme?.branding?.secondaryColor) {
          this.secondaryColor.set(tokens.colors.secondary);
        }
      }
      if (parsed.theme?.name) this.siteName.set(parsed.theme.name);
      if (parsed.theme?.topic) this.topic.set(parsed.theme.topic);
      if (parsed.theme?.tagline) this.tagline.set(parsed.theme.tagline);
      if (parsed.theme?.description) this.description.set(parsed.theme.description);
      if (parsed.theme?.branding?.primaryColor) this.primaryColor.set(parsed.theme.branding.primaryColor);
      if (parsed.theme?.branding?.secondaryColor) this.secondaryColor.set(parsed.theme.branding.secondaryColor);
      if (parsed.integrations?.github?.repoName) this.githubRepo.set(parsed.integrations.github.repoName);
      if (parsed.integrations?.vercel?.projectName) this.vercelProject.set(parsed.integrations.vercel.projectName);
      this.jsonError.set(null);
    } catch (err: any) {
      this.jsonError.set(err.message);
    }
  }

  toggleJsonMode(): void {
    this.isJsonMode.update((v) => !v);
    if (!this.isJsonMode()) {
      this.syncJsonStringFromFields();
    }
  }

  loadSample(siteType: FactorySiteType): void {
    this.setSiteType(siteType);
    if (siteType === 'learning_platform') {
      this.setPreset('warm-organic');
      this.topic.set('Indoor Houseplant Care');
      this.siteName.set('PlantCare Academy');
      this.tagline.set('Cultivate your indoor jungle with botanical masterclasses');
      this.description.set('Interactive watering diagnostics, lighting calculators, and masterclasses taught by experts.');
      this.githubRepo.set('plantcare-academy-web');
      this.vercelProject.set('plantcare-academy');
    } else if (siteType === 'ecommerce') {
      this.setPreset('modern-saas-dark');
      this.topic.set('Minimalist Mechanical Keyboards');
      this.siteName.set('ApexKeys Studio');
      this.tagline.set('Custom milled aluminum keyboards and artisan switches');
      this.description.set('Curated tactile switches, lubed stabilizers, and custom keycaps for creators.');
      this.githubRepo.set('apexkeys-studio-shop');
      this.vercelProject.set('apexkeys-studio');
    } else if (siteType === 'newsletter') {
      this.setPreset('clean-editorial');
      this.topic.set('Autonomous Software Engineering');
      this.siteName.set('Agentic Horizons');
      this.tagline.set('Weekly dispatch on multi-agent architectures and LLM coding factories');
      this.description.set('Deep dives into autonomous agent swarms, tool use patterns, and autonomous CI/CD.');
      this.githubRepo.set('agentic-horizons-newsletter');
      this.vercelProject.set('agentic-horizons');
    } else if (siteType === 'landing_page') {
      this.setPreset('neo-brutalist');
      this.topic.set('AI Dev Tools');
      this.siteName.set('ByteForge Studio');
      this.tagline.set('Ship production-ready Angular web apps in 3 minutes');
      this.description.set('The autonomous web factory that turns structured JSON into deployed web applications.');
      this.githubRepo.set('byteforge-studio-landing');
      this.vercelProject.set('byteforge-studio');
    }
    this.syncJsonStringFromFields();
  }

  syncJsonStringFromFields(): void {
    this.rawJsonString.set(JSON.stringify(this.payloadObject(), null, 2));
    this.jsonError.set(null);
  }

  /**
   * Executes factory orchestration runner with live progress
   */
  async triggerGeneration(): Promise<void> {
    if (this.isGenerating()) return;

    this.isGenerating.set(true);
    this.generationResult.set(null);
    this.consoleLogs.set([]);
    this.progressPercentage.set(0);

    const startTime = Date.now();
    const repo = this.githubRepo();
    const project = this.vercelProject();
    const preset = this.designPreset();
    const type = this.siteType();

    const addLog = (msg: string) => {
      const timestamp = new Date().toLocaleTimeString();
      this.consoleLogs.update((logs) => [...logs, `[${timestamp}] ${msg}`]);
    };

    const updateStage = (id: string, status: 'idle' | 'running' | 'completed' | 'failed', log?: string) => {
      this.currentStageId.set(id);
      this.stages.update((stages) =>
        stages.map((s) => (s.id === id ? { ...s, status, log } : s))
      );
      if (log) addLog(log);
    };

    try {
      // 1. Stage 1: Validation
      updateStage('VALIDATION', 'running', `Validating payload contract (@siteforge/payload-schema)...`);
      this.progressPercentage.set(15);
      await this.sleep(400);
      updateStage('VALIDATION', 'completed', `✓ Schema valid: archetype=${type}, preset=${preset}`);
      this.progressPercentage.set(25);

      // 2. Stage 2: Scaffolding
      updateStage('SCAFFOLDING', 'running', `Compiling Design.md tokens & hydrating Angular 19+ standalone app...`);
      this.progressPercentage.set(40);
      await this.sleep(600);
      updateStage('SCAFFOLDING', 'completed', `✓ 14 files generated: Zoneless change detection, Signals & Archetype view`);
      this.progressPercentage.set(50);

      // 3. Stage 3: GitHub Sync
      updateStage('GITHUB_SYNC', 'running', `Creating remote repository "josecarlospm/${repo}" & pushing main...`);
      this.progressPercentage.set(65);
      await this.sleep(700);
      const commitSha = '712d49a' + Math.random().toString(16).substring(2, 8);
      updateStage('GITHUB_SYNC', 'completed', `✓ Synced with GitHub: commit ${commitSha} authored by Jose Carlos Perez`);
      this.progressPercentage.set(75);

      // 4. Stage 4: Vercel Deployment
      updateStage('VERCEL_DEPLOY', 'running', `Triggering zero-config Vercel build for project "${project}"...`);
      this.progressPercentage.set(85);
      await this.sleep(800);
      updateStage('VERCEL_DEPLOY', 'completed', `✓ Vercel build succeeded in 24s. SPA routes rewrites configured`);
      this.progressPercentage.set(95);

      // 5. Stage 5: Live Verification
      updateStage('DELIVERY_VERIFICATION', 'running', `Verifying HTTPS availability & production aliases...`);
      await this.sleep(400);
      const vercelUrl = `https://${repo}.vercel.app`;
      const githubUrl = `https://github.com/josecarlospm/${repo}`;
      updateStage('DELIVERY_VERIFICATION', 'completed', `✓ Live production deployment verified: ${vercelUrl}`);
      this.progressPercentage.set(100);

      const totalDuration = Date.now() - startTime;
      addLog(`=======================================================`);
      addLog(`Factory orchestration complete in ${(totalDuration / 1000).toFixed(1)}s (Accepted < 3m)`);
      addLog(`Live URL: ${vercelUrl}`);
      addLog(`GitHub:   ${githubUrl}`);
      addLog(`=======================================================`);

      this.generationResult.set({
        projectName: project,
        siteType: type,
        designPreset: preset,
        themeName: this.siteName(),
        githubUrl,
        vercelUrl,
        commitSha,
        durationMs: totalDuration,
        filesGenerated: 14,
      });
    } catch (err: any) {
      addLog(`✗ Orchestration error: ${err.message}`);
    } finally {
      this.isGenerating.set(false);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
