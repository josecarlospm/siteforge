import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { CredentialsManager } from '../client/credentials.js';
import type { GitAuthor, GitCommitResult } from '../types.js';

export const STANDARD_GITIGNORE = `# Compiled output
dist/
tmp/
out-tsc/
bazel-out/

# Node dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Angular CLI cache
.angular/

# IDE & Editor files
.idea/
.vscode/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Environment variables
.env
.env.*
!.env.example
`;

export class GitOperations {
  /**
   * Initializes a Git repository in the target directory
   */
  static initRepository(workspaceDir: string, defaultBranch = 'main'): void {
    if (!fs.existsSync(workspaceDir)) {
      fs.mkdirSync(workspaceDir, { recursive: true });
    }

    const isGit = fs.existsSync(path.join(workspaceDir, '.git'));
    if (!isGit) {
      execSync(`git init -b ${defaultBranch}`, {
        cwd: workspaceDir,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } else {
      // Ensure branch name is defaultBranch
      try {
        execSync(`git checkout -B ${defaultBranch}`, {
          cwd: workspaceDir,
          encoding: 'utf-8',
          stdio: ['ignore', 'pipe', 'pipe'],
        });
      } catch {
        // Continue
      }
    }
  }

  /**
   * Ensures a standard Angular .gitignore is present in the workspace
   */
  static ensureGitignore(workspaceDir: string): void {
    const gitignorePath = path.join(workspaceDir, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, STANDARD_GITIGNORE, 'utf-8');
    }
  }

  /**
   * Configures local Git identity for the workspace
   */
  static configureIdentity(workspaceDir: string, author?: GitAuthor): void {
    const targetAuthor = author || CredentialsManager.getConfiguredAuthor();
    execSync(`git config user.name "${targetAuthor.name.replace(/"/g, '\\"')}"`, {
      cwd: workspaceDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    execSync(`git config user.email "${targetAuthor.email.replace(/"/g, '\\"')}"`, {
      cwd: workspaceDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  }

  /**
   * Stages all files and creates a commit with the specified message and author
   */
  static stageAndCommit(
    workspaceDir: string,
    message: string,
    author?: GitAuthor
  ): GitCommitResult {
    const targetAuthor = author || CredentialsManager.getConfiguredAuthor();

    this.configureIdentity(workspaceDir, targetAuthor);
    this.ensureGitignore(workspaceDir);

    // Stage all files
    execSync('git add -A', {
      cwd: workspaceDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    // Write commit message to temp file to preserve newlines and avoid quoting issues
    const msgFilePath = path.join(workspaceDir, '.git', 'SITEFORGE_COMMIT_EDITMSG');
    fs.writeFileSync(msgFilePath, message, 'utf-8');

    try {
      execSync(`git commit -F "${msgFilePath}"`, {
        cwd: workspaceDir,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          GIT_AUTHOR_NAME: targetAuthor.name,
          GIT_AUTHOR_EMAIL: targetAuthor.email,
          GIT_COMMITTER_NAME: targetAuthor.name,
          GIT_COMMITTER_EMAIL: targetAuthor.email,
        },
      });
    } finally {
      if (fs.existsSync(msgFilePath)) {
        fs.unlinkSync(msgFilePath);
      }
    }

    const commitSha = execSync('git rev-parse HEAD', {
      cwd: workspaceDir,
      encoding: 'utf-8',
    }).trim();

    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: workspaceDir,
      encoding: 'utf-8',
    }).trim();

    // Count tracked files
    const trackedFilesOutput = execSync('git ls-files', {
      cwd: workspaceDir,
      encoding: 'utf-8',
    }).trim();
    const filesCommitted = trackedFilesOutput ? trackedFilesOutput.split('\n').length : 0;

    return {
      commitSha,
      branch,
      author: targetAuthor,
      message,
      filesCommitted,
    };
  }

  /**
   * Configures git remote for the repository
   */
  static configureRemote(
    workspaceDir: string,
    remoteUrl: string,
    remoteName = 'origin'
  ): void {
    try {
      execSync(`git remote remove ${remoteName}`, {
        cwd: workspaceDir,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch {
      // Remote didn't exist, proceed
    }

    execSync(`git remote add ${remoteName} "${remoteUrl}"`, {
      cwd: workspaceDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  }

  /**
   * Pushes the current branch to GitHub with authentication
   */
  static push(
    workspaceDir: string,
    branch = 'main',
    remoteName = 'origin',
    token?: string
  ): void {
    const effectiveToken = token || CredentialsManager.getGitHubToken();

    // If an auth token is available, we construct an authenticated push URL
    if (effectiveToken) {
      try {
        const rawUrl = execSync(`git remote get-url ${remoteName}`, {
          cwd: workspaceDir,
          encoding: 'utf-8',
        }).trim();

        if (rawUrl.startsWith('https://github.com/')) {
          const repoPath = rawUrl.replace('https://github.com/', '');
          const authUrl = `https://x-access-token:${effectiveToken}@github.com/${repoPath}`;
          execSync(`git push "${authUrl}" ${branch}:${branch} --force`, {
            cwd: workspaceDir,
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'pipe'],
          });
          return;
        }
      } catch (authPushErr: any) {
        // Redact any tokens in error
        const sanitizedMsg = (authPushErr.message || '').replace(
          new RegExp(effectiveToken, 'g'),
          '***'
        );
        throw new Error(`Git push with authentication failed: ${sanitizedMsg}`);
      }
    }

    // Fallback: standard git push using gh credential helper
    try {
      execSync(`git push -u ${remoteName} ${branch} --force`, {
        cwd: workspaceDir,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (pushErr: any) {
      throw new Error(`Git push failed: ${pushErr.message}`);
    }
  }
}
