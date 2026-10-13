export class WorkspaceTemplates {
  static getPackageJson(projectName: string): string {
    return JSON.stringify(
      {
        name: projectName,
        version: '1.0.0',
        private: true,
        scripts: {
          ng: 'ng',
          start: 'ng serve',
          build: 'ng build',
          watch: 'ng build --watch --configuration development',
          test: 'ng test --no-watch',
        },
        dependencies: {
          '@angular/common': '^22.2.0',
          '@angular/compiler': '^22.2.0',
          '@angular/core': '^22.2.0',
          '@angular/forms': '^22.2.0',
          '@angular/platform-browser': '^22.2.0',
          '@angular/router': '^22.2.0',
          rxjs: '~7.8.0',
          tslib: '^2.3.0',
        },
        devDependencies: {
          '@angular/build': '^22.2.2',
          '@angular/cli': '^22.2.2',
          '@angular/compiler-cli': '^22.2.0',
          jsdom: '^30.0.0',
          typescript: '~6.0.2',
          vitest: '^5.0.0',
        },
      },
      null,
      2
    );
  }

  static getAngularJson(projectName: string): string {
    return JSON.stringify(
      {
        $schema: './node_modules/@angular/cli/lib/config/schema.json',
        version: 1,
        newProjectRoot: 'projects',
        projects: {
          [projectName]: {
            projectType: 'application',
            schematics: {},
            root: '',
            sourceRoot: 'src',
            prefix: 'app',
            architect: {
              build: {
                builder: '@angular/build:application',
                options: {
                  browser: 'src/main.ts',
                  tsConfig: 'tsconfig.app.json',
                  styles: ['src/styles.css'],
                },
                configurations: {
                  production: {
                    outputHashing: 'all',
                  },
                  development: {
                    optimization: false,
                    sourceMap: true,
                  },
                },
                defaultConfiguration: 'production',
              },
              serve: {
                builder: '@angular/build:dev-server',
                configurations: {
                  production: {
                    buildTarget: `${projectName}:build:production`,
                  },
                  development: {
                    buildTarget: `${projectName}:build:development`,
                  },
                },
                defaultConfiguration: 'development',
              },
              test: {
                builder: '@angular/build:unit-test',
              },
            },
          },
        },
      },
      null,
      2
    );
  }

  static getTsConfig(): string {
    return JSON.stringify(
      {
        compileOnSave: false,
        compilerOptions: {
          outDir: './dist/out-tsc',
          strict: true,
          noImplicitOverride: true,
          noPropertyAccessFromIndexSignature: true,
          noImplicitReturns: true,
          noFallthroughCasesInSwitch: true,
          skipLibCheck: true,
          isolatedModules: true,
          esModuleInterop: true,
          experimentalDecorators: true,
          moduleResolution: 'bundler',
          importHelpers: true,
          target: 'ES2022',
          module: 'ES2022',
        },
        angularCompilerOptions: {
          enableI18nLegacyMessageIdFormat: false,
          strictInjectionParameters: true,
          strictInputAccessModifiers: true,
          strictTemplates: true,
        },
      },
      null,
      2
    );
  }

  static getTsConfigApp(): string {
    return JSON.stringify(
      {
        extends: './tsconfig.json',
        compilerOptions: {
          outDir: './dist/out-tsc/app',
          types: [],
        },
        files: ['src/main.ts'],
        include: ['src/**/*.d.ts'],
      },
      null,
      2
    );
  }

  static getMainTs(): string {
    return `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
`;
  }

  static getAppConfig(): string {
    return `import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
  ],
};
`;
  }

  static getAppRoutes(): string {
    return `import { Routes } from '@angular/router';

export const routes: Routes = [];
`;
  }

  static getAppTs(title: string): string {
    return `import { Component } from '@angular/core';
import { ArchetypeViewComponent } from './archetype-view.component';

@Component({
  imports: [ArchetypeViewComponent],
  selector: 'app-root',
  template: \`
    <main>
      <sf-archetype-view />
    </main>
  \`,
})
export class App {
  readonly title = '${title}';
}
`;
  }

  static getIndexHtml(title: string, description: string): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${description}" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
`;
  }

  static getStylesCss(): string {
    return `@import './design-tokens.css';

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  min-height: 100%;
  background-color: var(--color-bg);
  color: var(--color-text-main);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--line-height-normal);
  transition: background-color var(--transition-normal), color var(--transition-normal);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  line-height: var(--line-height-tight);
}

.sf-container {
  max-width: var(--container-max-w);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-6);
  padding-right: var(--spacing-6);
}

.sf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--radius-btn);
  font-weight: 600;
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
  border: var(--border-width) solid transparent;
  cursor: pointer;
}

.sf-btn-primary {
  background-color: var(--color-primary);
  color: #FFFFFF;
  box-shadow: var(--shadow-button);
}

.sf-btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

.sf-btn-secondary {
  background-color: var(--color-surface);
  color: var(--color-text-main);
  border-color: var(--color-border);
}

.sf-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: var(--color-surface-muted);
  color: var(--color-text-muted);
  border: var(--border-width) solid var(--color-border);
}

.sf-badge-primary {
  background-color: var(--color-primary);
  color: #FFFFFF;
  border-color: transparent;
}

.sf-badge-accent {
  background-color: var(--color-accent);
  color: #FFFFFF;
  border-color: transparent;
}
`;
  }
}
