import { Component, input, model } from '@angular/core';

@Component({
  selector: 'sf-sidebar',
  template: `
    <aside class="sidebar-root">
      <div class="sidebar-header">
        <h4 class="sidebar-title">{{ title() }}</h4>
        @if (badge()) {
          <span class="sf-badge sf-badge-primary">{{ badge() }}</span>
        }
      </div>

      <nav class="sidebar-nav">
        @for (item of items(); track item) {
          <button
            type="button"
            class="sidebar-item"
            [class.active]="selectedItem() === item"
            (click)="selectItem(item)"
          >
            <span class="bullet" [class.bullet-active]="selectedItem() === item"></span>
            <span class="label">{{ item }}</span>
          </button>
        }
      </nav>

      <div class="sidebar-footer">
        <div class="diagnostic-box">
          <span class="diagnostic-icon">💡</span>
          <div class="diagnostic-text">
            <strong>Care Tip:</strong> Always check root aeration before increasing hydration.
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-root {
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      padding: var(--spacing-6);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
      width: 100%;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: var(--border-width) solid var(--color-border);
      padding-bottom: var(--spacing-3);
    }

    .sidebar-title {
      font-size: var(--text-base);
      font-weight: 700;
      color: var(--color-text-main);
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .sidebar-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-2) var(--spacing-3);
      border-radius: var(--radius-btn);
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      font-weight: 500;
      text-align: left;
      transition: all var(--transition-fast);
      border: var(--border-width) solid transparent;
    }

    .sidebar-item:hover {
      background-color: var(--color-surface-muted);
      color: var(--color-text-main);
    }

    .sidebar-item.active {
      background-color: var(--color-surface-muted);
      color: var(--color-primary);
      font-weight: 700;
      border-color: var(--color-border);
    }

    .bullet {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--color-border);
      transition: background-color var(--transition-fast);
    }

    .bullet-active {
      background-color: var(--color-primary);
    }

    .sidebar-footer {
      border-top: var(--border-width) solid var(--color-border);
      padding-top: var(--spacing-4);
    }

    .diagnostic-box {
      display: flex;
      gap: var(--spacing-3);
      padding: var(--spacing-3);
      border-radius: var(--radius-md);
      background-color: var(--color-surface-muted);
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      line-height: var(--line-height-normal);
    }

    .diagnostic-icon {
      font-size: var(--text-base);
    }
  `],
})
export class SidebarComponent {
  readonly title = input<string>('Filter by Category');
  readonly items = input<string[]>([]);
  readonly badge = input<string>('');
  readonly selectedItem = model<string>('');

  selectItem(item: string): void {
    this.selectedItem.set(item);
  }
}
