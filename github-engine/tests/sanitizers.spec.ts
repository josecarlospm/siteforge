import { describe, it, expect } from 'vitest';
import { sanitizeRepoName, isValidRepoName } from '../src/sanitizers/repo-name.js';

describe('Repo Name Sanitizer', () => {
  it('should accept valid repository names without modification', () => {
    expect(isValidRepoName('plantcare-academy-web')).toBe(true);
    expect(sanitizeRepoName('plantcare-academy-web')).toBe('plantcare-academy-web');
    expect(sanitizeRepoName('my_cool.project-123')).toBe('my_cool.project-123');
  });

  it('should sanitize spaces and special characters into hyphens', () => {
    expect(sanitizeRepoName('PlantCare Academy - Web!')).toBe('plantcare-academy-web');
    expect(sanitizeRepoName('Project @#$ 2026 // App')).toBe('project-2026-app');
  });

  it('should collapse multiple consecutive hyphens and dots', () => {
    expect(sanitizeRepoName('foo---bar...baz')).toBe('foo-bar.baz');
  });

  it('should strip leading and trailing separators', () => {
    expect(sanitizeRepoName('---my-repo---')).toBe('my-repo');
    expect(sanitizeRepoName('...my.repo...')).toBe('my.repo');
  });

  it('should return fallback if input becomes empty or is invalid', () => {
    expect(sanitizeRepoName('')).toBe('siteforge-app');
    expect(sanitizeRepoName('   ')).toBe('siteforge-app');
    expect(sanitizeRepoName('!@#$%^&*()')).toBe('siteforge-app');
    expect(sanitizeRepoName('', { fallback: 'custom-fallback' })).toBe('custom-fallback');
  });

  it('should respect maxLength constraint', () => {
    const longName = 'a'.repeat(150);
    const sanitized = sanitizeRepoName(longName, { maxLength: 50 });
    expect(sanitized.length).toBeLessThanOrEqual(50);
  });
});
