#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { GitHubPipeline } from '../dist/index.js';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    payloadPath: '',
    dryRun: false,
    repoName: '',
    isPrivate: undefined,
    noPush: false,
    outputDir: '',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--payload' && args[i + 1]) {
      options.payloadPath = args[++i];
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--repo-name' && args[i + 1]) {
      options.repoName = args[++i];
    } else if (arg === '--private') {
      options.isPrivate = true;
    } else if (arg === '--public') {
      options.isPrivate = false;
    } else if (arg === '--no-push') {
      options.noPush = true;
    } else if (arg === '--output' && args[i + 1]) {
      options.outputDir = args[++i];
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();

  if (!options.payloadPath) {
    console.error('Usage: siteforge-github-sync --payload <path> [--dry-run] [--repo-name <name>] [--private|--public] [--no-push] [--output <dir>]');
    process.exit(1);
  }

  const resolvedPayloadPath = path.resolve(process.cwd(), options.payloadPath);
  if (!fs.existsSync(resolvedPayloadPath)) {
    console.error(`Error: Payload file not found at ${resolvedPayloadPath}`);
    process.exit(1);
  }

  const payloadContent = fs.readFileSync(resolvedPayloadPath, 'utf-8');
  let payload;
  try {
    payload = JSON.parse(payloadContent);
  } catch (err) {
    console.error(`Error parsing payload JSON: ${err.message}`);
    process.exit(1);
  }

  try {
    const pipeline = new GitHubPipeline();
    const result = await pipeline.runSync({
      payload,
      dryRun: options.dryRun,
      repoNameOverride: options.repoName || undefined,
      isPrivateOverride: options.isPrivate,
      push: !options.noPush,
      workingDirectory: options.outputDir || undefined,
    });

    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(`GitHub sync error: ${err.message}`);
    process.exit(1);
  }
}

main();
