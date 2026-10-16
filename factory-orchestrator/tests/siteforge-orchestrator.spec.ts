import { describe, it, expect, vi } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import {
  SiteForgeOrchestrator,
  runSiteForgeFactory,
} from '../src/orchestrator/siteforge-orchestrator.js';
import type { StageProgress } from '../src/types.js';

describe('SiteForgeOrchestrator', () => {
  const validPayload = {
    version: '1.0.0',
    siteType: 'learning_platform',
    designPreset: 'warm-organic',
    theme: {
      topic: 'Home Plants Care',
      name: 'PlantCare Academy',
      tagline: 'Cultivate your indoor jungle',
      description: 'Master houseplant health with expert guides.',
      branding: {
        primaryColor: '#2D5A27',
        secondaryColor: '#E8F5E9',
      },
    },
    integrations: {
      github: {
        repoName: 'test-plantcare-academy',
      },
      vercel: {
        projectName: 'test-plantcare-academy',
      },
    },
  };

  it('should successfully orchestrate end-to-end generation in dry-run mode', async () => {
    const orchestrator = new SiteForgeOrchestrator();
    const progressLogs: StageProgress[] = [];

    const result = await orchestrator.orchestrate(validPayload, {
      dryRun: true,
      onProgress: (p) => progressLogs.push(p),
    });

    expect(result.success).toBe(true);
    expect(result.projectName).toBe('test-plantcare-academy');
    expect(result.siteType).toBe('learning_platform');
    expect(result.designPreset).toBe('warm-organic');
    expect(result.dryRun).toBe(true);

    // Verify all stages completed
    expect(result.stages.VALIDATION.state).toBe('COMPLETED');
    expect(result.stages.SCAFFOLDING.state).toBe('COMPLETED');
    expect(result.stages.GITHUB_SYNC.state).toBe('COMPLETED');
    expect(result.stages.VERCEL_DEPLOY.state).toBe('COMPLETED');
    expect(result.stages.DELIVERY_VERIFICATION.state).toBe('COMPLETED');

    // Verify artifacts collected
    expect(result.artifacts.scaffolding?.filesCount).toBeGreaterThan(10);
    expect(result.artifacts.github?.repositoryUrl).toContain('test-plantcare-academy');
    expect(result.artifacts.github?.commitSha).toBeDefined();
    expect(result.artifacts.vercel?.canonicalUrl || result.artifacts.vercel?.liveUrl).toContain('vercel.app');

    // Verify progress callbacks
    expect(progressLogs.length).toBeGreaterThanOrEqual(5);
    const stagesReported = new Set(progressLogs.map((p) => p.stage));
    expect(stagesReported.has('VALIDATION')).toBe(true);
    expect(stagesReported.has('SCAFFOLDING')).toBe(true);
    expect(stagesReported.has('GITHUB_SYNC')).toBe(true);
    expect(stagesReported.has('VERCEL_DEPLOY')).toBe(true);
  });

  it('should fail fast on invalid payload schema and report stage failure', async () => {
    const orchestrator = new SiteForgeOrchestrator();
    const invalidPayload = {
      version: '9.9.9', // invalid version
      siteType: 'invalid_type',
    };

    const result = await orchestrator.orchestrate(invalidPayload, { dryRun: true });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Validation failed');
    expect(result.stages.VALIDATION.state).toBe('FAILED');
    expect(result.stages.SCAFFOLDING.state).toBe('PENDING');
  });

  it('should respect skipGithub and skipVercel flags', async () => {
    const orchestrator = new SiteForgeOrchestrator();

    const result = await orchestrator.orchestrate(validPayload, {
      dryRun: true,
      skipGithub: true,
      skipVercel: true,
    });

    expect(result.success).toBe(true);
    expect(result.stages.GITHUB_SYNC.state).toBe('SKIPPED');
    expect(result.stages.VERCEL_DEPLOY.state).toBe('SKIPPED');
    expect(result.artifacts.github).toBeUndefined();
    expect(result.artifacts.vercel).toBeUndefined();
  });

  it('should support repoNameOverride and custom working directory', async () => {
    const tempDir = path.join(os.tmpdir(), `sf-orch-test-${Date.now()}`);
    const orchestrator = new SiteForgeOrchestrator();

    const result = await orchestrator.orchestrate(validPayload, {
      dryRun: true,
      repoNameOverride: 'custom-overridden-repo',
      workingDirectory: tempDir,
      keepStaging: true,
    });

    expect(result.success).toBe(true);
    expect(result.projectName).toBe('custom-overridden-repo');
    expect(fs.existsSync(tempDir)).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'src/design-tokens.css'))).toBe(true);

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should run via static runSiteForgeFactory helper', async () => {
    const result = await runSiteForgeFactory(validPayload, { dryRun: true });
    expect(result.success).toBe(true);
    expect(result.projectName).toBe('test-plantcare-academy');
  });
});
