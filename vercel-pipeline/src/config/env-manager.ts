import { VercelEnvironment, VercelEnvType, VercelEnvVariable } from '../types.js';

export interface EnvPrepareOptions {
  projectName: string;
  siteType: string;
  designPreset: string;
  commitSha?: string;
  additionalEnvVars?: Record<string, string>;
  targets?: VercelEnvironment[];
}

export class EnvManager {
  private static publicPrefixes = ['NEXT_PUBLIC_', 'NG_APP_', 'PUBLIC_', 'VITE_'];
  private static secretKeywords = ['SECRET', 'TOKEN', 'KEY', 'PASSWORD', 'PRIVATE', 'AUTH'];

  /**
   * Determines whether an environment variable key is public or sensitive
   */
  static isPublicKey(key: string): boolean {
    return this.publicPrefixes.some((prefix) => key.startsWith(prefix));
  }

  /**
   * Determines if key likely represents sensitive secret credentials
   */
  static isSecretKey(key: string): boolean {
    if (this.isPublicKey(key)) {
      return false;
    }
    const upper = key.toUpperCase();
    return this.secretKeywords.some((word) => upper.includes(word));
  }

  /**
   * Resolves the appropriate VercelEnvType
   */
  static resolveEnvType(key: string, explicitType?: VercelEnvType): VercelEnvType {
    if (this.isPublicKey(key)) {
      return 'plain';
    }
    if (explicitType) {
      return explicitType;
    }
    return this.isSecretKey(key) ? 'secret' : 'plain';
  }

  /**
   * Sanitizes environment variable key to conform to POSIX and Vercel standards
   */
  static sanitizeKey(key: string): string {
    return key.replace(/[^a-zA-Z0-9_]/g, '_').toUpperCase();
  }

  /**
   * Assembles canonical SiteForge environment variables and merges additional user variables
   */
  static prepareVariables(options: EnvPrepareOptions): VercelEnvVariable[] {
    const defaultTargets: VercelEnvironment[] = options.targets || [
      'production',
      'preview',
      'development',
    ];

    const standardVars: Record<string, string> = {
      SITEFORGE_PROJECT_NAME: options.projectName,
      SITEFORGE_SITE_TYPE: options.siteType,
      SITEFORGE_DESIGN_PRESET: options.designPreset,
      SITEFORGE_DEPLOYED_AT: new Date().toISOString(),
    };

    if (options.commitSha) {
      standardVars['SITEFORGE_COMMIT_SHA'] = options.commitSha;
    }

    const merged: Record<string, string> = {
      ...standardVars,
      ...(options.additionalEnvVars || {}),
    };

    const result: VercelEnvVariable[] = [];

    for (const [rawKey, value] of Object.entries(merged)) {
      const key = this.sanitizeKey(rawKey);
      const type = this.resolveEnvType(key);

      result.push({
        key,
        value: String(value),
        type,
        target: defaultTargets,
      });
    }

    return result;
  }
}
