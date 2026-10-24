import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import {
  validatePayload,
  validateGenericPayload,
  validateJsonSchema,
  ValidationError,
} from '../src/index.js';

describe('SiteForge Validation Functions', () => {
  it('validatePayload returns success object for valid payload', () => {
    const raw = fs.readFileSync(
      path.resolve(process.cwd(), 'samples/learning_platform.payload.json'),
      'utf-8'
    );
    const payload = JSON.parse(raw);

    const result = validatePayload(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.theme.name).toBe('PlantCare Academy');
    }
  });

  it('validatePayload formats detailed errors on invalid input', () => {
    const result = validatePayload({
      version: '1.0.0',
      siteType: 'invalid_type',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.error).toBeInstanceOf(ValidationError);
      const formatted = result.error.toFormattedString();
      expect(formatted).toContain('SiteForge Validation Failed');
      expect(formatted).toContain('siteType');
      expect(formatted).toContain('Invalid discriminator value');
    }
  });

  it('validatePayload accepts blog + pulse-magazine sample', () => {
    const raw = fs.readFileSync(
      path.resolve(process.cwd(), 'samples/blog-pulse-magazine.payload.json'),
      'utf-8'
    );
    const payload = JSON.parse(raw);

    const result = validatePayload(payload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.designPreset).toBe('pulse-magazine');
      expect(result.data.siteType).toBe('blog');
      expect(result.data.theme.name).toBe('Pulse Feed');
    }
  });

  it('validateGenericPayload allows valid payload with generic content', () => {
    const genericPayload = {
      version: '1.0.0',
      siteType: 'landing_page',
      designPreset: 'neo-brutalist',
      theme: {
        topic: 'Custom Concept',
        name: 'Prototype',
        tagline: 'Rapid prototyping engine',
        description: 'Test description for rapid prototype validation.',
        content: {
          arbitraryKey: 'arbitraryValue',
          count: 42,
        },
      },
      integrations: {
        github: { repoName: 'custom-prototype' },
        vercel: { projectName: 'custom-prototype' },
      },
    };

    const result = validateGenericPayload(genericPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.theme.content.arbitraryKey).toBe('arbitraryValue');
    }
  });

  it('validateJsonSchema returns structured issues matching Ajv output', () => {
    const raw = fs.readFileSync(
      path.resolve(process.cwd(), 'samples/invalid/invalid-hex-color.json'),
      'utf-8'
    );
    const invalidPayload = JSON.parse(raw);

    const result = validateJsonSchema(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((i) => i.path.includes('branding') || i.message.includes('pattern'))).toBe(true);
      expect(result.error.toFormattedString()).toContain('SiteForge Validation Failed');
    }
  });
});
