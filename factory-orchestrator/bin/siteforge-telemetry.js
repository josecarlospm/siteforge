#!/usr/bin/env node

import { HealthMonitor } from '../dist/index.js';

const args = process.argv.slice(2);
const isJson = args.includes('--json');
const isMarkdown = args.includes('--markdown');

async function main() {
  try {
    const report = await HealthMonitor.runDiagnostics();

    if (isJson) {
      console.log(JSON.stringify(report, null, 2));
      process.exit(report.overallStatus === 'UNHEALTHY' ? 1 : 0);
    }

    if (isMarkdown) {
      console.log(HealthMonitor.formatMarkdownReport(report));
      process.exit(report.overallStatus === 'UNHEALTHY' ? 1 : 0);
    }

    console.log('\n======================================================');
    console.log('SiteForge CTO Hourly Telemetry & Diagnostics Report');
    console.log('======================================================');
    console.log(`Overall Status:   ${report.overallStatus === 'HEALTHY' ? '🟢 HEALTHY' : report.overallStatus === 'DEGRADED' ? '🟡 DEGRADED (Safe Mode)' : '🔴 UNHEALTHY'}`);
    console.log(`Timestamp:        ${report.timestamp}`);
    console.log(`Version:          ${report.version}`);
    console.log('------------------------------------------------------');
    console.log('Subsystems:');
    for (const c of report.components) {
      const icon = c.status === 'HEALTHY' ? '✓' : c.status === 'DEGRADED' ? '!' : '✗';
      console.log(`  [${icon}] ${c.name} (${c.latencyMs}ms)`);
      console.log(`      Status:  ${c.status}`);
      console.log(`      Details: ${c.details}`);
    }
    console.log('------------------------------------------------------');
    console.log(`Supported Archetypes: ${report.supportedArchetypes.join(', ')}`);
    console.log(`Active Presets:       ${report.activePresets.join(', ')}`);
    console.log('Recommendations:');
    for (const rec of report.recommendations) {
      console.log(`  - ${rec}`);
    }
    console.log('======================================================\n');

    process.exit(report.overallStatus === 'UNHEALTHY' ? 1 : 0);
  } catch (err) {
    console.error('Fatal Telemetry Error:', err.message);
    process.exit(1);
  }
}

main();
