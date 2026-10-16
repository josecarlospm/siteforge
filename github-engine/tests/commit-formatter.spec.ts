import { describe, it, expect } from 'vitest';
import { CommitFormatter } from '../src/git/commit-formatter.js';

describe('Commit Formatter', () => {
  it('should format conventional commit message with archetype and preset', () => {
    const payload: any = {
      version: '1.0.0',
      siteType: 'learning_platform',
      designPreset: 'warm-organic',
      theme: {
        name: 'PlantCare Academy',
        topic: 'Indoor Houseplants',
        tagline: 'Keep indoor plants thriving',
      },
      integrations: {
        github: { repoName: 'plantcare-academy-web' },
      },
    };

    const formatted = CommitFormatter.formatInitialCommit(payload, { filesCount: 14 });
    expect(formatted.summary).toBe('feat(factory): initial hydrate plantcare-academy-web [learning_platform/warm-organic]');
    expect(formatted.body).toContain('• Framework: Modern Angular 19+');
    expect(formatted.body).toContain('• Performance: Zoneless Change Detection');
    expect(formatted.body).toContain('• Hydrated Files: 14 project files');
    expect(formatted.fullMessage).toContain(formatted.summary);
  });
});
