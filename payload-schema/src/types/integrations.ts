/**
 * SiteForge Integration Types (GitHub & Vercel)
 */

export interface GitHubIntegration {
  /**
   * Target repository name on GitHub.
   * Must contain only alphanumeric characters, periods, underscores, or hyphens.
   */
  repoName: string;

  /**
   * Optional GitHub organization or username owning the repository.
   */
  owner?: string;

  /**
   * Whether the repository should be private.
   * @default false
   */
  isPrivate?: boolean;

  /**
   * Whether to initialize repository with README / commit.
   * @default true
   */
  autoInit?: boolean;

  /**
   * Default branch name.
   * @default "main"
   */
  defaultBranch?: string;

  /**
   * Short description of the repository.
   */
  description?: string;

  /**
   * Optional topic tags for the repository.
   */
  topics?: string[];
}

export interface VercelIntegration {
  /**
   * Target project name on Vercel.
   * Must contain only lowercase alphanumeric characters and hyphens.
   */
  projectName: string;

  /**
   * Optional Vercel Team ID scope.
   */
  teamId?: string;

  /**
   * Framework preset for Vercel build.
   * @default "angular"
   */
  framework?: string;

  /**
   * Optional custom build command override.
   */
  buildCommand?: string;

  /**
   * Optional build output directory override.
   */
  outputDirectory?: string;

  /**
   * Environment variables injected into the Vercel project deployment.
   */
  envVariables?: Record<string, string>;
}

export interface IntegrationsConfig {
  github: GitHubIntegration;
  vercel: VercelIntegration;
}
