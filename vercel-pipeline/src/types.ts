export type VercelEnvironment = 'production' | 'preview' | 'development';

export type VercelEnvType = 'plain' | 'secret' | 'system' | 'sensitive' | 'encrypted';

export interface VercelEnvVariable {
  id?: string;
  key: string;
  value: string;
  type?: VercelEnvType;
  target?: VercelEnvironment[];
  gitBranch?: string;
}

export interface VercelProjectLink {
  type: string;
  repo: string;
  repoId?: number;
  org?: string;
  gitCredentialId?: string;
  productionBranch?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface VercelProjectTarget {
  alias?: string[];
  url?: string;
  readyState?: string;
  id?: string;
  createdAt?: number;
  readyAt?: number;
}

export interface VercelProject {
  id: string;
  name: string;
  accountId?: string;
  framework: string;
  buildCommand?: string | null;
  outputDirectory?: string | null;
  installCommand?: string | null;
  rootDirectory?: string | null;
  link?: VercelProjectLink;
  targets?: {
    production?: VercelProjectTarget;
    preview?: VercelProjectTarget;
    [key: string]: VercelProjectTarget | undefined;
  };
  createdAt?: number;
  updatedAt?: number;
}

export interface CreateProjectOptions {
  name: string;
  framework?: string;
  buildCommand?: string;
  outputDirectory?: string;
  installCommand?: string;
  rootDirectory?: string;
  gitRepository?: {
    type: 'github';
    repo: string;
  };
  environmentVariables?: VercelEnvVariable[];
}

export type VercelDeploymentState =
  | 'INITIALIZING'
  | 'ANALYZING'
  | 'BUILDING'
  | 'DEPLOYING'
  | 'READY'
  | 'ERROR'
  | 'CANCELED'
  | 'QUEUED'
  | 'BLOCKED';

export interface VercelDeployment {
  id: string;
  uid?: string;
  name: string;
  url: string;
  readyState: VercelDeploymentState;
  state?: VercelDeploymentState;
  target?: 'production' | 'preview' | string;
  alias?: string[];
  createdAt?: number;
  buildingAt?: number;
  readyAt?: number;
  inspectorUrl?: string;
  errorCode?: string;
  errorMessage?: string;
  meta?: Record<string, string>;
}

export interface CreateDeploymentOptions {
  name: string;
  project?: string;
  target?: 'production' | 'preview';
  gitSource?: {
    type: 'github';
    repoId: string | number;
    ref?: string;
    sha?: string;
  };
  files?: Array<{
    file: string;
    data?: string;
    sha?: string;
    size?: number;
  }>;
  projectSettings?: {
    framework?: string;
    buildCommand?: string;
    outputDirectory?: string;
  };
}

export interface VercelRoute {
  src?: string;
  dest?: string;
  handle?: string;
  status?: number;
  headers?: Record<string, string>;
}

export interface VercelConfig {
  $schema?: string;
  version?: number;
  framework?: string;
  buildCommand?: string;
  outputDirectory?: string;
  cleanUrls?: boolean;
  routes?: VercelRoute[];
  headers?: Array<{
    source: string;
    headers: Array<{ key: string; value: string }>;
  }>;
}

export interface VercelDeploymentMetadata {
  projectId: string;
  projectName: string;
  deploymentId: string;
  liveUrl: string;
  canonicalUrl: string;
  target: 'production' | 'preview';
  readyState: VercelDeploymentState;
  commitSha?: string;
  buildDurationMs?: number;
  buildDurationFormatted: string;
  framework: string;
  inspectUrl: string;
  siteType: string;
  designPreset: string;
  createdAt: string;
  readyAt: string;
}

export interface VercelPipelineOptions {
  payload: unknown;
  projectNameOverride?: string;
  gitRepoOverride?: string;
  commitSha?: string;
  teamIdOverride?: string;
  tokenOverride?: string;
  target?: 'production' | 'preview';
  additionalEnvVars?: Record<string, string>;
  pollTimeoutMs?: number;
  pollIntervalMs?: number;
  dryRun?: boolean;
  onProgress?: (status: {
    phase: string;
    message: string;
    elapsedMs: number;
    deploymentId?: string;
  }) => void;
}

export interface VercelDeploymentResult {
  success: boolean;
  metadata: VercelDeploymentMetadata;
  dryRun: boolean;
  errors?: string[];
}
