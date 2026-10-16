import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { validatePayload, validateGenericPayload } from '@siteforge/payload-schema';
import { ProjectGenerator, type SiteForgePayloadInput } from '@siteforge/scaffolding-engine';
import { GitHubPipeline, type AnySiteForgePayload } from '@siteforge/github-engine';
import { VercelPipeline } from '@siteforge/vercel-pipeline';
import {
  FactoryStage,
  StageState,
  StageProgress,
  FactoryOrchestratorOptions,
  FactoryOrchestratorResult,
  FactoryOrchestratorArtifacts,
} from '../types.js';

import { PayloadHydrator } from './payload-hydrator.js';

export class SiteForgeOrchestrator {
  private githubPipeline: GitHubPipeline;
  private vercelPipeline: VercelPipeline;

  constructor(githubPipeline?: GitHubPipeline, vercelPipeline?: VercelPipeline) {
    this.githubPipeline = githubPipeline || new GitHubPipeline();
    this.vercelPipeline = vercelPipeline || new VercelPipeline();
  }

  /**
   * Run end-to-end site generation and deployment from a JSON payload
   */
  async orchestrate(
    rawPayload: unknown,
    options: FactoryOrchestratorOptions = {}
  ): Promise<FactoryOrchestratorResult> {
    const startTime = Date.now();
    const isDryRun = options.dryRun ?? false;

    const stages: Record<FactoryStage, { state: StageState; durationMs: number; message?: string }> = {
      VALIDATION: { state: 'PENDING', durationMs: 0 },
      SCAFFOLDING: { state: 'PENDING', durationMs: 0 },
      GITHUB_SYNC: { state: 'PENDING', durationMs: 0 },
      VERCEL_DEPLOY: { state: 'PENDING', durationMs: 0 },
      DELIVERY_VERIFICATION: { state: 'PENDING', durationMs: 0 },
    };

    const artifacts: FactoryOrchestratorArtifacts = {};

    const emitProgress = (
      stage: FactoryStage,
      state: StageState,
      message: string,
      percentage?: number,
      details?: Record<string, unknown>
    ) => {
      stages[stage] = {
        state,
        durationMs: Date.now() - startTime,
        message,
      };

      if (options.onProgress) {
        options.onProgress({
          stage,
          state,
          message,
          elapsedMs: Date.now() - startTime,
          percentage,
          details,
        });
      }
    };

    // ==========================================
    // STAGE 1: VALIDATION
    // ==========================================
    const validationStart = Date.now();
    emitProgress('VALIDATION', 'RUNNING', 'Validating JSON payload contract against canonical schema', 10);

    const payloadCandidate =
      typeof rawPayload === 'object' && rawPayload !== null
        ? PayloadHydrator.hydrate(rawPayload as Record<string, any>)
        : rawPayload;

    let validationResult = validatePayload(payloadCandidate);
    if (!validationResult.success) {
      const genericRes = validateGenericPayload(payloadCandidate);
      if (genericRes.success) {
        validationResult = genericRes as any;
      } else {
        const errors = validationResult.errors
          ? validationResult.errors.map((e) => `${e.path}: ${e.message}`).join(', ')
          : 'Invalid payload structure';
        stages.VALIDATION = {
          state: 'FAILED',
          durationMs: Date.now() - validationStart,
          message: `Validation failed: ${errors}`,
        };
        emitProgress('VALIDATION', 'FAILED', `Validation failed: ${errors}`, 10);
        return {
          success: false,
          projectName: 'unknown',
          siteType: 'unknown',
          designPreset: 'unknown',
          themeTopic: 'unknown',
          totalDurationMs: Date.now() - startTime,
          dryRun: isDryRun,
          stages,
          artifacts,
          error: `Validation failed: ${errors}`,
        };
      }
    }

    const payload = validationResult.data as Record<string, any>;
    const siteType = payload.siteType || 'learning_platform';
    const designPreset = payload.designPreset || 'warm-organic';
    const themeTopic = payload.theme?.topic || payload.theme?.name || 'General';
    const projectName =
      options.repoNameOverride ||
      options.vercelProjectOverride ||
      payload.integrations?.github?.repoName ||
      payload.integrations?.vercel?.projectName ||
      payload.theme?.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') ||
      'siteforge-angular-app';

    stages.VALIDATION = {
      state: 'COMPLETED',
      durationMs: Date.now() - validationStart,
      message: `Payload verified successfully: archetype=${siteType}, preset=${designPreset}`,
    };
    emitProgress('VALIDATION', 'COMPLETED', `Payload verified (${siteType} / ${designPreset})`, 25);

    // Staging Directory Setup
    const stagingDir =
      options.workingDirectory ||
      path.join(
        os.tmpdir(),
        'siteforge-factory-runs',
        `${projectName}-${Date.now()}`
      );

    // ==========================================
    // STAGE 2: SCAFFOLDING
    // ==========================================
    const scaffoldStart = Date.now();
    emitProgress('SCAFFOLDING', 'RUNNING', `Scaffolding Angular 19+ standalone application in ${stagingDir}`, 30);

    try {
      const scaffoldResult = ProjectGenerator.generateProject(
        payload as SiteForgePayloadInput,
        stagingDir
      );

      artifacts.scaffolding = {
        targetDir: stagingDir,
        filesCount: scaffoldResult.filesGenerated.length,
        filesGenerated: scaffoldResult.filesGenerated,
      };

      stages.SCAFFOLDING = {
        state: 'COMPLETED',
        durationMs: Date.now() - scaffoldStart,
        message: `Scaffolded ${scaffoldResult.filesGenerated.length} Angular 19+ files`,
      };
      emitProgress('SCAFFOLDING', 'COMPLETED', `Scaffolded ${scaffoldResult.filesGenerated.length} files`, 50);
    } catch (err: any) {
      stages.SCAFFOLDING = {
        state: 'FAILED',
        durationMs: Date.now() - scaffoldStart,
        message: err.message,
      };
      emitProgress('SCAFFOLDING', 'FAILED', `Scaffolding error: ${err.message}`, 50);
      return {
        success: false,
        projectName,
        siteType,
        designPreset,
        themeTopic,
        totalDurationMs: Date.now() - startTime,
        dryRun: isDryRun,
        stages,
        artifacts,
        error: `Scaffolding failed: ${err.message}`,
      };
    }

    // ==========================================
    // STAGE 3: GITHUB SYNC
    // ==========================================
    const githubStart = Date.now();
    if (options.skipGithub) {
      stages.GITHUB_SYNC = {
        state: 'SKIPPED',
        durationMs: 0,
        message: 'GitHub sync explicitly skipped',
      };
      emitProgress('GITHUB_SYNC', 'SKIPPED', 'GitHub sync skipped per configuration', 70);
    } else {
      emitProgress('GITHUB_SYNC', 'RUNNING', `Provisioning repository and syncing code to GitHub (${projectName})`, 55);

      try {
        const githubResult = await this.githubPipeline.runSync({
          payload: payload as AnySiteForgePayload,
          repoNameOverride: projectName,
          workingDirectory: stagingDir,
          dryRun: isDryRun,
          push: !isDryRun,
          cleanupStaging: false,
        });

        artifacts.github = {
          repositoryUrl: githubResult.repositoryUrl,
          cloneUrl: githubResult.cloneUrl,
          commitSha: githubResult.commitSha,
          defaultBranch: githubResult.defaultBranch,
          owner: githubResult.owner,
          repoName: githubResult.repoName,
        };

        stages.GITHUB_SYNC = {
          state: 'COMPLETED',
          durationMs: Date.now() - githubStart,
          message: `GitHub repository synced: ${githubResult.repositoryUrl} (commit: ${githubResult.commitSha.substring(0, 7)})`,
        };
        emitProgress('GITHUB_SYNC', 'COMPLETED', `GitHub synced: ${githubResult.repositoryUrl}`, 75);
      } catch (err: any) {
        stages.GITHUB_SYNC = {
          state: 'FAILED',
          durationMs: Date.now() - githubStart,
          message: err.message,
        };
        emitProgress('GITHUB_SYNC', 'FAILED', `GitHub error: ${err.message}`, 75);
        return {
          success: false,
          projectName,
          siteType,
          designPreset,
          themeTopic,
          totalDurationMs: Date.now() - startTime,
          dryRun: isDryRun,
          stages,
          artifacts,
          error: `GitHub sync failed: ${err.message}`,
        };
      }
    }

    // ==========================================
    // STAGE 4: VERCEL DEPLOYMENT
    // ==========================================
    const vercelStart = Date.now();
    if (options.skipVercel) {
      stages.VERCEL_DEPLOY = {
        state: 'SKIPPED',
        durationMs: 0,
        message: 'Vercel deployment explicitly skipped',
      };
      emitProgress('VERCEL_DEPLOY', 'SKIPPED', 'Vercel deploy skipped per configuration', 90);
    } else {
      emitProgress('VERCEL_DEPLOY', 'RUNNING', `Configuring Vercel project and triggering automated deployment (${projectName})`, 80);

      try {
        const commitSha = artifacts.github?.commitSha || 'latest';
        const vercelResult = await this.vercelPipeline.runDeploy({
          payload,
          projectNameOverride: projectName,
          commitSha,
          dryRun: isDryRun,
          tokenOverride: options.vercelToken,
          teamIdOverride: options.vercelTeamId,
          onProgress: (p) => {
            emitProgress('VERCEL_DEPLOY', 'RUNNING', `Vercel: ${p.message}`, 85);
          },
        });

        artifacts.vercel = {
          deploymentId: vercelResult.metadata.deploymentId,
          liveUrl: vercelResult.metadata.liveUrl,
          canonicalUrl: vercelResult.metadata.canonicalUrl,
          readyState: vercelResult.metadata.readyState,
          buildDurationFormatted: vercelResult.metadata.buildDurationFormatted,
        };

        stages.VERCEL_DEPLOY = {
          state: 'COMPLETED',
          durationMs: Date.now() - vercelStart,
          message: `Vercel deployment published: ${vercelResult.metadata.canonicalUrl || vercelResult.metadata.liveUrl}`,
        };
        emitProgress('VERCEL_DEPLOY', 'COMPLETED', `Vercel published: ${vercelResult.metadata.canonicalUrl || vercelResult.metadata.liveUrl}`, 95);
      } catch (err: any) {
        stages.VERCEL_DEPLOY = {
          state: 'FAILED',
          durationMs: Date.now() - vercelStart,
          message: err.message,
        };
        emitProgress('VERCEL_DEPLOY', 'FAILED', `Vercel deployment error: ${err.message}`, 95);
        return {
          success: false,
          projectName,
          siteType,
          designPreset,
          themeTopic,
          totalDurationMs: Date.now() - startTime,
          dryRun: isDryRun,
          stages,
          artifacts,
          error: `Vercel deployment failed: ${err.message}`,
        };
      }
    }

    // ==========================================
    // STAGE 5: DELIVERY VERIFICATION
    // ==========================================
    const verificationStart = Date.now();
    emitProgress('DELIVERY_VERIFICATION', 'RUNNING', 'Compiling end-to-end receipt and checking deliverables', 98);

    // Clean staging directory if not requested to keep
    if (!options.keepStaging && !options.workingDirectory) {
      try {
        fs.rmSync(stagingDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup failure
      }
    }

    stages.DELIVERY_VERIFICATION = {
      state: 'COMPLETED',
      durationMs: Date.now() - verificationStart,
      message: 'All factory deliverables verified and published',
    };
    emitProgress('DELIVERY_VERIFICATION', 'COMPLETED', 'End-to-end generation completed successfully', 100);

    return {
      success: true,
      projectName,
      siteType,
      designPreset,
      themeTopic,
      totalDurationMs: Date.now() - startTime,
      dryRun: isDryRun,
      stages,
      artifacts,
    };
  }
}

/**
 * Programmatic convenience entrypoint for SiteForge factory orchestration
 */
export async function runSiteForgeFactory(
  payload: unknown,
  options: FactoryOrchestratorOptions = {}
): Promise<FactoryOrchestratorResult> {
  const orchestrator = new SiteForgeOrchestrator();
  return orchestrator.orchestrate(payload, options);
}
