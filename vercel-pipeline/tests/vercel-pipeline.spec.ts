import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
      vercel: { projectName: 'plantcare-academy-web' },
    },
  };

  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('plantcare-academy-web.vercel.app') || url.includes('plantcare-academy-live-abc.vercel.app')) {
        return new Response('<html>ok</html>', { status: 200 });
      }
      if (url.includes('sso-protected')) {
        return new Response('Redirecting', {
          status: 302,
          headers: { location: 'https://vercel.com/sso-api?url=https://example.com' },
        });
      }
      return new Response('Not Found', {
        status: 404,
        headers: { 'x-vercel-error': 'DEPLOYMENT_NOT_FOUND' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should execute successfully in dry-run mode without network calls', async () => {
    const pipeline = new VercelPipeline();
    const result = await pipeline.runDeploy({
      payload: samplePayload,
      dryRun: true,
      commitSha: 'commit123456',
    });

    expect(result.success).toBe(true);
    expect(result.dryRun).toBe(true);
    expect(result.metadata.projectName).toBe('plantcare-academy-web');
    expect(result.metadata.liveUrl).toBe('https://plantcare-academy-web.vercel.app');
    expect(result.metadata.commitSha).toBe('commit123456');
    expect(result.metadata.framework).toBe('angular');
    expect(result.metadata.readyState).toBe('READY');
    expect(fetchMock).not.toHaveBeenCalled();
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
      name: 'plantcare-academy-web',
      framework: 'angular',
      buildCommand: 'npm run build',
      outputDirectory: 'dist/plantcare-academy-web/browser',
      link: {
        type: 'github',
        repo: 'josecarlospm/plantcare-academy-web',
        repoId: 12345678,
      },
      targets: {
        production: {
          alias: ['plantcare-academy-web.vercel.app'],
        },
      },
    };

    const mockDeployment: VercelDeployment = {
      id: 'dpl_live_999',
      name: 'plantcare-academy-web',
      url: 'plantcare-academy-live-abc.vercel.app',
      readyState: 'READY',
      target: 'production',
      alias: ['plantcare-academy-web.vercel.app'],
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

    // After create, getProject returns the project for alias refresh
    (mockClient.getProject as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(null)
      .mockResolvedValue(mockProject);

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
    expect(result.metadata.liveUrl).toBe('https://plantcare-academy-web.vercel.app');
    expect(result.metadata.deploymentId).toBe('dpl_live_999');
    expect(result.metadata.buildDurationMs).toBe(17000);
    expect(result.metadata.buildDurationFormatted).toBe('17.0s');
    expect(result.metadata.commitSha).toBe('sha-live-1234');

    expect(progressPhases).toContain('INITIALIZATION');
    expect(progressPhases).toContain('PROJECT_CREATION');
    expect(progressPhases).toContain('ENV_CONFIGURATION');
    expect(progressPhases).toContain('DEPLOYMENT_TRIGGER');
    expect(progressPhases).toContain('POLLING');
    expect(progressPhases).toContain('LIVE_URL_VERIFICATION');
  });

  it('should refuse to record unverified fallback aliases when project create is forbidden', async () => {
    const mockClient = {
      getProject: vi.fn(async () => null),
      createProject: vi.fn(async () => {
        const err = new Error("You don't have permission to create the project");
        (err as Error & { status: number }).status = 403;
        throw err;
      }),
    } as unknown as VercelClient;

    const pipeline = new VercelPipeline(mockClient);

    await expect(
      pipeline.runDeploy({
        payload: samplePayload,
        commitSha: 'sha-forbidden',
      })
    ).rejects.toThrow(/Refusing to record an unverified fallback alias/);
  });

  it('should fall back to a verified deployment host when production alias is not public', async () => {
    const mockProject: VercelProject = {
      id: 'prj_live_456',
      name: 'plantcare-academy-web',
      framework: 'angular',
      targets: {
        production: {
          alias: ['missing-alias.vercel.app'],
        },
      },
    };

    const mockDeployment: VercelDeployment = {
      id: 'dpl_live_456',
      name: 'plantcare-academy-web',
      url: 'plantcare-academy-live-abc.vercel.app',
      readyState: 'READY',
      target: 'production',
      createdAt: 1700000000000,
      buildingAt: 1700000001000,
      readyAt: 1700000018000,
    };

    const mockClient = {
      getProject: vi.fn(async () => mockProject),
      createProject: vi.fn(),
      linkGitHubRepo: vi.fn(async () => mockProject),
      upsertProjectEnv: vi.fn(async () => ({ key: 'TEST', value: '1' })),
      createDeployment: vi.fn(async () => mockDeployment),
      getDeployment: vi.fn(async () => mockDeployment),
      findDeploymentByCommitSha: vi.fn(async () => mockDeployment),
    } as unknown as VercelClient;

    const pipeline = new VercelPipeline(mockClient);
    const result = await pipeline.runDeploy({
      payload: samplePayload,
      commitSha: 'sha-fallback',
    });

    expect(result.metadata.liveUrl).toBe('https://plantcare-academy-live-abc.vercel.app');
  });
});
