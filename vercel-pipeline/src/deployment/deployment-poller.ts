import { VercelClient } from '../client/vercel-client.js';
import { VercelDeployment, VercelDeploymentState } from '../types.js';

export interface PollDeploymentOptions {
  deploymentId: string;
  client: VercelClient;
  timeoutMs?: number;
  intervalMs?: number;
  onProgress?: (progress: {
    state: VercelDeploymentState;
    elapsedMs: number;
    deploymentId: string;
    url?: string;
  }) => void;
  verifyHttpLive?: boolean;
}

export class DeploymentPoller {
  private static terminalSuccessStates: VercelDeploymentState[] = ['READY'];
  private static terminalFailureStates: VercelDeploymentState[] = ['ERROR', 'CANCELED'];

  /**
   * Helper sleep function
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Verifies that the deployed HTTPS URL responds with HTTP 200 OK
   */
  static async verifyUrlResponse(
    url: string,
    maxRetries = 5,
    delayMs = 1500
  ): Promise<{ live: boolean; statusCode?: number; error?: string }> {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'SiteForge-Deployment-Verifier/1.0',
          },
          redirect: 'follow',
        });

        if (res.status >= 200 && res.status < 400) {
          return { live: true, statusCode: res.status };
        }
      } catch (err) {
        if (attempt === maxRetries) {
          return { live: false, error: err instanceof Error ? err.message : String(err) };
        }
      }
      await this.sleep(delayMs);
    }

    return { live: false, error: `Endpoint did not return 2xx after ${maxRetries} attempts` };
  }

  /**
   * Polls deployment until READY, ERROR, CANCELED, or timeout
   */
  static async pollUntilReady(options: PollDeploymentOptions): Promise<VercelDeployment> {
    const { deploymentId, client } = options;
    const timeoutMs = options.timeoutMs ?? 180000; // 3 minutes default
    const intervalMs = options.intervalMs ?? 2000;  // 2s default
    const startTime = Date.now();

    while (true) {
      const elapsedMs = Date.now() - startTime;
      if (elapsedMs > timeoutMs) {
        throw new Error(
          `Deployment polling timed out after ${Math.round(
            elapsedMs / 1000
          )}s for deployment ${deploymentId}.`
        );
      }

      const deployment = await client.getDeployment(deploymentId);
      const state = deployment.readyState || deployment.state || 'QUEUED';

      if (options.onProgress) {
        options.onProgress({
          state,
          elapsedMs,
          deploymentId,
          url: deployment.url,
        });
      }

      if (this.terminalSuccessStates.includes(state)) {
        if (options.verifyHttpLive && deployment.url) {
          await this.verifyUrlResponse(deployment.url, 3, 1000);
        }
        return deployment;
      }

      if (this.terminalFailureStates.includes(state)) {
        const code = deployment.errorCode || 'DEPLOYMENT_FAILED';
        const msg = deployment.errorMessage || 'Vercel build or deployment encountered an error.';
        throw new Error(`Deployment ${deploymentId} failed with state "${state}" (${code}): ${msg}`);
      }

      await this.sleep(intervalMs);
    }
  }
}
