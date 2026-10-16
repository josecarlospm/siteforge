import { validatePayload, validateGenericPayload } from '@siteforge/payload-schema';
import { CredentialsManager } from '../client/credentials.js';
import { VercelClient } from '../client/vercel-client.js';
import { EnvManager } from '../config/env-manager.js';
import { VercelConfigManager } from '../config/vercel-config.js';
import { DeploymentPoller } from '../deployment/deployment-poller.js';
import { DeploymentTrigger } from '../deployment/deployment-trigger.js';
import { MetadataCollector } from '../deployment/metadata-collector.js';
import {
  VercelDeployment,
  VercelDeploymentMetadata,
  VercelDeploymentResult,
  VercelPipelineOptions,
  VercelProject,
} from '../types.js';

export class VercelPipeline {
  private client?: VercelClient;

  constructor(client?: VercelClient) {
    this.client = client;
  }

  /**
   * Orchestrates the complete zero-config Vercel deployment pipeline
   */
  async runDeploy(options: VercelPipelineOptions): Promise<VercelDeploymentResult> {
    const startTime = Date.now();

    // 1. Validation boundary via @siteforge/payload-schema
    let validation = validatePayload(options.payload);
    if (!validation.success) {
      // Support payloads with omitted or generic content blocks
      const payloadCandidate =
        typeof options.payload === 'object' && options.payload !== null
          ? {
              ...(options.payload as Record<string, unknown>),
              theme: {
                ...(((options.payload as Record<string, unknown>).theme as Record<string, unknown>) || {}),
                content:
                  ((options.payload as Record<string, unknown>).theme as Record<string, unknown>)?.content || {},
              },
            }
          : options.payload;

      const genericRes = validateGenericPayload(payloadCandidate);
      if (genericRes.success) {
        validation = genericRes as any;
      } else {
        const errorMsg = validation.errors
          ? validation.errors.map((e) => `${e.path}: ${e.message}`).join(', ')
          : 'Invalid SiteForge payload';
        throw new Error(`Payload validation failed: ${errorMsg}`);
      }
    }

    const payload = validation.data as Record<string, any>;
    const siteType = payload.siteType || 'learning_platform';
    const designPreset = payload.designPreset || 'warm-organic';

    // Resolve project name and GitHub repo
    const projectName =
      options.projectNameOverride ||
      payload.integrations?.vercel?.projectName ||
      payload.integrations?.github?.repoName ||
      payload.theme?.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') ||
      'siteforge-angular-app';

    const githubRepo =
      options.gitRepoOverride ||
      (payload.integrations?.github?.repoName
        ? `josecarlospm/${payload.integrations.github.repoName}`
        : undefined);

    const commitSha = options.commitSha;
    const target = options.target || 'production';

    // 2. Dry run execution mode
    if (options.dryRun) {
      const mockProject: VercelProject = {
        id: `prj_${Math.random().toString(36).substring(2, 10)}`,
        name: projectName,
        framework: 'angular',
        buildCommand: 'npm run build',
        outputDirectory: `dist/${projectName}/browser`,
        targets: {
          production: {
            alias: [`${projectName}.vercel.app`],
          },
        },
      };

      const mockDeployment: VercelDeployment = {
        id: `dpl_${Math.random().toString(36).substring(2, 12)}`,
        name: projectName,
        url: `${projectName}-preview.vercel.app`,
        readyState: 'READY',
        target,
        alias: [`${projectName}.vercel.app`],
        createdAt: startTime,
        buildingAt: startTime + 2000,
        readyAt: startTime + 24000,
        meta: {
          githubCommitSha: commitSha || 'dry-run-sha',
        },
      };

      const metadata = MetadataCollector.collect({
        project: mockProject,
        deployment: mockDeployment,
        siteType,
        designPreset,
        commitSha,
        wallClockDurationMs: 22000,
      });

      return {
        success: true,
        metadata,
        dryRun: true,
      };
    }

    // 3. Initialize Vercel Client
    let client = this.client;
    if (!client) {
      const creds = CredentialsManager.getCredentials({
        token: options.tokenOverride,
        teamId: options.teamIdOverride,
      });
      client = new VercelClient(creds);
    }

    if (options.onProgress) {
      options.onProgress({
        phase: 'INITIALIZATION',
        message: `Connecting to Vercel for project "${projectName}"`,
        elapsedMs: Date.now() - startTime,
      });
    }

    // 4. Ensure project exists or create it
    let project = await client.getProject(projectName);
    if (!project) {
      if (options.onProgress) {
        options.onProgress({
          phase: 'PROJECT_CREATION',
          message: `Creating Vercel project "${projectName}" with Angular framework preset`,
          elapsedMs: Date.now() - startTime,
        });
      }

      project = await client.createProject({
        name: projectName,
        framework: 'angular',
        buildCommand: 'npm run build',
        outputDirectory: `dist/${projectName}/browser`,
        gitRepository: githubRepo
          ? {
              type: 'github',
              repo: githubRepo,
            }
          : undefined,
      });
    } else {
      // If project exists but needs git repository link
      if (githubRepo && (!project.link || project.link.repo !== githubRepo)) {
        try {
          project = await client.linkGitHubRepo(project.id, githubRepo);
        } catch {
          // If already linked or link handled by GitHub App, continue
        }
      }
    }

    // 5. Inject / Reconcile Environment Variables
    if (options.onProgress) {
      options.onProgress({
        phase: 'ENV_CONFIGURATION',
        message: 'Configuring project environment variables',
        elapsedMs: Date.now() - startTime,
      });
    }

    const envVariables = EnvManager.prepareVariables({
      projectName,
      siteType,
      designPreset,
      commitSha,
      additionalEnvVars: options.additionalEnvVars,
    });

    for (const envVar of envVariables) {
      try {
        await client.upsertProjectEnv(project.id, envVar);
      } catch {
        // Continue if env var write succeeds or is already configured
      }
    }

    // 6. Trigger Deployment
    if (options.onProgress) {
      options.onProgress({
        phase: 'DEPLOYMENT_TRIGGER',
        message: 'Triggering deployment build pipeline',
        elapsedMs: Date.now() - startTime,
      });
    }

    const deployment = await DeploymentTrigger.triggerDeployment({
      project,
      client,
      commitSha,
      target,
    });

    // 7. Poll Deployment until READY
    if (options.onProgress) {
      options.onProgress({
        phase: 'POLLING',
        message: `Monitoring build status for deployment ${deployment.id}`,
        elapsedMs: Date.now() - startTime,
        deploymentId: deployment.id,
      });
    }

    const completedDeployment = await DeploymentPoller.pollUntilReady({
      deploymentId: deployment.id,
      client,
      timeoutMs: options.pollTimeoutMs,
      intervalMs: options.pollIntervalMs,
      verifyHttpLive: true,
      onProgress: (pollStatus) => {
        if (options.onProgress) {
          options.onProgress({
            phase: 'POLLING',
            message: `Deployment state: ${pollStatus.state}`,
            elapsedMs: pollStatus.elapsedMs,
            deploymentId: pollStatus.deploymentId,
          });
        }
      },
    });

    // Refresh project details to capture latest production target aliases
    const updatedProject = (await client.getProject(project.id)) || project;

    // 8. Record and collect deployment metadata
    const metadata = MetadataCollector.collect({
      project: updatedProject,
      deployment: completedDeployment,
      siteType,
      designPreset,
      commitSha,
      wallClockDurationMs: Date.now() - startTime,
    });

    return {
      success: true,
      metadata,
      dryRun: false,
    };
  }
}
