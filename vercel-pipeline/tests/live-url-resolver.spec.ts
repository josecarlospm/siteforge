import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LiveUrlResolver } from '../src/deployment/live-url-resolver.js';
import { DeploymentPoller } from '../src/deployment/deployment-poller.js';
import { VercelDeployment, VercelProject } from '../src/types.js';

describe('LiveUrlResolver & SSO detection', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('public-ok.vercel.app')) {
          return new Response('ok', { status: 200 });
        }
        if (url.includes('protected.vercel.app')) {
          return new Response('SSO', {
            status: 302,
            headers: { location: 'https://vercel.com/sso-api?url=https://protected.vercel.app/' },
          });
        }
        return new Response('missing', {
          status: 404,
          headers: { 'x-vercel-error': 'DEPLOYMENT_NOT_FOUND' },
        });
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('detects Vercel SSO locations', () => {
    expect(DeploymentPoller.isVercelSsoLocation('https://vercel.com/sso-api?url=x')).toBe(true);
    expect(DeploymentPoller.isVercelSsoLocation('https://example.com/app')).toBe(false);
  });

  it('rejects SSO-protected hosts as not publicly live', async () => {
    const result = await DeploymentPoller.verifyUrlResponse('https://protected.vercel.app', 1, 1);
    expect(result.live).toBe(false);
    expect(result.protectedBySso).toBe(true);
  });

  it('resolves the first publicly verified candidate', async () => {
    const project: VercelProject = {
      id: 'prj_1',
      name: 'demo',
      targets: {
        production: { alias: ['missing.vercel.app', 'public-ok.vercel.app'] },
      },
    };
    const deployment: VercelDeployment = {
      id: 'dpl_1',
      name: 'demo',
      url: 'deployment-hash.vercel.app',
      readyState: 'READY',
      target: 'production',
    };

    const resolved = await LiveUrlResolver.resolveVerified(project, deployment, {
      maxRetries: 1,
      delayMs: 1,
    });
    expect(resolved.liveUrl).toBe('https://public-ok.vercel.app');
    expect(resolved.verified).toBe(true);
  });

  it('throws when no candidate is publicly reachable', async () => {
    const project: VercelProject = {
      id: 'prj_1',
      name: 'demo',
      targets: { production: { alias: ['missing.vercel.app'] } },
    };
    const deployment: VercelDeployment = {
      id: 'dpl_1',
      name: 'demo',
      url: 'also-missing.vercel.app',
      readyState: 'READY',
      target: 'production',
    };

    await expect(
      LiveUrlResolver.resolveVerified(project, deployment, { maxRetries: 1, delayMs: 1 })
    ).rejects.toThrow(/No publicly verified production URL/);
  });
});
