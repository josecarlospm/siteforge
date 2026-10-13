import { describe, it, expect, afterEach } from 'vitest';
import { AngularMcpClient } from '../src/angular-mcp-client.js';

describe('AngularMcpClient Integration', () => {
  let client: AngularMcpClient | null = null;

  afterEach(async () => {
    if (client) {
      await client.close();
      client = null;
    }
  });

  it('should initialize and list MCP tools from Angular CLI server', async () => {
    client = new AngularMcpClient({ timeoutMs: 25000 });
    await client.start();

    const tools = await client.listTools();
    expect(Array.isArray(tools)).toBe(true);
    expect(tools.length).toBeGreaterThan(3);

    const toolNames = tools.map((t) => t.name);
    expect(toolNames).toContain('search_documentation');
    expect(toolNames).toContain('get_best_practices');
    expect(toolNames).toContain('list_projects');
  }, 30000);

  it('should query live Angular documentation via search_documentation tool', async () => {
    client = new AngularMcpClient({ timeoutMs: 25000 });
    await client.start();

    const result = await client.searchDocumentation('signals reactive state');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(50);
  }, 30000);

  it('should retrieve official Angular coding standards via get_best_practices tool', async () => {
    client = new AngularMcpClient({ timeoutMs: 25000 });
    await client.start();

    const standards = await client.getBestPractices();
    expect(standards).toBeTruthy();
    expect(standards).toContain('standalone components');
    expect(standards).toContain('signals');
  }, 30000);
});
