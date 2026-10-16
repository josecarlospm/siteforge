import { describe, it, expect } from 'vitest';
import { HealthMonitor } from '../src/telemetry/health-monitor.js';

describe('HealthMonitor', () => {
  it('should run diagnostics and return comprehensive health report', async () => {
    const report = await HealthMonitor.runDiagnostics();

    expect(report.version).toBe('1.0.0');
    expect(report.timestamp).toBeDefined();
    expect(['HEALTHY', 'DEGRADED', 'UNHEALTHY']).toContain(report.overallStatus);

    expect(report.components.length).toBe(4);
    const names = report.components.map((c) => c.name);
    expect(names.some((n) => n.includes('Payload Schema'))).toBe(true);
    expect(names.some((n) => n.includes('Scaffolding Engine'))).toBe(true);
    expect(names.some((n) => n.includes('GitHub Integration'))).toBe(true);
    expect(names.some((n) => n.includes('Vercel Deployment'))).toBe(true);

    expect(report.activePresets.length).toBe(5);
    expect(report.supportedArchetypes.length).toBe(6);
    expect(report.recommendations.length).toBeGreaterThan(0);
  });

  it('should format clean markdown report for CTO updates', async () => {
    const report = await HealthMonitor.runDiagnostics();
    const md = HealthMonitor.formatMarkdownReport(report);

    expect(md).toContain('SiteForge CTO Telemetry & Health Audit');
    expect(md).toContain('Overall Factory Health');
    expect(md).toContain('Supported Archetypes');
    expect(md).toContain('Active Design.md Presets');
    expect(md).toContain('CTO Recommendations');
  });
});
