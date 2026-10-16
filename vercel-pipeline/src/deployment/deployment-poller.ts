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

export interface UrlVerificationResult {
  live: boolean;
  statusCode?: number;
  error?: string;
  finalUrl?: string;
  protectedBySso?: boolean;
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
   * True when a redirect/location indicates Vercel Deployment Protection / SSO.
   */
  static isVercelSsoLocation(location: string | null | undefined): boolean {
    if (!location) return false;
    return /vercel\.com\/(sso-api|login|oauth|sso)\b/i.test(location);
  }

  /**
   * Verifies that the deployed HTTPS URL is publicly reachable (HTTP 2xx)
   * without Vercel Deployment Protection / SSO redirects.
   */
  static async verifyUrlResponse(
    url: string,
    maxRetries = 5,
    delayMs = 1500
  ): Promise<UrlVerificationResult> {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'SiteForge-Deployment-Verifier/1.0',
          },
          redirect: 'manual',
        });

        const location = res.headers.get('location');
        const vercelError = res.headers.get('x-vercel-error');

        if (this.isVercelSsoLocation(location) || res.status === 401 || res.status === 403) {
          return {
            live: false,
            statusCode: res.status,
            protectedBySso: true,
            finalUrl: location || fullUrl,
            error:
              'Deployment Protection / Vercel SSO blocks unauthenticated public access',
          };
        }

        if (vercelError === 'DEPLOYMENT_NOT_FOUND' || res.status === 404) {
          if (attempt === maxRetries) {
            return {
              live: false,
              statusCode: res.status,
              finalUrl: fullUrl,
              error: 'Deployment alias not found (HTTP 404)',
            };
          }
        } else if (res.status >= 200 && res.status < 300) {
          return { live: true, statusCode: res.status, finalUrl: fullUrl };
        } else if (res.status >= 300 && res.status < 400 && location) {
          // Follow a single non-SSO redirect (e.g. trailing slash) and re-check.
          const redirected = location.startsWith('http')
            ? location
            : new URL(location, fullUrl).toString();
          if (this.isVercelSsoLocation(redirected)) {
            return {
              live: false,
              statusCode: res.status,
              protectedBySso: true,
              finalUrl: redirected,
              error:
                'Deployment Protection / Vercel SSO blocks unauthenticated public access',
            };
          }
          const follow = await fetch(redirected, {
            method: 'GET',
            headers: { 'User-Agent': 'SiteForge-Deployment-Verifier/1.0' },
            redirect: 'manual',
          });
          const followLocation = follow.headers.get('location');
          if (this.isVercelSsoLocation(followLocation) || follow.status === 401 || follow.status === 403) {
            return {
              live: false,
              statusCode: follow.status,
              protectedBySso: true,
              finalUrl: followLocation || redirected,
              error:
                'Deployment Protection / Vercel SSO blocks unauthenticated public access',
            };
          }
          if (follow.status >= 200 && follow.status < 300) {
            return { live: true, statusCode: follow.status, finalUrl: redirected };
          }
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
    const intervalMs = options.intervalMs ?? 2000; // 2s default
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
          const verification = await this.verifyUrlResponse(deployment.url, 3, 1000);
          if (!verification.live) {
            // Soft-warn during poll: canonical host may still be warming while
            // production alias verification runs later in the pipeline.
            if (options.onProgress) {
              options.onProgress({
                state,
                elapsedMs: Date.now() - startTime,
                deploymentId,
                url: deployment.url,
              });
            }
          }
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
