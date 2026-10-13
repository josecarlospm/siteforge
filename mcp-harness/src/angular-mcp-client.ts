import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
}

export interface McpContentItem {
  type: string;
  text: string;
  annotations?: {
    audience?: string[];
    priority?: number;
  };
}

export interface McpToolCallResult {
  content: McpContentItem[];
  isError?: boolean;
}

export interface AngularMcpClientOptions {
  rootDir?: string;
  readOnly?: boolean;
  localOnly?: boolean;
  timeoutMs?: number;
}

export class AngularMcpClient {
  private process: ChildProcess | null = null;
  private messageId = 0;
  private pendingRequests = new Map<
    number,
    { resolve: (value: any) => void; reject: (reason: any) => void; timer: NodeJS.Timeout }
  >();
  private buffer = '';
  private initialized = false;

  constructor(private readonly options: AngularMcpClientOptions = {}) {}

  /**
   * Start the @angular/cli mcp process and perform JSON-RPC handshake
   */
  async start(): Promise<void> {
    if (this.process) {
      return;
    }

    // Try finding local ng binary in workspace node_modules
    const ngCandidates = [
      path.join(process.cwd(), 'node_modules/.bin/ng'),
      path.join(process.cwd(), '../node_modules/.bin/ng'),
      path.join(process.cwd(), '../starter-workspace/node_modules/.bin/ng'),
      path.join(__dirname, '../node_modules/.bin/ng'),
      path.join(__dirname, '../../starter-workspace/node_modules/.bin/ng'),
    ];

    const localNg = ngCandidates.find((c) => fs.existsSync(c));

    let executable: string;
    let args: string[];

    if (localNg) {
      executable = localNg;
      args = ['mcp'];
    } else {
      const npxBin = path.join(path.dirname(process.execPath), 'npx');
      executable = fs.existsSync(npxBin) ? npxBin : 'npx';
      args = ['-y', '@angular/cli', 'mcp'];
    }

    if (this.options.rootDir) {
      args.push('--root', this.options.rootDir);
    }
    if (this.options.readOnly) {
      args.push('--read-only');
    }
    if (this.options.localOnly) {
      args.push('--local-only');
    }

    this.process = spawn(executable, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env },
    });

    this.process.stdout?.on('data', (chunk: Buffer) => {
      this.handleStdout(chunk.toString('utf-8'));
    });

    this.process.stderr?.on('data', (_chunk: Buffer) => {
      // Angular CLI mcp sends logs/notices to stderr
    });

    this.process.on('close', (code) => {
      this.handleProcessExit(code);
    });

    // Initialize MCP handshake
    await this.request('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'siteforge-angular-lead-client',
        version: '1.0.0',
      },
    });

    this.initialized = true;
  }

  /**
   * List all tools offered by the Angular CLI MCP server
   */
  async listTools(): Promise<McpToolDefinition[]> {
    this.ensureStarted();
    const res = await this.request('tools/list', {});
    return res?.tools ?? [];
  }

  /**
   * Execute documentation search query against official Angular docs
   */
  async searchDocumentation(query: string): Promise<string> {
    const res = await this.callTool('search_documentation', { query });
    return this.extractTextContent(res);
  }

  /**
   * Retrieve official Angular coding standards and best practices
   */
  async getBestPractices(workspacePath?: string): Promise<string> {
    const args: Record<string, unknown> = {};
    if (workspacePath) {
      args['workspace'] = workspacePath;
    }
    const res = await this.callTool('get_best_practices', args);
    return this.extractTextContent(res);
  }

  /**
   * Discover projects and configurations in the current workspace
   */
  async listProjects(workspacePath?: string): Promise<any> {
    const args: Record<string, unknown> = {};
    if (workspacePath) {
      args['workspace'] = workspacePath;
    }
    const res = await this.callTool('list_projects', args);
    return res;
  }

  /**
   * Call any MCP tool by name
   */
  async callTool(name: string, toolArguments: Record<string, unknown> = {}): Promise<McpToolCallResult> {
    this.ensureStarted();
    const res = await this.request('tools/call', {
      name,
      arguments: toolArguments,
    });
    return res;
  }

  /**
   * Gracefully close the MCP server child process
   */
  async close(): Promise<void> {
    if (!this.process) return;

    for (const [id, req] of this.pendingRequests.entries()) {
      clearTimeout(req.timer);
      req.reject(new Error(`MCP Client closed while request ${id} was pending`));
    }
    this.pendingRequests.clear();

    const proc = this.process;
    this.process = null;
    this.initialized = false;

    return new Promise((resolve) => {
      proc.kill('SIGTERM');
      setTimeout(() => {
        try {
          proc.kill('SIGKILL');
        } catch {}
        resolve();
      }, 500);
    });
  }

  private ensureStarted(): void {
    if (!this.process || !this.initialized) {
      throw new Error('AngularMcpClient must be started before calling tools.');
    }
  }

  private request(method: string, params: Record<string, unknown>): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.process || !this.process.stdin) {
        return reject(new Error('Process not running'));
      }

      const id = ++this.messageId;
      const timeoutMs = this.options.timeoutMs ?? 15000;

      const timer = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`MCP Request timed out after ${timeoutMs}ms: ${method}`));
      }, timeoutMs);

      this.pendingRequests.set(id, { resolve, reject, timer });

      const payload = JSON.stringify({
        jsonrpc: '2.0',
        id,
        method,
        params,
      }) + '\n';

      this.process.stdin.write(payload);
    });
  }

  private handleStdout(data: string): void {
    this.buffer += data;
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('{')) continue;

      try {
        const msg = JSON.parse(trimmed);
        if (msg.id && this.pendingRequests.has(msg.id)) {
          const req = this.pendingRequests.get(msg.id)!;
          clearTimeout(req.timer);
          this.pendingRequests.delete(msg.id);

          if (msg.error) {
            req.reject(new Error(`MCP Error ${msg.error.code}: ${msg.error.message}`));
          } else {
            req.resolve(msg.result);
          }
        }
      } catch {
        // Ignore unparseable non-JSON messages (e.g. npm notices)
      }
    }
  }

  private handleProcessExit(code: number | null): void {
    for (const [id, req] of this.pendingRequests.entries()) {
      clearTimeout(req.timer);
      req.reject(new Error(`MCP Server process exited with code ${code} for request ${id}`));
    }
    this.pendingRequests.clear();
    this.process = null;
    this.initialized = false;
  }

  private extractTextContent(result: McpToolCallResult): string {
    if (!result?.content || !Array.isArray(result.content)) {
      return '';
    }
    return result.content
      .filter((item) => item.type === 'text')
      .map((item) => item.text)
      .join('\n');
  }
}
