# Angular CLI Model Context Protocol (MCP) Harness

This package integrates the official Angular CLI Model Context Protocol (MCP) server (`npx -y @angular/cli mcp`) for SiteForge agents and workflows.

## Overview

The Angular CLI MCP server provides a standardized JSON-RPC 2.0 interface exposing:
1. `search_documentation`: Live queries against official `angular.dev` documentation.
2. `get_best_practices`: Real-time retrieval of official Angular coding standards.
3. `list_projects`: Workspace discovery and target inspection.
4. `onpush_zoneless_migration`: Step-by-step zoneless OnPush migration planning.
5. `run_target`: Programmatic execution of `build`, `test`, `lint`.

## Agent Configuration (`config/angular-cli-mcp.json`)

To configure this MCP server in an agent runtime (Multica, Cursor, Claude Code, Gemini CLI):

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

## Programmatic Usage (`AngularMcpClient`)

```typescript
import { AngularMcpClient } from '@siteforge/mcp-harness';

const client = new AngularMcpClient();
await client.start();

// 1. Search documentation
const docs = await client.searchDocumentation('signals');

// 2. Fetch best practices
const standards = await client.getBestPractices();

// 3. List tools
const tools = await client.listTools();

await client.close();
```

## CLI Diagnostics

```bash
# List available MCP tools
node bin/runner.js tools

# Search Angular documentation
node bin/runner.js docs "zoneless change detection"

# Fetch coding standards
node bin/runner.js standards
```
