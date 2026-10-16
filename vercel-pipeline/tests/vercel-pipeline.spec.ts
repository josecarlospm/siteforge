import { describe, it, expect, vi } from 'vitest';
import { VercelPipeline } from '../src/pipeline/vercel-pipeline.js';
import { VercelClient } from '../src/client/vercel-client.js';
import { VercelDeployment, VercelProject } from '../src/types.js';

describe('VercelPipeline', () => {
  const samplePayload = {
    version: '1.0.0',
    siteType: 'learning_platform',
    designPreset: 'warm-organic',
    theme: {
      topic: 'Houseplant care education',
      name: 'PlantCare Academy',
      tagline: 'Flourish with flora',
      description: 'The premier houseplant e-learning portal.',
    },
    integrations: {
      github: { repoName: 'plantcare-academy-web' },
      vercel: { projectName: 'plantcare-academy' },
    },
  };

  it('should execute successfully in dry-run mode without network calls', async () => {
    const pipeline = new VercelPipeline();
    const result = await pipeline.runDeploy({
      payload: samplePayload,
      dryRun: true,
      commitSha: 'commit123456',
    });

    expect(result.success).toBe(true);
    expect(result.dryRun).toBe(true);
    expect(result.metadata.projectName).toBe('plantcare-academy');
    expect(result.metadata.liveUrl).toBe('https://plantcare-academy.vercel.app');
    expect(result.metadata.commitSha).toBe('commit123456');
    expect(result.metadata.framework).toBe('angular');
    expect(result.metadata.readyState).toBe('READY');
  });

  it('should reject invalid payload at the schema boundary', async () => {
    const pipeline = new VercelPipeline();
    const invalidPayload = {
      version: 'invalid',
    };

    await expect(
      pipeline.runDeploy({
        payload: invalidPayload,
      })
    ).rejects.toThrow('Payload validation failed');
  });

  it('should orchestrate full project creation, env injection, deployment trigger, and polling', async () => {
    const mockProject: VercelProject = {
      id: 'prj_live_123',
      name: 'plantcare-academy',
      framework: 'angular',
      buildCommand: 'npm run build',
      outputDirectory: 'dist/plantcare-academy/browser',
      link: {
        type: 'github',
        repo: 'josecarlospm/plantcare-academy-web',
        repoId: 12345678,
      },
      targets: {
        production: {
          alias: ['plantcare-academy.vercel.app'],
        },
      },
    };

    const mockDeployment: VercelDeployment = {
      id: 'dpl_live_999',
      name: 'plantcare-academy',
      url: 'plantcare-academy-live-abc.vercel.app',
      readyState: 'READY',
      target: 'production',
      alias: ['plantcare-academy.vercel.app'],
      createdAt: 1700000000000,
      buildingAt: 1700000001000,
      readyAt: 1700000018000,
      meta: {
        githubCommitSha: 'sha-live-1234',
      },
    };

    const mockClient = {
      getProject: vi.fn(async () => null), // initially doesn't exist
      createProject: vi.fn(async () => mockProject),
      linkGitHubRepo: vi.fn(async () => mockProject),
      listProjectEnvs: vi.fn(async () => []),
      upsertProjectEnv: vi.fn(async () => ({ key: 'TEST', value: '1' })),
      createDeployment: vi.fn(async () => mockDeployment),
      getDeployment: vi.fn(async () => mockDeployment),
      listDeployments: vi.fn(async () => [mockDeployment]),
      findDeploymentByCommitSha: vi.fn(async () => mockDeployment),
    } as unknown as VercelClient;

    const pipeline = new VercelPipeline(mockClient);
    const progressPhases: string[] = [];

    const result = await pipeline.runDeploy({
      payload: samplePayload,
      commitSha: 'sha-live-1234',
      onProgress: (p) => {
        progressPhases.push(p.phase);
      },
    });

    expect(result.success).toBe(true);
    expect(result.metadata.liveUrl).toBe('https://plantcare-academy.vercel.app');
    expect(result.metadata.deploymentId).toBe('dpl_live_999');
    expect(result.metadata.buildDurationMs).toBe(17000);
    expect(result.metadata.buildDurationFormatted).toBe('17.0s');
    expect(result.metadata.commitSha).toBe('sha-live-1234');

    expect(progressPhases).toContain('INITIALIZATION');
    expect(progressPhases).toContain('PROJECT_CREATION');
    expect(progressPhases).toContain('ENV_CONFIGURATION');
    expect(progressPhases).toContain('DEPLOYMENT_TRIGGER');
    expect(progressPhases).toContain('POLLING');
  });
});
