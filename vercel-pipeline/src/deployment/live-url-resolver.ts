import { DeploymentPoller } from './deployment-poller.js';
import { VercelDeployment, VercelProject } from '../types.js';
import { MetadataCollector } from './metadata-collector.js';

/**
 * Builds ordered candidate production URLs, then returns the first that is
 * publicly reachable without Vercel SSO. Never invents unverified aliases.
 */
export class LiveUrlResolver {
  static candidateUrls(project: VercelProject, deployment: VercelDeployment): string[] {
    const candidates: string[] = [];
    const push = (raw?: string) => {
      if (!raw) return;
      const normalized = raw.startsWith('http') ? raw : `https://${raw.replace(/^https?:\/\//, '')}`;
      if (!candidates.includes(normalized)) {
        candidates.push(normalized);
      }
    };

    if (deployment.target === 'production' && project.targets?.production?.alias) {
      for (const alias of project.targets.production.alias) {
        push(alias);
      }
    }

    if (deployment.alias) {
      for (const alias of deployment.alias) {
        push(alias);
      }
    }

    push(deployment.url);
    push(MetadataCollector.extractLiveUrl(project, deployment));

    return candidates;
  }

  /**
   * Resolves a verified public live URL. Throws if none of the candidates respond
   * with a public HTTP 2xx (rejects SSO / 404 / missing deployments).
   */
  static async resolveVerified(
    project: VercelProject,
    deployment: VercelDeployment,
    options?: { maxRetries?: number; delayMs?: number }
  ): Promise<{ liveUrl: string; verified: true; attempts: string[] }> {
    const candidates = this.candidateUrls(project, deployment);
    const attempts: string[] = [];
    const maxRetries = options?.maxRetries ?? 3;
    const delayMs = options?.delayMs ?? 800;

    for (const candidate of candidates) {
      attempts.push(candidate);
      const result = await DeploymentPoller.verifyUrlResponse(candidate, maxRetries, delayMs);
      if (result.live) {
        return { liveUrl: candidate, verified: true, attempts };
      }
    }

    throw new Error(
      `No publicly verified production URL. Checked: ${attempts.join(', ')}. ` +
        'Disable Vercel Deployment Protection for demo projects, assign a real ' +
        '*.vercel.app production alias, and ensure the token can create/link projects.'
    );
  }
}
