import { describe, it, expect } from 'vitest';
import { EnvManager } from '../src/config/env-manager.js';

describe('EnvManager', () => {
  it('should identify public and secret variable keys correctly', () => {
    expect(EnvManager.isPublicKey('NEXT_PUBLIC_API_URL')).toBe(true);
    expect(EnvManager.isPublicKey('NG_APP_VERSION')).toBe(true);
    expect(EnvManager.isPublicKey('PUBLIC_TITLE')).toBe(true);
    expect(EnvManager.isPublicKey('DATABASE_URL')).toBe(false);

    expect(EnvManager.isSecretKey('DATABASE_URL')).toBe(false);
    expect(EnvManager.isSecretKey('STRIPE_SECRET_KEY')).toBe(true);
    expect(EnvManager.isSecretKey('API_TOKEN')).toBe(true);
    expect(EnvManager.isSecretKey('ADMIN_PASSWORD')).toBe(true);
    expect(EnvManager.isSecretKey('NEXT_PUBLIC_SECRET_KEY')).toBe(false); // Public prefix wins
  });

  it('should resolve env type according to security conventions', () => {
    expect(EnvManager.resolveEnvType('NEXT_PUBLIC_FIREBASE_KEY')).toBe('plain');
    expect(EnvManager.resolveEnvType('SERVICE_ROLE_KEY')).toBe('secret');
    expect(EnvManager.resolveEnvType('SITE_NAME')).toBe('plain');
  });

  it('should sanitize variable keys according to POSIX rules', () => {
    expect(EnvManager.sanitizeKey('my-custom-var')).toBe('MY_CUSTOM_VAR');
    expect(EnvManager.sanitizeKey('api.endpoint.url')).toBe('API_ENDPOINT_URL');
  });

  it('should assemble canonical SiteForge variables and custom user variables', () => {
    const vars = EnvManager.prepareVariables({
      projectName: 'plantcare-academy',
      siteType: 'learning_platform',
      designPreset: 'warm-organic',
      commitSha: 'a1b2c3d4e5f6',
      additionalEnvVars: {
        NEXT_PUBLIC_SITE_TITLE: 'PlantCare Academy',
        DATABASE_PASSWORD: 'super-secret-password',
      },
    });

    const keys = vars.map((v) => v.key);
    expect(keys).toContain('SITEFORGE_PROJECT_NAME');
    expect(keys).toContain('SITEFORGE_SITE_TYPE');
    expect(keys).toContain('SITEFORGE_DESIGN_PRESET');
    expect(keys).toContain('SITEFORGE_COMMIT_SHA');
    expect(keys).toContain('SITEFORGE_DEPLOYED_AT');
    expect(keys).toContain('NEXT_PUBLIC_SITE_TITLE');
    expect(keys).toContain('DATABASE_PASSWORD');

    const pwVar = vars.find((v) => v.key === 'DATABASE_PASSWORD');
    expect(pwVar?.type).toBe('secret');

    const publicVar = vars.find((v) => v.key === 'NEXT_PUBLIC_SITE_TITLE');
    expect(publicVar?.type).toBe('plain');

    // Scoped to all targets
    expect(pwVar?.target).toEqual(['production', 'preview', 'development']);
  });
});
