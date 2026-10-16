import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VercelClient } from '../src/client/vercel-client.js';

describe('VercelClient', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('should format URL and attach teamId and authorization headers', async () => {
    let capturedUrl = '';
    let capturedHeaders: Record<string, string> = {};

    globalThis.fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      capturedUrl = url.toString();
      capturedHeaders = init?.headers as Record<string, string>;
      return {
        ok: true,
        json: async () => ({ id: 'prj_1', name: 'my-project' }),
      } as Response;
    });

    const client = new VercelClient({
      token: 'test-token-123',
      teamId: 'team_xyz',
    });

    const project = await client.getProject('my-project');
    expect(project).toBeDefined();
    expect(project?.id).toBe('prj_1');
    expect(capturedUrl).toContain('https://api.vercel.com/v9/projects/my-project?teamId=team_xyz');
    expect(capturedHeaders['Authorization']).toBe('Bearer test-token-123');
  });

  it('should return null when getProject returns 404', async () => {
    globalThis.fetch = vi.fn(async () => {
      return {
        ok: false,
        status: 404,
        json: async () => ({ error: { message: 'Project not found' } }),
      } as Response;
    });

    const client = new VercelClient({ token: 'test' });
    const project = await client.getProject('non-existent');
    expect(project).toBeNull();
  });

  it('should create project with Angular framework preset', async () => {
    let capturedBody: any;
    globalThis.fetch = vi.fn(async (_url, init) => {
      capturedBody = JSON.parse(init?.body as string);
      return {
        ok: true,
        json: async () => ({ id: 'prj_new', ...capturedBody }),
      } as Response;
    });

    const client = new VercelClient({ token: 'test' });
    const res = await client.createProject({
      name: 'angular-showcase',
      framework: 'angular',
      buildCommand: 'npm run build',
      outputDirectory: 'dist/angular-showcase/browser',
      gitRepository: {
        type: 'github',
        repo: 'josecarlospm/angular-showcase',
      },
    });

    expect(res.id).toBe('prj_new');
    expect(capturedBody.framework).toBe('angular');
    expect(capturedBody.outputDirectory).toBe('dist/angular-showcase/browser');
    expect(capturedBody.gitRepository.repo).toBe('josecarlospm/angular-showcase');
  });

  it('should manage and upsert environment variables', async () => {
    let listCalled = false;
    let patchCalled = false;

    globalThis.fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      const urlStr = url.toString();
      if (init?.method === 'GET' && urlStr.includes('/env')) {
        listCalled = true;
        return {
          ok: true,
          json: async () => ({
            envs: [{ id: 'env_1', key: 'API_URL', value: 'https://old.api' }],
          }),
        } as Response;
      }
      if (init?.method === 'PATCH' && urlStr.includes('/env/env_1')) {
        patchCalled = true;
        return {
          ok: true,
          json: async () => ({ id: 'env_1', key: 'API_URL', value: 'https://new.api' }),
        } as Response;
      }
      return { ok: true, json: async () => ({}) } as Response;
    });

    const client = new VercelClient({ token: 'test' });
    await client.upsertProjectEnv('prj_1', {
      key: 'API_URL',
      value: 'https://new.api',
      type: 'plain',
    });

    expect(listCalled).toBe(true);
    expect(patchCalled).toBe(true);
  });
});
