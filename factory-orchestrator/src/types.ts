/**
 * SiteForge Factory Orchestrator Types and Contracts
 */

export type FactoryStage =
  | 'VALIDATION'
  | 'SCAFFOLDING'
  | 'GITHUB_SYNC'
  | 'VERCEL_DEPLOY'
  | 'DELIVERY_VERIFICATION';

export type StageState = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';

export interface StageProgress {
  stage: FactoryStage;
  state: StageState;
  message: string;
  elapsedMs: number;
  percentage?: number;
  details?: Record<string, unknown>;
}

export interface FactoryOrchestratorOptions {
  /** Run without writing to remote GitHub or Vercel services */
  dryRun?: boolean;
  /** Override the GitHub repository name */
  repoNameOverride?: string;
  /** Override the Vercel project name */
  vercelProjectOverride?: string;
  /** Working directory for staging files */
  workingDirectory?: string;
  /** Whether to keep generated staging files */
  keepStaging?: boolean;
  /** Skip GitHub provisioning step */
  skipGithub?: boolean;
  /** Skip Vercel deployment step */
  skipVercel?: boolean;
  /** Explicit GitHub Token */
  gitHubToken?: string;
  /** Explicit Vercel Token */
  vercelToken?: string;
  /** Explicit Vercel Team ID */
  vercelTeamId?: string;
  /** Real-time progress callback */
  onProgress?: (progress: StageProgress) => void;
}

export interface StageExecutionReport {
  state: StageState;
  durationMs: number;
  message?: string;
}

export interface FactoryOrchestratorArtifacts {
  scaffolding?: {
    targetDir: string;
    filesCount: number;
    filesGenerated: string[];
  };
  github?: {
    repositoryUrl: string;
    cloneUrl: string;
    commitSha: string;
    defaultBranch: string;
    owner: string;
    repoName: string;
  };
  vercel?: {
    deploymentId: string;
    liveUrl: string;
    canonicalUrl: string;
    readyState: string;
    buildDurationFormatted?: string;
  };
}

export interface FactoryOrchestratorResult {
  success: boolean;
  projectName: string;
  siteType: string;
  designPreset: string;
  themeTopic: string;
  totalDurationMs: number;
  dryRun: boolean;
  stages: Record<FactoryStage, StageExecutionReport>;
  artifacts: FactoryOrchestratorArtifacts;
  error?: string;
}

export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';

export interface ComponentHealth {
  name: string;
  status: HealthStatus;
  version?: string;
  details: string;
  latencyMs: number;
}

export interface CTOHealthReport {
  overallStatus: HealthStatus;
  timestamp: string;
  version: string;
  components: ComponentHealth[];
  activePresets: string[];
  supportedArchetypes: string[];
  recommendations: string[];
}
