import { z } from 'zod';

export const githubRepoNameRegex = /^[a-zA-Z0-9._-]+$/;
export const vercelProjectNameRegex = /^[a-z0-9-]+$/;

export const githubIntegrationSchema = z.object({
  repoName: z
    .string()
    .min(1, 'GitHub repoName is required')
    .max(100, 'GitHub repoName cannot exceed 100 characters')
    .regex(
      githubRepoNameRegex,
      'GitHub repoName may only contain alphanumeric characters, hyphens, underscores, and periods'
    )
    .refine((name) => !name.startsWith('.') && !name.endsWith('.'), {
      message: 'GitHub repoName cannot start or end with a period',
    })
    .refine((name) => !name.endsWith('.git'), {
      message: 'GitHub repoName cannot end with .git',
    }),
  owner: z.string().min(1, 'GitHub owner cannot be empty').optional(),
  isPrivate: z.boolean().default(false),
  autoInit: z.boolean().default(true),
  defaultBranch: z.string().min(1).default('main'),
  description: z.string().max(350).optional(),
  topics: z.array(z.string().min(1).max(50)).optional(),
});

export const vercelIntegrationSchema = z.object({
  projectName: z
    .string()
    .min(1, 'Vercel projectName is required')
    .max(100, 'Vercel projectName cannot exceed 100 characters')
    .regex(
      vercelProjectNameRegex,
      'Vercel projectName must consist of lowercase alphanumeric characters and hyphens only'
    )
    .refine((name) => !name.startsWith('-') && !name.endsWith('-'), {
      message: 'Vercel projectName cannot start or end with a hyphen',
    }),
  teamId: z.string().min(1).optional(),
  framework: z.string().min(1).default('angular'),
  buildCommand: z.string().optional(),
  outputDirectory: z.string().optional(),
  envVariables: z.record(z.string(), z.string()).optional(),
});

export const integrationsConfigSchema = z.object({
  github: githubIntegrationSchema,
  vercel: vercelIntegrationSchema,
});
