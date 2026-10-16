#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { VercelPipeline } from '../dist/pipeline/vercel-pipeline.js';

function printHelp() {
  console.log(`
SiteForge Vercel Deployment Orchestrator (SF-05)

Usage:
  siteforge-vercel-deploy --payload <path> [options]

Options:
  --payload <path>    Path to SiteForge JSON payload file (required)
  --project <name>    Override Vercel project name
  --repo <owner/repo> Override GitHub repository slug
  --sha <commit-sha>  Git commit SHA to deploy
  --target <target>   Deployment target: production (default) | preview
  --dry-run           Execute full pipeline validation without remote API mutations
  --help              Show this help message

Examples:
  siteforge-vercel-deploy --payload ./samples/plantcare-academy.payload.json
  siteforge-vercel-deploy --payload ./payload.json --dry-run
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  let payloadPath = '';
  let projectNameOverride = '';
  let gitRepoOverride = '';
  let commitSha = '';
  let target = 'production';
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--payload' && args[i + 1]) {
      payloadPath = args[++i];
    } else if (arg === '--project' && args[i + 1]) {
      projectNameOverride = args[++i];
    } else if (arg === '--repo' && args[i + 1]) {
      gitRepoOverride = args[++i];
    } else if (arg === '--sha' && args[i + 1]) {
      commitSha = args[++i];
    } else if (arg === '--target' && args[i + 1]) {
      target = args[++i];
    } else if (arg === '--dry-run') {
      dryRun = true;
    }
  }

  if (!payloadPath) {
    console.error('Error: --payload <path> is required.');
    process.exit(1);
  }

  const resolvedPayloadPath = path.resolve(payloadPath);
  if (!fs.existsSync(resolvedPayloadPath)) {
    console.error(`Error: Payload file not found at ${resolvedPayloadPath}`);
    process.exit(1);
  }

  const payloadContent = fs.readFileSync(resolvedPayloadPath, 'utf-8');
  let payload;
  try {
    payload = JSON.parse(payloadContent);
  } catch (err) {
    console.error('Error: Failed to parse JSON payload:', err.message);
    process.exit(1);
  }

  console.log(`[SiteForge Vercel Pipeline] Initializing deployment for "${payload.theme?.name || 'Angular Site'}"...`);

  const pipeline = new VercelPipeline();

  try {
    const result = await pipeline.runDeploy({
      payload,
      projectNameOverride: projectNameOverride || undefined,
      gitRepoOverride: gitRepoOverride || undefined,
      commitSha: commitSha || undefined,
      target: target,
      dryRun,
      onProgress: (status) => {
        console.log(`[${status.phase}] ${status.message} (+${Math.round(status.elapsedMs / 1000)}s)`);
      },
    });

    console.log('\n================ DEPLOYMENT SUCCESS ================');
    console.log(`Live HTTPS URL   : ${result.metadata.liveUrl}`);
    console.log(`Canonical URL    : ${result.metadata.canonicalUrl}`);
    console.log(`Project Name     : ${result.metadata.projectName}`);
    console.log(`Target           : ${result.metadata.target}`);
    console.log(`Ready State      : ${result.metadata.readyState}`);
    console.log(`Build Duration   : ${result.metadata.buildDurationFormatted}`);
    console.log(`Commit SHA       : ${result.metadata.commitSha || 'N/A'}`);
    console.log(`Inspect URL      : ${result.metadata.inspectUrl}`);
    console.log(`Dry Run          : ${result.dryRun}`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('\nDeployment failed:', err.message);
    process.exit(1);
  }
}

main();
