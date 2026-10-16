import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { VercelConfigManager } from '../src/config/vercel-config.js';

describe('VercelConfigManager', () => {
  const tmpDir = path.join(__dirname, '.tmp-vercel-config-test');

  beforeEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('should generate standard Angular 19+ Vercel configuration', () => {
    const config = VercelConfigManager.generateConfig({
      projectName: 'plantcare-academy-web',
    });

    expect(config.framework).toBe('angular');
    expect(config.buildCommand).toBe('npm run build');
    expect(config.outputDirectory).toBe('dist/plantcare-academy-web/browser');
    expect(config.cleanUrls).toBe(true);
    expect(config.routes).toBeDefined();
    expect(config.routes).toHaveLength(2);
    expect(config.routes?.[0]).toEqual({ handle: 'filesystem' });
    expect(config.routes?.[1]).toEqual({ src: '/(.*)', dest: '/index.html' });
  });

  it('should support custom overrides and security headers', () => {
    const config = VercelConfigManager.generateConfig({
      projectName: 'custom-app',
      buildCommand: 'ng build --configuration production',
      outputDirectory: 'dist/custom-app',
      securityHeaders: true,
    });

    expect(config.buildCommand).toBe('ng build --configuration production');
    expect(config.outputDirectory).toBe('dist/custom-app');
    expect(config.headers).toBeDefined();
    expect(config.headers?.[0].source).toBe('/(.*)');
    expect(config.headers?.[0].headers.length).toBeGreaterThan(2);
  });

  it('should write vercel.json file to target directory', () => {
    const res = VercelConfigManager.writeConfigFile(tmpDir, {
      projectName: 'plantcare-academy',
    });

    expect(fs.existsSync(res.filePath)).toBe(true);
    const content = JSON.parse(fs.readFileSync(res.filePath, 'utf-8'));
    expect(content.framework).toBe('angular');
    expect(content.outputDirectory).toBe('dist/plantcare-academy/browser');
  });

  it('should validate configuration objects correctly', () => {
    const valid = VercelConfigManager.validateConfig({
      framework: 'angular',
      outputDirectory: 'dist/app/browser',
      buildCommand: 'npm run build',
    });
    expect(valid.valid).toBe(true);

    const invalid = VercelConfigManager.validateConfig({
      framework: 123,
    });
    expect(valid.valid).toBe(true);
    expect(invalid.valid).toBe(false);
  });
});
