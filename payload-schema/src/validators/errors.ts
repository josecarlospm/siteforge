/**
 * SiteForge Structured Validation Errors
 */

export interface ValidationIssue {
  /**
   * Dot-separated path to the offending field (e.g., "theme.branding.primaryColor").
   */
  path: string;

  /**
   * Clear, human-readable error description.
   */
  message: string;

  /**
   * Machine-readable error code (e.g., "invalid_type", "regex_mismatch", "missing_field").
   */
  code: string;

  /**
   * Expected value or type description, if applicable.
   */
  expected?: unknown;

  /**
   * Actual value received, if applicable.
   */
  received?: unknown;
}

export class ValidationError extends Error {
  public readonly issues: ValidationIssue[];

  constructor(message: string, issues: ValidationIssue[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.issues = issues;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  /**
   * Formats all issues into a bulleted, readable string.
   */
  public toFormattedString(): string {
    if (this.issues.length === 0) {
      return this.message;
    }
    const lines = [`SiteForge Validation Failed: ${this.message}`];
    for (const issue of this.issues) {
      lines.push(`  - [${issue.path || '<root>'}] (${issue.code}): ${issue.message}`);
    }
    return lines.join('\n');
  }
}

export type ValidationResult<T> =
  | {
      success: true;
      data: T;
      errors?: never;
      error?: never;
    }
  | {
      success: false;
      data?: never;
      errors: ValidationIssue[];
      error: ValidationError;
    };
