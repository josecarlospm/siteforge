import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import type { ValidateFunction } from 'ajv';

import { compileJsonSchemaValidator, getJsonSchema } from '../src/validators/validate.js';

describe('Canonical JSON Schema (Draft 2020-12)', () => {
  let validate: ValidateFunction;

  beforeAll(() => {
    validate = compileJsonSchemaValidator();
  });

  it('loads valid JSON schema with correct metadata', () => {
    const schema = getJsonSchema() as { title: string; $schema: string; $id: string };
    expect(schema.title).toBe('SiteForgePayload');
    expect(schema.$schema).toContain('2020-12');
    expect(schema.$id).toBe('https://siteforge.io/schemas/v1/site-factory-payload.schema.json');
  });

  const validArchetypes = [
    'learning_platform',
    'blog',
    'newsletter',
    'ecommerce',
    'social_media',
    'landing_page',
  ];

  for (const archetype of validArchetypes) {
    it(`validates sample payload for archetype: ${archetype}`, () => {
      const filePath = path.resolve(process.cwd(), `samples/${archetype}.payload.json`);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const payload = JSON.parse(raw);

      const isValid = validate(payload);
      if (!isValid) {
        console.error(`Validation errors for ${archetype}:`, validate.errors);
      }
      expect(isValid).toBe(true);
      expect(validate.errors).toBeNull();
    });
  }

  it('validates blog + pulse-magazine sample (SF-13.3 / DRE-127)', () => {
    const filePath = path.resolve(process.cwd(), 'samples/blog-pulse-magazine.payload.json');
    const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    expect(payload.siteType).toBe('blog');
    expect(payload.designPreset).toBe('pulse-magazine');

    const isValid = validate(payload);
    if (!isValid) {
      console.error('Validation errors for blog-pulse-magazine:', validate.errors);
    }
    expect(isValid).toBe(true);
    expect(validate.errors).toBeNull();

    const schema = getJsonSchema() as { properties: { designPreset: { enum: string[] } } };
    expect(schema.properties.designPreset.enum).toContain('pulse-magazine');
  });

  describe('Invalid Payloads & Edge Cases', () => {
    it('rejects payload missing required top-level fields', () => {
      const filePath = path.resolve(process.cwd(), 'samples/invalid/missing-required.json');
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const isValid = validate(payload);
      expect(isValid).toBe(false);
      expect(validate.errors).not.toBeNull();
    });

    it('rejects unsupported siteType', () => {
      const filePath = path.resolve(process.cwd(), 'samples/invalid/invalid-archetype.json');
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const isValid = validate(payload);
      expect(isValid).toBe(false);
      const errors = validate.errors || [];
      const hasEnumError = errors.some((e) => e.keyword === 'enum' || e.params?.allowedValues);
      expect(hasEnumError).toBe(true);
    });

    it('rejects unsupported designPreset', () => {
      const filePath = path.resolve(process.cwd(), 'samples/invalid/invalid-preset.json');
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const isValid = validate(payload);
      expect(isValid).toBe(false);
    });

    it('rejects malformed hex colors in branding', () => {
      const filePath = path.resolve(process.cwd(), 'samples/invalid/invalid-hex-color.json');
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const isValid = validate(payload);
      expect(isValid).toBe(false);
    });

    it('rejects illegal characters in GitHub repoName', () => {
      const filePath = path.resolve(process.cwd(), 'samples/invalid/invalid-github-repo.json');
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const isValid = validate(payload);
      expect(isValid).toBe(false);
    });

    it('rejects uppercase and underscores in Vercel projectName', () => {
      const filePath = path.resolve(process.cwd(), 'samples/invalid/invalid-vercel-project.json');
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const isValid = validate(payload);
      expect(isValid).toBe(false);
    });
  });
});
