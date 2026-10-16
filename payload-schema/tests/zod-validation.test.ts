import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import {
  siteForgePayloadSchema,
  githubIntegrationSchema,
  vercelIntegrationSchema,
} from '../src/index.js';
import type {
  SiteForgePayloadLearningPlatform,
  SiteForgePayloadEcommerce,
} from '../src/index.js';

describe('Zod Payload Schema & Refinements', () => {
  const validArchetypes = [
    'learning_platform',
    'blog',
    'newsletter',
    'ecommerce',
    'social_media',
    'landing_page',
  ];

  for (const archetype of validArchetypes) {
    it(`parses valid payload sample: ${archetype}`, () => {
      const filePath = path.resolve(process.cwd(), `samples/${archetype}.payload.json`);
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const result = siteForgePayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.siteType).toBe(archetype);
        expect(result.data.version).toBe('1.0.0');
        expect(result.data.theme.name).toBeDefined();
      }
    });
  }

  it('correctly narrows discriminated union for learning_platform', () => {
    const raw = fs.readFileSync(
      path.resolve(process.cwd(), 'samples/learning_platform.payload.json'),
      'utf-8'
    );
    const parsed = siteForgePayloadSchema.parse(JSON.parse(raw));

    expect(parsed.siteType).toBe('learning_platform');
    if (parsed.siteType === 'learning_platform') {
      const lp = parsed as SiteForgePayloadLearningPlatform;
      expect(lp.theme.content.courses.length).toBeGreaterThan(0);
      expect(lp.theme.content.courses[0].instructor).toContain('Elena Vance');
    }
  });

  it('correctly narrows discriminated union for ecommerce', () => {
    const raw = fs.readFileSync(
      path.resolve(process.cwd(), 'samples/ecommerce.payload.json'),
      'utf-8'
    );
    const parsed = siteForgePayloadSchema.parse(JSON.parse(raw));

    expect(parsed.siteType).toBe('ecommerce');
    if (parsed.siteType === 'ecommerce') {
      const ec = parsed as SiteForgePayloadEcommerce;
      expect(ec.theme.content.currency).toBe('EUR');
      expect(ec.theme.content.products[0].price).toBe(89.99);
    }
  });

  describe('Integration Refinements', () => {
    it('rejects GitHub repoName ending with .git', () => {
      const res = githubIntegrationSchema.safeParse({
        repoName: 'my-project.git',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain('cannot end with .git');
      }
    });

    it('rejects GitHub repoName starting with a period', () => {
      const res = githubIntegrationSchema.safeParse({
        repoName: '.hidden-repo',
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain('cannot start or end with a period');
      }
    });

    it('rejects Vercel projectName with hyphens at boundaries', () => {
      const resLeading = vercelIntegrationSchema.safeParse({
        projectName: '-leading-dash',
      });
      expect(resLeading.success).toBe(false);

      const resTrailing = vercelIntegrationSchema.safeParse({
        projectName: 'trailing-dash-',
      });
      expect(resTrailing.success).toBe(false);
    });

    it('accepts valid GitHub and Vercel configs with defaults', () => {
      const gh = githubIntegrationSchema.parse({
        repoName: 'valid-repo.name_123',
      });
      expect(gh.isPrivate).toBe(false);
      expect(gh.autoInit).toBe(true);
      expect(gh.defaultBranch).toBe('main');

      const vc = vercelIntegrationSchema.parse({
        projectName: 'valid-project-123',
      });
      expect(vc.framework).toBe('angular');
    });
  });
});
