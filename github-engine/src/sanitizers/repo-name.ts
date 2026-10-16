/**
 * GitHub repository name sanitizer & validator
 *
 * Rules:
 * - Must only contain alphanumeric characters, hyphens (-), underscores (_), and dots (.)
 * - Maximum length is 100 characters
 * - Cannot be empty
 * - Leading/trailing hyphens, dots, and underscores are stripped
 * - Multiple consecutive hyphens or dots are collapsed
 */

export interface SanitizeOptions {
  fallback?: string;
  maxLength?: number;
  lowercase?: boolean;
}

const GITHUB_REPO_REGEX = /^[a-zA-Z0-9._-]+$/;

export function isValidRepoName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  if (name.length < 1 || name.length > 100) return false;
  if (name === '.' || name === '..') return false;
  return GITHUB_REPO_REGEX.test(name);
}

export function sanitizeRepoName(
  input: string,
  options: SanitizeOptions = {}
): string {
  const fallback = options.fallback || 'siteforge-app';
  const maxLength = options.maxLength || 100;
  const lowercase = options.lowercase ?? true;

  if (!input || typeof input !== 'string') {
    return fallback;
  }

  let cleaned = input.trim();

  // If lowercase requested
  if (lowercase) {
    cleaned = cleaned.toLowerCase();
  }

  // Replace spaces, slashes, backslashes, and symbols with hyphens
  cleaned = cleaned.replace(/[^a-zA-Z0-9._-]+/g, '-');

  // Collapse multiple consecutive hyphens or dots
  cleaned = cleaned.replace(/-+/g, '-');
  cleaned = cleaned.replace(/\.+/g, '.');

  // Strip leading and trailing hyphens, dots, underscores
  cleaned = cleaned.replace(/^[-._]+|[-._]+$/g, '');

  // Truncate to maxLength
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
    cleaned = cleaned.replace(/^[-._]+|[-._]+$/g, '');
  }

  if (!cleaned || !isValidRepoName(cleaned)) {
    return fallback;
  }

  return cleaned;
}
