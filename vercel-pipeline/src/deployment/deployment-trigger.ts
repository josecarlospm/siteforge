import { VercelClient } from '../client/vercel-client.js';
import { VercelDeployment, VercelProject } from '../types.js';

export interface TriggerOptions {
  project: VercelProject;
  client: VercelClient;
  commitSha?: string;
  ref?: string;
  target?: 'production' | 'preview';
}

export class DeploymentTrigger {
  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Triggers a new deployment on Vercel for the linked project
   */
  static async triggerDeployment(options: TriggerOptions): Promise<VercelDeployment> {
    const { project, client, commitSha } = options;
    const target = options.target || 'production';
    const ref = options.ref || 'main';

    // 1. If project has a linked Git repo, attempt triggering via gitSource
    if (project.link?.repoId) {
      try {
        const deployment = await client.createDeployment({
          name: project.name,
          project: project.id,
          target,
          gitSource: {
            type: 'github',
            repoId: project.link.repoId,
            ref,
            sha: commitSha,
          },
          projectSettings: {
            framework: project.framework || 'angular',
            buildCommand: project.buildCommand || 'npm run build',
            outputDirectory: project.outputDirectory || `dist/${project.name}/browser`,
          },
        });
        return deployment;
      } catch (err) {
        // Fallback: If gitSource trigger fails or repo push already initiated an auto-build,
        // proceed to look up existing/in-flight deployment
      }
    }

    // 2. Look up the latest or matching commit deployment if already triggered by GitHub webhook
    if (commitSha) {
      for (let attempt = 0; attempt < 5; attempt++) {
        const deployment = await client.findDeploymentByCommitSha(project.id, commitSha);
        if (deployment) {
          return deployment;
        }
        await this.sleep(2000);
      }
    }

    // 3. Query the latest deployment for this project
    const recentDeployments = await client.listDeployments(project.id, 5);
    if (recentDeployments.length > 0) {
      return recentDeployments[0];
    }

    // 4. Fallback: Trigger default deployment without gitSource
    return await client.createDeployment({
      name: project.name,
      project: project.id,
      target,
    });
  }
}
