import {
  VercelDeployment,
  VercelDeploymentMetadata,
  VercelProject,
} from '../types.js';

export interface MetadataExtractOptions {
  project: VercelProject;
  deployment: VercelDeployment;
  siteType?: string;
  designPreset?: string;
  commitSha?: string;
  wallClockDurationMs?: number;
}

export class MetadataCollector {
  /**
   * Formats duration in milliseconds into a human-readable string (e.g., '14.2s', '2m 15s')
   */
  static formatDuration(durationMs?: number): string {
    if (durationMs === undefined || durationMs === null || isNaN(durationMs)) {
      return 'N/A';
    }
    if (durationMs < 1000) {
      return `${Math.round(durationMs)}ms`;
    }
    const seconds = durationMs / 1000;
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`;
    }
    const mins = Math.floor(seconds / 60);
    const remainingSecs = Math.round(seconds % 60);
    return `${mins}m ${remainingSecs}s`;
  }

  /**
   * Extracts canonical production/preview live URL with HTTPS protocol
   */
  static extractLiveUrl(project: VercelProject, deployment: VercelDeployment): string {
    // 1. If deployment target is production, check project production target aliases
    if (deployment.target === 'production' && project.targets?.production?.alias) {
      const primaryAlias = project.targets.production.alias[0];
      if (primaryAlias) {
        return `https://${primaryAlias}`;
      }
    }

    // 2. Check deployment's assigned aliases
    if (deployment.alias && deployment.alias.length > 0) {
      return `https://${deployment.alias[0]}`;
    }

    // 3. Fallback to direct deployment url
    const cleanUrl = deployment.url.replace(/^https?:\/\//, '');
    return `https://${cleanUrl}`;
  }

  /**
   * Calculates build duration from deployment timestamps or fallback elapsed time
   */
  static calculateBuildDuration(
    deployment: VercelDeployment,
    wallClockMs?: number
  ): number | undefined {
    if (deployment.readyAt && deployment.buildingAt && deployment.readyAt >= deployment.buildingAt) {
      return deployment.readyAt - deployment.buildingAt;
    }
    if (deployment.readyAt && deployment.createdAt && deployment.readyAt >= deployment.createdAt) {
      return deployment.readyAt - deployment.createdAt;
    }
    return wallClockMs;
  }

  /**
   * Builds the complete VercelDeploymentMetadata record
   */
  static collect(options: MetadataExtractOptions): VercelDeploymentMetadata {
    const { project, deployment } = options;
    const durationMs = this.calculateBuildDuration(deployment, options.wallClockDurationMs);
    const liveUrl = this.extractLiveUrl(project, deployment);
    const cleanDeployUrl = deployment.url.replace(/^https?:\/\//, '');
    const canonicalUrl = `https://${cleanDeployUrl}`;

    const commitSha =
      options.commitSha ||
      deployment.meta?.['githubCommitSha'] ||
      deployment.meta?.['commitSha'];

    const inspectUrl =
      deployment.inspectorUrl ||
      `https://vercel.com/${project.accountId || 'siteforge'}/${project.name}/${deployment.id}`;

    const createdAtIso = deployment.createdAt
      ? new Date(deployment.createdAt).toISOString()
      : new Date().toISOString();

    const readyAtIso = deployment.readyAt
      ? new Date(deployment.readyAt).toISOString()
      : new Date().toISOString();

    return {
      projectId: project.id,
      projectName: project.name,
      deploymentId: deployment.id,
      liveUrl,
      canonicalUrl,
      target: (deployment.target === 'production' ? 'production' : 'preview'),
      readyState: deployment.readyState || deployment.state || 'READY',
      commitSha,
      buildDurationMs: durationMs,
      buildDurationFormatted: this.formatDuration(durationMs),
      framework: project.framework || 'angular',
      inspectUrl,
      siteType: options.siteType || 'angular_app',
      designPreset: options.designPreset || 'standard',
      createdAt: createdAtIso,
      readyAt: readyAtIso,
    };
  }
}
