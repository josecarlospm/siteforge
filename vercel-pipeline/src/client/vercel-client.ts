import {
  CreateDeploymentOptions,
  CreateProjectOptions,
  VercelDeployment,
  VercelEnvVariable,
  VercelProject,
} from '../types.js';

export interface VercelClientOptions {
  token: string;
  teamId?: string;
  baseUrl?: string;
}

export class VercelClient {
  private token: string;
  private teamId?: string;
  private baseUrl: string;

  constructor(options: VercelClientOptions) {
    this.token = options.token;
    this.teamId = options.teamId;
    this.baseUrl = (options.baseUrl || 'https://api.vercel.com').replace(/\/+$/, '');
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (this.teamId) {
      url.searchParams.set('teamId', this.teamId);
    }

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private async request<T>(
    endpoint: string,
    init: {
      method?: string;
      body?: unknown;
      params?: Record<string, string | number | undefined>;
    } = {}
  ): Promise<T> {
    const url = this.buildUrl(endpoint, init.params);
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const response = await fetch(url, {
      method: init.method || 'GET',
      headers,
      body: init.body ? JSON.stringify(init.body) : undefined,
    });

    if (!response.ok) {
      let errorBody: unknown;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = await response.text();
      }

      const status = response.status;
      const message =
        typeof errorBody === 'object' && errorBody !== null && 'error' in errorBody
          ? (errorBody as { error: { message?: string; code?: string } }).error.message ||
            JSON.stringify(errorBody)
          : String(errorBody);

      const error = new Error(`Vercel API error (${status} on ${init.method || 'GET'} ${endpoint}): ${message}`);
      (error as Error & { status: number; body: unknown }).status = status;
      (error as Error & { status: number; body: unknown }).body = errorBody;
      throw error;
    }

    return (await response.json()) as T;
  }

  /**
   * Fetches an existing project by name or ID. Returns null if not found (404).
   */
  async getProject(nameOrId: string): Promise<VercelProject | null> {
    try {
      const data = await this.request<VercelProject>(`/v9/projects/${encodeURIComponent(nameOrId)}`);
      return data;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 404) {
        return null;
      }
      throw err;
    }
  }

  /**
   * Creates a new project configured with Angular 19+ framework presets
   */
  async createProject(options: CreateProjectOptions): Promise<VercelProject> {
    const payload: Record<string, unknown> = {
      name: options.name,
      framework: options.framework || 'angular',
      buildCommand: options.buildCommand || 'npm run build',
      outputDirectory: options.outputDirectory || `dist/${options.name}/browser`,
    };

    if (options.installCommand) {
      payload['installCommand'] = options.installCommand;
    }
    if (options.rootDirectory) {
      payload['rootDirectory'] = options.rootDirectory;
    }
    if (options.gitRepository) {
      payload['gitRepository'] = options.gitRepository;
    }
    if (options.environmentVariables && options.environmentVariables.length > 0) {
      payload['environmentVariables'] = options.environmentVariables;
    }

    return await this.request<VercelProject>('/v9/projects', {
      method: 'POST',
      body: payload,
    });
  }

  /**
   * Updates an existing project's configuration
   */
  async updateProject(idOrName: string, updates: Partial<CreateProjectOptions>): Promise<VercelProject> {
    return await this.request<VercelProject>(`/v9/projects/${encodeURIComponent(idOrName)}`, {
      method: 'PATCH',
      body: updates,
    });
  }

  /**
   * Links a GitHub repository to a Vercel project
   */
  async linkGitHubRepo(projectId: string, repo: string): Promise<VercelProject> {
    return await this.request<VercelProject>(`/v9/projects/${encodeURIComponent(projectId)}/link`, {
      method: 'POST',
      body: {
        type: 'github',
        repo,
      },
    });
  }

  /**
   * Lists environment variables defined on a project
   */
  async listProjectEnvs(projectId: string): Promise<VercelEnvVariable[]> {
    const data = await this.request<{ envs: VercelEnvVariable[] }>(
      `/v10/projects/${encodeURIComponent(projectId)}/env`
    );
    return data.envs || [];
  }

  /**
   * Adds an environment variable to a project
   */
  async addProjectEnv(projectId: string, env: VercelEnvVariable): Promise<VercelEnvVariable> {
    return await this.request<VercelEnvVariable>(
      `/v10/projects/${encodeURIComponent(projectId)}/env`,
      {
        method: 'POST',
        body: {
          key: env.key,
          value: env.value,
          type: env.type || 'plain',
          target: env.target || ['production', 'preview', 'development'],
          gitBranch: env.gitBranch,
        },
      }
    );
  }

  /**
   * Adds or updates an environment variable on a project
   */
  async upsertProjectEnv(projectId: string, env: VercelEnvVariable): Promise<VercelEnvVariable> {
    const existingEnvs = await this.listProjectEnvs(projectId);
    const existing = existingEnvs.find((e) => e.key === env.key);

    if (existing && existing.id) {
      return await this.request<VercelEnvVariable>(
        `/v10/projects/${encodeURIComponent(projectId)}/env/${existing.id}`,
        {
          method: 'PATCH',
          body: {
            value: env.value,
            type: env.type || 'plain',
            target: env.target || ['production', 'preview', 'development'],
          },
        }
      );
    }

    return await this.addProjectEnv(projectId, env);
  }

  /**
   * Creates / triggers a new deployment
   */
  async createDeployment(options: CreateDeploymentOptions): Promise<VercelDeployment> {
    return await this.request<VercelDeployment>('/v13/deployments', {
      method: 'POST',
      body: options,
    });
  }

  /**
   * Fetches deployment status and metadata by ID
   */
  async getDeployment(deploymentId: string): Promise<VercelDeployment> {
    return await this.request<VercelDeployment>(
      `/v13/deployments/${encodeURIComponent(deploymentId)}`
    );
  }

  /**
   * Lists recent deployments for a project
   */
  async listDeployments(projectId: string, limit = 10): Promise<VercelDeployment[]> {
    const data = await this.request<{ deployments: VercelDeployment[] }>('/v6/deployments', {
      params: {
        projectId,
        limit,
      },
    });
    return data.deployments || [];
  }

  /**
   * Finds the deployment associated with a specific git commit SHA
   */
  async findDeploymentByCommitSha(
    projectId: string,
    commitSha: string,
    limit = 15
  ): Promise<VercelDeployment | null> {
    const deployments = await this.listDeployments(projectId, limit);
    for (const d of deployments) {
      if (d.meta?.['githubCommitSha'] === commitSha) {
        return d;
      }
      if (d.meta?.['commitSha'] === commitSha) {
        return d;
      }
    }
    return null;
  }
}
