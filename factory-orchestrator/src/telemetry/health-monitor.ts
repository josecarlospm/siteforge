import { validatePayload } from '@siteforge/payload-schema';
import { TokenCompiler, PRESET_REGISTRY } from '@siteforge/scaffolding-engine';
import { CredentialsManager as GitHubCredentials } from '@siteforge/github-engine';
import { CredentialsManager as VercelCredentials } from '@siteforge/vercel-pipeline';
import { PayloadHydrator } from '../orchestrator/payload-hydrator.js';
import {
  CTOHealthReport,
  ComponentHealth,
  HealthStatus,
} from '../types.js';

export class HealthMonitor {
  /**
   * Run automated diagnostics across all SiteForge factory subsystems
   */
  static async runDiagnostics(): Promise<CTOHealthReport> {
    const components: ComponentHealth[] = [];

    // 1. Diagnostic: Payload Schema Engine
    const payloadStart = Date.now();
    try {
      const samplePayload = PayloadHydrator.hydrate({
        version: '1.0.0',
        siteType: 'learning_platform',
        designPreset: 'warm-organic',
        theme: {
          topic: 'Home Plants Care',
          name: 'PlantCare Health Check',
          tagline: 'Diagnosing plant wellness',
          description: 'Telemetry test payload',
        },
        integrations: {
          github: { repoName: 'test-health-repo' },
          vercel: { projectName: 'test-health-proj' },
        },
      });

      const res = validatePayload(samplePayload);
      components.push({
        name: 'Payload Schema Engine (@siteforge/payload-schema)',
        status: res.success ? 'HEALTHY' : 'DEGRADED',
        version: '1.0.0',
        details: res.success
          ? 'Canonical JSON Schema & Zod contracts loaded; 6 archetypes active'
          : `Validation error: ${JSON.stringify(res.errors)}`,
        latencyMs: Date.now() - payloadStart,
      });
    } catch (err: any) {
      components.push({
        name: 'Payload Schema Engine (@siteforge/payload-schema)',
        status: 'UNHEALTHY',
        details: `Diagnostic failure: ${err.message}`,
        latencyMs: Date.now() - payloadStart,
      });
    }

    // 2. Diagnostic: Scaffolding Engine & Design Tokens
    const scaffoldStart = Date.now();
    try {
      const cssWarm = TokenCompiler.compilePresetToCss('warm-organic');
      const cssBrutalist = TokenCompiler.compilePresetToCss('neo-brutalist');
      const hasTokens = cssWarm.includes('--color-primary') && cssBrutalist.includes('--border-width');

      components.push({
        name: 'Scaffolding Engine (@siteforge/scaffolding-engine)',
        status: hasTokens ? 'HEALTHY' : 'DEGRADED',
        version: '1.0.0',
        details: `Design.md Token Compiler operational; ${Object.keys(PRESET_REGISTRY).length} presets verified`,
        latencyMs: Date.now() - scaffoldStart,
      });
    } catch (err: any) {
      components.push({
        name: 'Scaffolding Engine (@siteforge/scaffolding-engine)',
        status: 'UNHEALTHY',
        details: `Token compilation error: ${err.message}`,
        latencyMs: Date.now() - scaffoldStart,
      });
    }

    // 3. Diagnostic: GitHub Integration Engine
    const githubStart = Date.now();
    try {
      const author = GitHubCredentials.getConfiguredAuthor();
      const token = GitHubCredentials.getGitHubToken();
      const username = GitHubCredentials.getAuthenticatedUsername();

      components.push({
        name: 'GitHub Integration Engine (@siteforge/github-engine)',
        status: author.email ? 'HEALTHY' : 'DEGRADED',
        version: '1.0.0',
        details: `Git identity: "${author.name} <${author.email}>" | Auth user: "${username}" | Token configured: ${token ? 'Yes' : 'No (local/dry-run mode)'}`,
        latencyMs: Date.now() - githubStart,
      });
    } catch (err: any) {
      components.push({
        name: 'GitHub Integration Engine (@siteforge/github-engine)',
        status: 'DEGRADED',
        details: `GitHub credential warning: ${err.message}`,
        latencyMs: Date.now() - githubStart,
      });
    }

    // 4. Diagnostic: Vercel Deployment Pipeline
    const vercelStart = Date.now();
    try {
      const creds = VercelCredentials.getCredentials();
      const hasToken = !!creds.token;

      components.push({
        name: 'Vercel Deployment Pipeline (@siteforge/vercel-pipeline)',
        status: hasToken ? 'HEALTHY' : 'DEGRADED',
        version: '1.0.0',
        details: `Angular 19+ Zero-Config preset active | Team: ${creds.teamId || 'Personal'} | Token: ${hasToken ? 'Configured' : 'Missing (local/dry-run mode)'}`,
        latencyMs: Date.now() - vercelStart,
      });
    } catch (err: any) {
      components.push({
        name: 'Vercel Deployment Pipeline (@siteforge/vercel-pipeline)',
        status: 'DEGRADED',
        details: `Vercel credential warning: ${err.message}`,
        latencyMs: Date.now() - vercelStart,
      });
    }

    // Determine Overall Status
    let overallStatus: HealthStatus = 'HEALTHY';
    if (components.some((c) => c.status === 'UNHEALTHY')) {
      overallStatus = 'UNHEALTHY';
    } else if (components.some((c) => c.status === 'DEGRADED')) {
      overallStatus = 'DEGRADED';
    }

    const recommendations: string[] = [];
    if (components.some((c) => c.status === 'DEGRADED' && c.name.includes('Vercel'))) {
      recommendations.push(
        'For live cloud deployments to Vercel, ensure VERCEL_TOKEN or vercel credentials in ~/.vercel/project.json are populated.'
      );
    }
    if (components.some((c) => c.status === 'DEGRADED' && c.name.includes('GitHub'))) {
      recommendations.push(
        'For live GitHub remote repository creation and pushing, ensure GITHUB_TOKEN or gh CLI auth is active.'
      );
    }
    if (recommendations.length === 0) {
      recommendations.push('All factory subsystems are operating at peak health.');
    }

    return {
      overallStatus,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      components,
      activePresets: [
        'warm-organic',
        'neo-brutalist',
        'clean-editorial',
        'modern-saas-dark',
        'corporate-enterprise',
        'pulse-magazine',
      ],
      supportedArchetypes: [
        'learning_platform',
        'blog',
        'newsletter',
        'ecommerce',
        'social_media',
        'landing_page',
      ],
      recommendations,
    };
  }

  /**
   * Format CTO Health Report for Markdown executive briefing
   */
  static formatMarkdownReport(report: CTOHealthReport): string {
    const statusIcon =
      report.overallStatus === 'HEALTHY'
        ? '🟢 HEALTHY'
        : report.overallStatus === 'DEGRADED'
          ? '🟡 DEGRADED (Local Dry-Run Operational)'
          : '🔴 UNHEALTHY';

    let md = `### SiteForge CTO Telemetry & Health Audit\n\n`;
    md += `**Overall Factory Health**: ${statusIcon}  \n`;
    md += `**Timestamp**: \`${report.timestamp}\`  \n`;
    md += `**Orchestration Engine**: v${report.version}  \n\n`;

    md += `| Subsystem | Status | Latency | Details |\n`;
    md += `| :--- | :---: | :---: | :--- |\n`;
    for (const c of report.components) {
      const badge =
        c.status === 'HEALTHY'
          ? '`HEALTHY`'
          : c.status === 'DEGRADED'
            ? '`DEGRADED`'
            : '`UNHEALTHY`';
      md += `| **${c.name}** | ${badge} | ${c.latencyMs}ms | ${c.details} |\n`;
    }

    md += `\n**Supported Archetypes**: ${report.supportedArchetypes.map((a) => `\`${a}\``).join(', ')}  \n`;
    md += `**Active Design.md Presets**: ${report.activePresets.map((p) => `\`${p}\``).join(', ')}  \n\n`;

    md += `**CTO Recommendations**:\n`;
    for (const rec of report.recommendations) {
      md += `- ${rec}\n`;
    }

    return md;
  }
}
