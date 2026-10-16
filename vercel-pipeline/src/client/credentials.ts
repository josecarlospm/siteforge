import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface VercelCredentials {
  token: string;
  teamId?: string;
}

export class CredentialsManager {
  private static defaultTeamId = 'team_IidkeraM4yeYily0EDbOeWSD';

  /**
   * Resolves Vercel API authentication token from multiple discovery vectors
   */
  static getVercelToken(override?: string): string {
    if (override && override.trim().length > 0) {
      return override.trim();
    }

    if (process.env.VERCEL_TOKEN && process.env.VERCEL_TOKEN.trim().length > 0) {
      return process.env.VERCEL_TOKEN.trim();
    }

    // Check Vercel CLI global config locations
    const candidatePaths = [
      path.join(os.homedir(), '.local/share/com.vercel.cli/auth.json'),
      path.join(os.homedir(), '.config/com.vercel.cli/auth.json'),
      path.join(os.homedir(), '.vercel/auth.json'),
    ];

    for (const authPath of candidatePaths) {
      if (fs.existsSync(authPath)) {
        try {
          const content = fs.readFileSync(authPath, 'utf-8');
          const parsed = JSON.parse(content);
          if (parsed && typeof parsed.token === 'string' && parsed.token.length > 0) {
            return parsed.token.trim();
          }
        } catch {
          // Ignore and continue search
        }
      }
    }

    throw new Error(
      'Vercel authentication token not found. Please set VERCEL_TOKEN environment variable or run `vercel login`.'
    );
  }

  /**
   * Resolves Vercel Team / Scope ID
   */
  static getTeamId(override?: string): string | undefined {
    if (override && override.trim().length > 0) {
      return override.trim();
    }

    if (process.env.VERCEL_ORG_ID && process.env.VERCEL_ORG_ID.trim().length > 0) {
      return process.env.VERCEL_ORG_ID.trim();
    }

    if (process.env.VERCEL_TEAM_ID && process.env.VERCEL_TEAM_ID.trim().length > 0) {
      return process.env.VERCEL_TEAM_ID.trim();
    }

    // Default workspace team fallback
    return this.defaultTeamId;
  }

  /**
   * Returns complete credentials bundle
   */
  static getCredentials(options?: { token?: string; teamId?: string }): VercelCredentials {
    return {
      token: this.getVercelToken(options?.token),
      teamId: this.getTeamId(options?.teamId),
    };
  }
}
