import * as fs from 'fs';
import * as path from 'path';
import { VercelConfig } from '../types.js';

export interface VercelConfigGeneratorOptions {
  projectName: string;
  framework?: string;
  buildCommand?: string;
  outputDirectory?: string;
  cleanUrls?: boolean;
  enableSpaRouting?: boolean;
  securityHeaders?: boolean;
}

export class VercelConfigManager {
  /**
   * Generates production-ready vercel.json configuration for Angular 19+ standalone apps
   */
  static generateConfig(options: VercelConfigGeneratorOptions): VercelConfig {
    const projectName = options.projectName;
    const framework = options.framework || 'angular';
    const buildCommand = options.buildCommand || 'npm run build';
    const outputDirectory = options.outputDirectory || `dist/${projectName}/browser`;
    const cleanUrls = options.cleanUrls ?? true;

    const config: VercelConfig = {
      $schema: 'https://openapi.vercel.sh/vercel.json',
      framework,
      buildCommand,
      outputDirectory,
      cleanUrls,
    };

    if (options.enableSpaRouting !== false) {
      config.routes = [
        {
          handle: 'filesystem',
        },
        {
          src: '/(.*)',
          dest: '/index.html',
        },
      ];
    }

    if (options.securityHeaders) {
      config.headers = [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'X-XSS-Protection', value: '1; mode=block' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          ],
        },
      ];
    }

    return config;
  }

  /**
   * Serializes VercelConfig to formatted JSON string
   */
  static serializeConfig(config: VercelConfig): string {
    return JSON.stringify(config, null, 2);
  }

  /**
   * Writes vercel.json into target directory
   */
  static writeConfigFile(
    directory: string,
    options: VercelConfigGeneratorOptions
  ): { filePath: string; config: VercelConfig } {
    const config = this.generateConfig(options);
    const filePath = path.join(directory, 'vercel.json');
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(filePath, this.serializeConfig(config), 'utf-8');
    return { filePath, config };
  }

  /**
   * Validates an existing Vercel configuration object
   */
  static validateConfig(config: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!config || typeof config !== 'object') {
      return { valid: false, errors: ['Configuration must be a non-null object'] };
    }

    const c = config as Record<string, unknown>;
    if (c['framework'] && typeof c['framework'] !== 'string') {
      errors.push('framework must be a string');
    }
    if (c['outputDirectory'] && typeof c['outputDirectory'] !== 'string') {
      errors.push('outputDirectory must be a string');
    }
    if (c['buildCommand'] && typeof c['buildCommand'] !== 'string') {
      errors.push('buildCommand must be a string');
    }

    return { valid: errors.length === 0, errors };
  }
}
