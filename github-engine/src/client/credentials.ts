import { execSync } from 'child_process';
import type { GitAuthor } from '../types.js';

export const CONFIGURED_GIT_AUTHOR: GitAuthor = {
  name: 'Jose Carlos Perez',
  email: 'jos3k4@gmail.com',
};

let cachedToken: string | null = null;
let cachedUser: string | null = null;

export class CredentialsManager {
  /**
   * Retrieves GitHub token from environment or gh CLI.
   */
  static getGitHubToken(): string {
    if (cachedToken) return cachedToken;

    if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim().length > 0) {
      cachedToken = process.env.GITHUB_TOKEN.trim();
      return cachedToken;
    }

    if (process.env.GH_TOKEN && process.env.GH_TOKEN.trim().length > 0) {
      cachedToken = process.env.GH_TOKEN.trim();
      return cachedToken;
    }

    try {
      const output = execSync('gh auth token', {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      const token = output.trim();
      if (token.length > 0) {
        cachedToken = token;
        return cachedToken;
      }
    } catch {
      // Fallback
    }

    return '';
  }

  /**
   * Retrieves current authenticated GitHub user handle (e.g. "josecarlospm")
   */
  static getAuthenticatedUsername(): string {
    if (cachedUser) return cachedUser;

    try {
      const output = execSync('gh api user --jq .login', {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      const user = output.trim();
      if (user.length > 0) {
        cachedUser = user;
        return cachedUser;
      }
    } catch {
      // Fallback
    }

    return 'josecarlospm';
  }

  /**
   * Returns the strictly configured Git author identity.
   */
  static getConfiguredAuthor(): GitAuthor {
    return { ...CONFIGURED_GIT_AUTHOR };
  }

  /**
   * Clears cached credentials (for testing)
   */
  static clearCache(): void {
    cachedToken = null;
    cachedUser = null;
  }
}
