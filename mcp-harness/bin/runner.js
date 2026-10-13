#!/usr/bin/env node

const { AngularMcpClient } = require('../dist/index.js');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'tools';
  const query = args[1] || 'zoneless signals';

  console.log(`Connecting to Angular CLI MCP server via stdio JSON-RPC...`);
  const client = new AngularMcpClient({ timeoutMs: 20000 });

  try {
    await client.start();
    console.log(`✓ Connected & Handshake completed.\n`);

    if (command === 'tools') {
      const tools = await client.listTools();
      console.log(`Available Tools (${tools.length}):`);
      for (const t of tools) {
        console.log(`- ${t.name}: ${t.description.split('\n')[1] || t.description.slice(0, 80)}`);
      }
    } else if (command === 'docs') {
      console.log(`Searching documentation for: "${query}"...`);
      const result = await client.searchDocumentation(query);
      console.log('\n--- Documentation Results ---');
      console.log(result.slice(0, 1000) + '...');
    } else if (command === 'standards') {
      console.log('Fetching Angular coding standards & best practices...');
      const standards = await client.getBestPractices();
      console.log('\n--- Coding Standards ---');
      console.log(standards.slice(0, 1000) + '...');
    } else if (command === 'projects') {
      console.log('Listing projects in workspace...');
      const projects = await client.listProjects();
      console.log('\n--- Projects ---');
      console.log(JSON.stringify(projects, null, 2));
    } else {
      console.log(`Unknown command: ${command}. Use: tools, docs, standards, projects`);
    }
  } catch (err) {
    console.error('MCP execution error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
