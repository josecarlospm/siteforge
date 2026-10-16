import { describe, it, expect } from 'vitest';
import { MetadataCollector } from '../src/deployment/metadata-collector.js';
import { VercelDeployment, VercelProject } from '../src/types.js';

describe('MetadataCollector', () => {
  it('should format duration accurately across millisecond, second, and minute ranges', () => {
    expect(MetadataCollector.formatDuration(500)).toBe('500ms');
    expect(MetadataCollector.formatDuration(12400)).toBe('12.4s');
    expect(MetadataCollector.formatDuration(65000)).toBe('1m 5s');
    expect(MetadataCollector.formatDuration(undefined)).toBe('N/A');
  });

  it('should extract canonical HTTPS live URL prioritizing production aliases', () => {
    const project: VercelProject = {
      id: 'prj_123',
      name: 'plantcare-academy',
      framework: 'angular',
      targets: {
        production: {
          alias: ['plantcare-academy.vercel.app', 'plantcare.vercel.app'],
        },
      },
    };

    const prodDeployment: VercelDeployment = {
      id: 'dpl_123',
      name: 'plantcare-academy',
      url: 'plantcare-academy-abc123.vercel.app',
      readyState: 'READY',
      target: 'production',
    };

    expect(MetadataCollector.extractLiveUrl(project, prodDeployment)).toBe(
      'https://plantcare-academy.vercel.app'
    );

    const previewDeployment: VercelDeployment = {
      id: 'dpl_456',
      name: 'plantcare-academy',
      url: 'plantcare-academy-preview-abc123.vercel.app',
      readyState: 'READY',
      target: 'preview',
      alias: ['plantcare-git-feat-test.vercel.app'],
    };

    expect(MetadataCollector.extractLiveUrl(project, previewDeployment)).toBe(
      'https://plantcare-git-feat-test.vercel.app'
    );
  });

  it('should calculate build duration from timestamps', () => {
    const deployment: VercelDeployment = {
      id: 'dpl_123',
      name: 'test',
      url: 'test.vercel.app',
      readyState: 'READY',
      buildingAt: 100000,
      readyAt: 124500,
    };

    expect(MetadataCollector.calculateBuildDuration(deployment)).toBe(24500);
  });

  it('should assemble comprehensive deployment metadata record', () => {
    const project: VercelProject = {
      id: 'prj_test_123',
      name: 'plantcare-showcase',
      framework: 'angular',
      accountId: 'team_xyz',
      targets: {
        production: {
          alias: ['plantcare-showcase.vercel.app'],
        },
      },
    };

    const deployment: VercelDeployment = {
      id: 'dpl_test_999',
      name: 'plantcare-showcase',
      url: 'plantcare-showcase-hash.vercel.app',
      readyState: 'READY',
      target: 'production',
      createdAt: 1700000000000,
      buildingAt: 1700000002000,
      readyAt: 1700000025000,
      meta: {
        githubCommitSha: 'feedface12345678',
      },
    };

    const meta = MetadataCollector.collect({
      project,
      deployment,
      siteType: 'learning_platform',
      designPreset: 'warm-organic',
    });

    expect(meta.projectId).toBe('prj_test_123');
    expect(meta.projectName).toBe('plantcare-showcase');
    expect(meta.deploymentId).toBe('dpl_test_999');
    expect(meta.liveUrl).toBe('https://plantcare-showcase.vercel.app');
    expect(meta.canonicalUrl).toBe('https://plantcare-showcase-hash.vercel.app');
    expect(meta.target).toBe('production');
    expect(meta.readyState).toBe('READY');
    expect(meta.commitSha).toBe('feedface12345678');
    expect(meta.buildDurationMs).toBe(23000);
    expect(meta.buildDurationFormatted).toBe('23.0s');
    expect(meta.framework).toBe('angular');
    expect(meta.siteType).toBe('learning_platform');
    expect(meta.designPreset).toBe('warm-organic');
    expect(meta.inspectUrl).toContain('team_xyz/plantcare-showcase/dpl_test_999');
  });
});
