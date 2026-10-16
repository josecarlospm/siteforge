import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { validatePayload } from '@siteforge/payload-schema';
import { ProjectGenerator, type SiteForgePayloadInput } from '@siteforge/scaffolding-engine';
import { RepoProvisioner } from '../provisioner/repo-provisioner.js';
import { GitOperations } from '../git/git-operations.js';
import { CommitFormatter } from '../git/commit-formatter.js';
import { CredentialsManager } from '../client/credentials.js';
import type { GitHubSyncOptions, GitHubSyncResult, AnySiteForgePayload } from '../types.js';

export class GitHubPipeline {
  private provisioner: RepoProvisioner;

  constructor(provisioner?: RepoProvisioner) {
    this.provisioner = provisioner || new RepoProvisioner();
  }

  /**
   * Executes end-to-end GitHub provisioning, Angular code generation, commit, and push
   */
  async runSync(options: GitHubSyncOptions): Promise<GitHubSyncResult> {
    const payload = options.payload;

    // 1. Validation boundary via @siteforge/payload-schema
    const validation = validatePayload(payload);
    if (!validation.success) {
      const errorMsg = (validation as any).errors
        ? (validation as any).errors.map((e: any) => `${e.path}: ${e.message}`).join(', ')
        : (validation as any).error?.message || 'Invalid payload';
      throw new Error(`Payload validation failed: ${errorMsg}`);
    }

    const validPayload = validation.data as any;
    const siteType = validPayload.siteType;
    const designPreset = validPayload.designPreset;
    const repoName =
      options.repoNameOverride ||
      validPayload.integrations?.github?.repoName ||
      'siteforge-angular-app';
    const defaultBranch =
      options.defaultBranch ||
      (validPayload.integrations?.github as any)?.defaultBranch ||
      'main';

    // 2. Setup staging workspace directory
    const stagingDir =
      options.workingDirectory ||
      path.join(
        os.tmpdir(),
        'siteforge-github-sync',
        `${repoName}-${Date.now()}`
      );
    fs.mkdirSync(stagingDir, { recursive: true });

    // 3. Hydrate Angular 19+ project tree via @siteforge/scaffolding-engine
    const scaffoldResult = ProjectGenerator.generateProject(
      validPayload as SiteForgePayloadInput,
      stagingDir
    );

    // 4. Initialize Git in hydrated directory
    GitOperations.initRepository(stagingDir, defaultBranch);
    GitOperations.ensureGitignore(stagingDir);

    // 5. Format commit message & create initial commit
    const commitMessage = options.commitMessageOverride
      ? { fullMessage: options.commitMessageOverride }
      : CommitFormatter.formatInitialCommit(validPayload, {
          filesCount: scaffoldResult.filesGenerated.length,
          projectName: repoName,
        });
    const commitResult = GitOperations.stageAndCommit(
      stagingDir,
      commitMessage.fullMessage,
      CredentialsManager.getConfiguredAuthor()
    );

    // Dry Run mode: return early without creating remote repository or pushing
    if (options.dryRun) {
      const authUser = CredentialsManager.getAuthenticatedUsername();
      return {
        success: true,
        repositoryUrl: `https://github.com/${authUser}/${repoName}`,
        cloneUrl: `https://github.com/${authUser}/${repoName}.git`,
        defaultBranch,
        commitSha: commitResult.commitSha,
        repoName,
        owner: authUser,
        filesCount: commitResult.filesCommitted,
        siteType,
        designPreset,
        projectName: repoName,
        dryRun: true,
      };
    }

    // 6. Provision GitHub repository
    const repoMetadata = await this.provisioner.provisionRepository({
      payload: validPayload,
      repoName,
      owner: options.ownerOverride,
      isPrivate: options.isPrivateOverride,
      defaultBranch,
    });

    // 7. Configure remote & push to GitHub
    GitOperations.configureRemote(stagingDir, repoMetadata.cloneUrl, 'origin');

    const shouldPush = options.push !== false;
    if (shouldPush) {
      GitOperations.push(
        stagingDir,
        repoMetadata.defaultBranch,
        'origin',
        CredentialsManager.getGitHubToken()
      );
    }

    // 8. Cleanup temporary staging if requested
    if (options.cleanupStaging && !options.workingDirectory) {
      try {
        fs.rmSync(stagingDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup failure
      }
    }

    return {
      success: true,
      repositoryUrl: repoMetadata.htmlUrl,
      cloneUrl: repoMetadata.cloneUrl,
      defaultBranch: repoMetadata.defaultBranch,
      commitSha: commitResult.commitSha,
      repoName: repoMetadata.name,
      owner: repoMetadata.owner,
      filesCount: commitResult.filesCommitted,
      siteType,
      designPreset,
      projectName: repoName,
      dryRun: false,
    };
  }
}
