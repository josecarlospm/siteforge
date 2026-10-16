import type { SiteForgePayload } from '@siteforge/payload-schema';
import type { SiteForgePayloadInput } from '@siteforge/scaffolding-engine';

export type AnySiteForgePayload = SiteForgePayload | SiteForgePayloadInput;

export interface GitAuthor {
  name: string;
  email: string;
}

export interface GitHubRepoMetadata {
  id?: number;
  name: string;
  owner: string;
  fullName: string;
  htmlUrl: string;
  cloneUrl: string;
  sshUrl?: string;
  defaultBranch: string;
  isPrivate: boolean;
  description?: string;
  createdAt?: string;
}

export interface CreateRepoOptions {
  repoName: string;
  owner?: string;
  description?: string;
  isPrivate?: boolean;
  autoInit?: boolean;
  defaultBranch?: string;
  topics?: string[];
}

export interface GitCommitResult {
  commitSha: string;
  branch: string;
  author: GitAuthor;
  message: string;
  filesCommitted: number;
}

export interface GitHubSyncOptions {
  payload: AnySiteForgePayload;
  workingDirectory?: string;
  repoNameOverride?: string;
  ownerOverride?: string;
  isPrivateOverride?: boolean;
  defaultBranch?: string;
  dryRun?: boolean;
  push?: boolean;
  cleanupStaging?: boolean;
  commitMessageOverride?: string;
}

export interface GitHubSyncResult {
  success: boolean;
  repositoryUrl: string;
  cloneUrl: string;
  defaultBranch: string;
  commitSha: string;
  repoName: string;
  owner: string;
  filesCount: number;
  siteType: string;
  designPreset: string;
  projectName: string;
  dryRun: boolean;
}
