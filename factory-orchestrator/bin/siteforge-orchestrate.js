#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { runSiteForgeFactory } from '../dist/index.js';

const args = process.argv.slice(2);

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

if (args.includes('--help') || args.length === 0) {
  console.log(`
SiteForge Factory Orchestrator CLI
Usage:
  siteforge-orchestrate --payload <path-to-json> [options]

Options:
  --payload         Path to SiteForge JSON payload (required)
  --dry-run         Run in dry-run mode (local staging, no remote writes)
  --repo-name       Override GitHub repo name
  --vercel-project  Override Vercel project name
  --workdir         Specify custom staging directory
  --skip-github     Skip GitHub provisioning stage
  --skip-vercel     Skip Vercel deployment stage
  --help            Show this help message
`);
  process.exit(0);
}

const payloadPath = getArg('--payload');
const isDryRun = args.includes('--dry-run');
const repoOverride = getArg('--repo-name');
const vercelOverride = getArg('--vercel-project');
const workdir = getArg('--workdir');
const skipGithub = args.includes('--skip-github');
const skipVercel = args.includes('--skip-vercel');

if (!payloadPath) {
  console.error('Error: --payload argument is required.');
  process.exit(1);
}

async function main() {
  try {
    const raw = fs.readFileSync(path.resolve(payloadPath), 'utf-8');
    const payload = JSON.parse(raw);

    console.log(`[SiteForge Factory Orchestrator] Starting run for: "${payload.theme?.name || 'Untitled'}"`);
    console.log(`  Mode: ${isDryRun ? 'DRY-RUN (Safe Local Staging)' : 'LIVE PRODUCTION'}`);

    const result = await runSiteForgeFactory(payload, {
      dryRun: isDryRun,
      repoNameOverride: repoOverride || undefined,
      vercelProjectOverride: vercelOverride || undefined,
      workingDirectory: workdir || undefined,
      skipGithub,
      skipVercel,
      onProgress: (p) => {
        const pct = p.percentage ? `[${p.percentage}%]` : '';
        console.log(`  ${pct} [${p.stage}] ${p.state}: ${p.message}`);
      },
    });

    if (result.success) {
      console.log('\n========================================');
      console.log('✓ Factory Orchestration Succeeded!');
      console.log('========================================');
      console.log(`  Project:         ${result.projectName}`);
      console.log(`  Archetype:       ${result.siteType}`);
      console.log(`  Preset:          ${result.designPreset}`);
      console.log(`  Duration:        ${(result.totalDurationMs / 1000).toFixed(2)}s`);
      if (result.artifacts.scaffolding) {
        console.log(`  Files Generated: ${result.artifacts.scaffolding.filesCount}`);
      }
      if (result.artifacts.github) {
        console.log(`  GitHub Repo:     ${result.artifacts.github.repositoryUrl}`);
        console.log(`  Commit SHA:      ${result.artifacts.github.commitSha}`);
      }
      if (result.artifacts.vercel) {
        console.log(`  Live URL:        ${result.artifacts.vercel.canonicalUrl || result.artifacts.vercel.liveUrl}`);
        console.log(`  Deploy State:    ${result.artifacts.vercel.readyState}`);
      }
      console.log('========================================\n');
      process.exit(0);
    } else {
      console.error('\n✗ Factory Orchestration Failed:', result.error);
      process.exit(1);
    }
  } catch (err) {
    console.error('\n✗ Fatal Error:', err.message);
    process.exit(1);
  }
}

main();
