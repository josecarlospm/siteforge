import { describe, it, expect, vi } from 'vitest';
import { DeploymentPoller } from '../src/deployment/deployment-poller.js';
import { VercelClient } from '../src/client/vercel-client.js';
import { VercelDeployment } from '../src/types.js';

describe('DeploymentPoller', () => {
  it('should resolve when deployment reaches READY state', async () => {
    let callCount = 0;
    const mockClient = {
      getDeployment: vi.fn(async () => {
        callCount++;
        if (callCount === 1) {
          return { id: 'dpl_1', readyState: 'QUEUED', url: 'test.vercel.app' } as VercelDeployment;
        }
        if (callCount === 2) {
          return { id: 'dpl_1', readyState: 'BUILDING', url: 'test.vercel.app' } as VercelDeployment;
        }
        return { id: 'dpl_1', readyState: 'READY', url: 'test.vercel.app' } as VercelDeployment;
      }),
    } as unknown as VercelClient;

    const progressLogs: string[] = [];
    const deployment = await DeploymentPoller.pollUntilReady({
      deploymentId: 'dpl_1',
      client: mockClient,
      intervalMs: 10,
      timeoutMs: 1000,
      onProgress: (p) => {
        progressLogs.push(p.state);
      },
    });

    expect(deployment.readyState).toBe('READY');
    expect(callCount).toBe(3);
    expect(progressLogs).toContain('QUEUED');
    expect(progressLogs).toContain('BUILDING');
    expect(progressLogs).toContain('READY');
  });

  it('should throw immediately when deployment reaches ERROR state', async () => {
    const mockClient = {
      getDeployment: vi.fn(async () => ({
        id: 'dpl_fail',
        readyState: 'ERROR',
        errorCode: 'BUILD_FAILED',
        errorMessage: 'Syntax error in main.ts',
        url: 'test.vercel.app',
      })),
    } as unknown as VercelClient;

    await expect(
      DeploymentPoller.pollUntilReady({
        deploymentId: 'dpl_fail',
        client: mockClient,
        intervalMs: 10,
        timeoutMs: 500,
      })
    ).rejects.toThrow('Deployment dpl_fail failed with state "ERROR" (BUILD_FAILED)');
  });

  it('should timeout when deployment does not finish within allotted time', async () => {
    const mockClient = {
      getDeployment: vi.fn(async () => ({
        id: 'dpl_stuck',
        readyState: 'BUILDING',
        url: 'test.vercel.app',
      })),
    } as unknown as VercelClient;

    await expect(
      DeploymentPoller.pollUntilReady({
        deploymentId: 'dpl_stuck',
        client: mockClient,
        intervalMs: 10,
        timeoutMs: 35,
      })
    ).rejects.toThrow('Deployment polling timed out');
  });
});
