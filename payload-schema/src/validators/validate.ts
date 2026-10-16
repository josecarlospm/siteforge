import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import type { ValidateFunction } from 'ajv';
import { ZodError } from 'zod';

import {
  siteForgePayloadSchema,
  genericSiteForgePayloadSchema,
} from '../schemas/payload.zod.js';
import type {
  SiteForgePayload,
  GenericSiteForgePayload,
} from '../types/payload.js';
import {
  ValidationError,
  ValidationIssue,
  ValidationResult,
} from './errors.js';

let cachedAjvValidator: ValidateFunction | null = null;
let cachedSchemaObject: object | null = null;

/**
 * Loads the canonical JSON Schema definition file.
 */
export function getJsonSchema(): object {
  if (cachedSchemaObject) {
    return cachedSchemaObject;
  }

  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const possiblePaths = [
    path.resolve(currentDir, '../../schemas/site-factory-payload.schema.json'),
    path.resolve(currentDir, '../schemas/site-factory-payload.schema.json'),
    path.resolve(process.cwd(), 'schemas/site-factory-payload.schema.json'),
  ];

  for (const schemaPath of possiblePaths) {
    if (fs.existsSync(schemaPath)) {
      const content = fs.readFileSync(schemaPath, 'utf-8');
      cachedSchemaObject = JSON.parse(content) as object;
      return cachedSchemaObject;
    }
  }

  throw new Error(
    'Unable to locate site-factory-payload.schema.json in search paths'
  );
}

/**
 * Compiles and caches the Ajv JSON Schema validator.
 */
export function compileJsonSchemaValidator(): ValidateFunction {
  if (cachedAjvValidator) {
    return cachedAjvValidator;
  }

  const AjvClass = (
    (Ajv2020 as unknown as { default?: unknown }).default || Ajv2020
  ) as new (opts?: Record<string, unknown>) => {
    compile: (schema: unknown) => ValidateFunction;
  };

  const ajv = new AjvClass({
    allErrors: true,
    strict: false,
    validateFormats: true,
  });

  const addFormatsFn = (
    (addFormats as unknown as { default?: (instance: unknown) => void }).default || addFormats
  ) as (instance: unknown) => void;

  addFormatsFn(ajv);

  const schema = getJsonSchema();
  cachedAjvValidator = ajv.compile(schema);
  return cachedAjvValidator;
}

/**
 * Validates a payload against Zod definitions with full archetype typing.
 */
export function validatePayload(
  input: unknown
): ValidationResult<SiteForgePayload> {
  const result = siteForgePayloadSchema.safeParse(input);

  if (result.success) {
    return {
      success: true,
      data: result.data as SiteForgePayload,
    };
  }

  return mapZodError(result.error);
}

/**
 * Validates a payload against the generic schema (flexible content object).
 */
export function validateGenericPayload(
  input: unknown
): ValidationResult<GenericSiteForgePayload> {
  const result = genericSiteForgePayloadSchema.safeParse(input);

  if (result.success) {
    return {
      success: true,
      data: result.data as GenericSiteForgePayload,
    };
  }

  return mapZodError(result.error);
}

/**
 * Validates a payload using the canonical Draft 2020-12 JSON Schema (via Ajv).
 */
export function validateJsonSchema(
  input: unknown
): ValidationResult<SiteForgePayload> {
  const validator = compileJsonSchemaValidator();
  const valid = validator(input);

  if (valid) {
    return {
      success: true,
      data: input as SiteForgePayload,
    };
  }

  const issues: ValidationIssue[] = (validator.errors || []).map((err) => {
    const rawPath = err.instancePath
      ? err.instancePath.replace(/^\//, '').replace(/\//g, '.')
      : (err.params as { missingProperty?: string })?.missingProperty || '';

    return {
      path: rawPath,
      message: err.message || 'Schema validation error',
      code: err.keyword,
      expected: err.params,
      received: err.data,
    };
  });

  const error = new ValidationError(
    `Payload violates JSON Schema with ${issues.length} issue(s)`,
    issues
  );

  return {
    success: false,
    errors: issues,
    error,
  };
}

function mapZodError<T>(zodError: ZodError): ValidationResult<T> {
  const issues: ValidationIssue[] = zodError.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));

  const error = new ValidationError(
    `Payload validation failed with ${issues.length} issue(s)`,
    issues
  );

  return {
    success: false,
    errors: issues,
    error,
  };
}
