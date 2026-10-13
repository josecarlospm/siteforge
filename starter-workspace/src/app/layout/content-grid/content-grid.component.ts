import { Component, input } from '@angular/core';

@Component({
  selector: 'sf-content-grid',
  template: `
    <div
      class="grid-container"
      [class.cols-2]="columns() === 2"
      [class.cols-3]="columns() === 3"
      [class.cols-4]="columns() === 4"
      [class.gap-sm]="gap() === 'sm'"
      [class.gap-md]="gap() === 'md'"
      [class.gap-lg]="gap() === 'lg'"
    >
      <ng-content />
    </div>
  `,
  styles: [`
    .grid-container {
      display: grid;
      width: 100%;
    }

    .cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .gap-sm {
      gap: var(--spacing-4);
    }

    .gap-md {
      gap: var(--spacing-6);
    }

    .gap-lg {
      gap: var(--spacing-8);
    }

    @media (max-width: 1024px) {
      .cols-3, .cols-4 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 640px) {
      .cols-2, .cols-3, .cols-4 {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ContentGridComponent {
  readonly columns = input<2 | 3 | 4>(3);
  readonly gap = input<'sm' | 'md' | 'lg'>('md');
}
