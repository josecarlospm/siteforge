import { Component, inject, signal, computed } from '@angular/core';
import { PayloadService } from '../../core/services/payload.service';
import { ThemeService } from '../../core/services/theme.service';
import { CourseEntity } from '../../core/models/site-payload.model';
import { HeaderComponent } from '../../layout/header/header.component';
import { HeroComponent } from '../../layout/hero/hero.component';
import { ContentGridComponent } from '../../layout/content-grid/content-grid.component';
import { CardComponent } from '../../layout/card/card.component';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { FooterComponent } from '../../layout/footer/footer.component';

@Component({
  selector: 'sf-plantcare-showcase',
  imports: [
    HeaderComponent,
    HeroComponent,
    ContentGridComponent,
    CardComponent,
    SidebarComponent,
    FooterComponent,
  ],
  template: `
    <div class="showcase-shell">
      <!-- Layout Primitive: Header -->
      <sf-header
        [brandName]="payloadService.theme().name"
        [tagline]="payloadService.theme().topic"
        [(searchQuery)]="searchQuery"
      />

      <main>
        <!-- Layout Primitive: Hero -->
        <sf-hero
          [badge]="'Flagship Archetype: learning_platform'"
          [title]="payloadService.theme().tagline"
          [subtitle]="payloadService.theme().description"
          [ctaText]="'Explore Masterclasses'"
          [ctaHref]="'#catalog'"
          [secondaryCtaText]="'Light Diagnostics Guide'"
          [secondaryCtaHref]="'#diagnostics'"
          [stats]="payloadService.payload().theme.content?.stats ?? []"
        />

        <!-- Theme Preset Info Banner -->
        <section class="preset-banner sf-container">
          <div class="preset-pill">
            <span class="preset-indicator">●</span>
            Active Design Token Preset:
            <strong>{{ themeService.currentTokens().displayName }}</strong>
            <span class="preset-desc">({{ themeService.currentTokens().description }})</span>
          </div>
        </section>

        <!-- Course Catalog Main Section with Sidebar & ContentGrid -->
        <section id="catalog" class="catalog-section sf-container">
          <div class="catalog-layout">
            <!-- Layout Primitive: Sidebar -->
            <div class="catalog-sidebar">
              <sf-sidebar
                [title]="'Filter by Category'"
                [badge]="'Interactive'"
                [items]="payloadService.payload().theme.content?.featuredCategories ?? []"
                [(selectedItem)]="selectedCategory"
              />
            </div>

            <!-- Main Content Area -->
            <div class="catalog-content">
              <div class="content-header">
                <div>
                  <h2 class="section-title">Horticultural Masterclasses</h2>
                  <p class="section-subtitle">
                    Showing {{ payloadService.filteredCourses().length }} course(s) for
                    "{{ selectedCategory }}"
                  </p>
                </div>
              </div>

              <!-- Layout Primitive: ContentGrid -->
              <sf-content-grid [columns]="2" [gap]="'lg'">
                @for (course of payloadService.filteredCourses(); track course.id) {
                  <!-- Layout Primitive: Card -->
                  <sf-card
                    [title]="course.title"
                    [subtitle]="course.instructor"
                    [badge]="course.badge ?? ''"
                    [icon]="'🪴'"
                    [summary]="course.summary"
                    [rating]="course.rating"
                    [meta]="course.duration + ' • ' + course.lessonsCount + ' lessons • ' + course.studentsCount + ' students'"
                    [actionLabel]="'Start Masterclass'"
                    (action)="onSelectCourse(course)"
                  >
                    <!-- Expandable modules preview -->
                    <div class="modules-preview">
                      <div class="modules-title">Curriculum Snapshot:</div>
                      <ul class="modules-list">
                        @for (module of course.modules; track module.title) {
                          <li class="module-item">
                            <span>✓ {{ module.title }}</span>
                            <span class="module-duration">{{ module.duration }}</span>
                          </li>
                        }
                      </ul>
                    </div>
                  </sf-card>
                } @empty {
                  <div class="empty-state">
                    <p>No courses match your filter. Try clearing the search or category.</p>
                  </div>
                }
              </sf-content-grid>
            </div>
          </div>
        </section>

        <!-- Diagnostics & Botanical Care Spotlight Section -->
        <section id="diagnostics" class="diagnostics-section sf-container">
          <div class="diagnostics-card">
            <div class="diagnostics-header">
              <span class="sf-badge sf-badge-primary">Interactive Diagnostic</span>
              <h2 class="diagnostics-title">Indoor Light & Foot-Candles Calculator</h2>
              <p class="diagnostics-subtitle">
                Select your window orientation to calculate recommended light saturation for tropical plants.
              </p>
            </div>

            <div class="orientation-buttons">
              @for (orient of orientations; track orient.key) {
                <button
                  type="button"
                  class="sf-btn"
                  [class.sf-btn-primary]="selectedOrientation() === orient.key"
                  [class.sf-btn-secondary]="selectedOrientation() !== orient.key"
                  (click)="selectedOrientation.set(orient.key)"
                >
                  {{ orient.label }}
                </button>
              }
            </div>

            <div class="orientation-result">
              <div class="result-box">
                <div class="result-number">{{ currentLightData().footCandles }} FC</div>
                <div class="result-label">Available Foot-Candles</div>
              </div>
              <div class="result-advice">
                <strong>Recommended Species:</strong>
                {{ currentLightData().recommendation }}
              </div>
            </div>
          </div>
        </section>

        <!-- Testimonials Section -->
        <section class="testimonials-section sf-container">
          <h2 class="testimonials-title">Botanist Community Results</h2>
          <sf-content-grid [columns]="2" [gap]="'md'">
            @for (testimonial of payloadService.payload().theme.content?.testimonials ?? []; track testimonial.author) {
              <div class="testimonial-card">
                <p class="testimonial-quote">"{{ testimonial.quote }}"</p>
                <div class="testimonial-author">
                  <strong>{{ testimonial.author }}</strong>
                  <span>{{ testimonial.role }}</span>
                </div>
              </div>
            }
          </sf-content-grid>
        </section>
      </main>

      <!-- Layout Primitive: Footer -->
      <sf-footer
        [brandName]="payloadService.theme().name"
        [description]="payloadService.theme().description"
      />
    </div>
  `,
  styles: [`
    .showcase-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .preset-banner {
      margin-top: var(--spacing-6);
      margin-bottom: var(--spacing-4);
    }

    .preset-pill {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2) var(--spacing-4);
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-pill);
      font-size: var(--text-xs);
      color: var(--color-text-main);
      box-shadow: var(--shadow-card);
    }

    .preset-indicator {
      color: var(--color-primary);
      font-size: var(--text-sm);
    }

    .preset-desc {
      color: var(--color-text-muted);
    }

    .catalog-section {
      padding-top: var(--spacing-8);
      padding-bottom: var(--spacing-12);
    }

    .catalog-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: var(--spacing-8);
      align-items: start;
    }

    .content-header {
      margin-bottom: var(--spacing-6);
    }

    .section-title {
      font-size: var(--text-2xl);
      font-weight: 800;
    }

    .section-subtitle {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      margin-top: var(--spacing-1);
    }

    .modules-preview {
      background-color: var(--color-surface-muted);
      border-radius: var(--radius-sm);
      padding: var(--spacing-3);
      font-size: var(--text-xs);
    }

    .modules-title {
      font-weight: 700;
      color: var(--color-text-main);
      margin-bottom: var(--spacing-2);
    }

    .modules-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .module-item {
      display: flex;
      justify-content: space-between;
      color: var(--color-text-muted);
    }

    .module-duration {
      font-weight: 600;
    }

    .empty-state {
      grid-column: 1 / -1;
      padding: var(--spacing-12);
      text-align: center;
      background-color: var(--color-surface);
      border-radius: var(--radius-card);
      border: var(--border-width) dashed var(--color-border);
      color: var(--color-text-muted);
    }

    .diagnostics-section {
      padding-top: var(--spacing-8);
      padding-bottom: var(--spacing-12);
    }

    .diagnostics-card {
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      padding: var(--spacing-8);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
    }

    .diagnostics-title {
      font-size: var(--text-2xl);
      font-weight: 800;
      margin-top: var(--spacing-2);
    }

    .diagnostics-subtitle {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
    }

    .orientation-buttons {
      display: flex;
      gap: var(--spacing-3);
      flex-wrap: wrap;
    }

    .orientation-result {
      display: flex;
      align-items: center;
      gap: var(--spacing-8);
      padding: var(--spacing-6);
      background-color: var(--color-surface-muted);
      border-radius: var(--radius-md);
      border-left: 4px solid var(--color-primary);
    }

    .result-box {
      display: flex;
      flex-direction: column;
    }

    .result-number {
      font-family: var(--font-heading);
      font-size: var(--text-3xl);
      font-weight: 800;
      color: var(--color-primary);
    }

    .result-label {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .result-advice {
      font-size: var(--text-sm);
      color: var(--color-text-main);
      line-height: var(--line-height-relaxed);
    }

    .testimonials-section {
      padding-top: var(--spacing-8);
      padding-bottom: var(--spacing-12);
    }

    .testimonials-title {
      font-size: var(--text-2xl);
      font-weight: 800;
      text-align: center;
      margin-bottom: var(--spacing-8);
    }

    .testimonial-card {
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      padding: var(--spacing-6);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: var(--spacing-4);
    }

    .testimonial-quote {
      font-size: var(--text-sm);
      font-style: italic;
      color: var(--color-text-main);
      line-height: var(--line-height-relaxed);
    }

    .testimonial-author {
      display: flex;
      flex-direction: column;
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      border-top: var(--border-width) solid var(--color-border);
      padding-top: var(--spacing-2);
    }

    @media (max-width: 900px) {
      .catalog-layout {
        grid-template-columns: 1fr;
      }
      .orientation-result {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-4);
      }
    }
  `],
})
export class PlantCareShowcaseComponent {
  readonly payloadService = inject(PayloadService);
  readonly themeService = inject(ThemeService);

  readonly orientations = [
    { key: 'south', label: 'South Window (High Direct)' },
    { key: 'east-west', label: 'East/West Window (Medium Bright)' },
    { key: 'north', label: 'North Window (Low Gentle)' },
  ];

  readonly selectedOrientation = signal<string>('east-west');

  readonly currentLightData = computed(() => {
    switch (this.selectedOrientation()) {
      case 'south':
        return {
          footCandles: '1,500 – 3,000',
          recommendation: 'Fiddle Leaf Fig, Cacti, Succulents, Citrus, Bird of Paradise.',
        };
      case 'north':
        return {
          footCandles: '200 – 400',
          recommendation: 'Snake Plant, ZZ Plant, Cast Iron Plant, Pothos, Peace Lily.',
        };
      case 'east-west':
      default:
        return {
          footCandles: '600 – 1,200',
          recommendation: 'Monstera Deliciosa, Calathea, Philodendron, Anthurium, Ferns.',
        };
    }
  });

  get searchQuery(): string {
    return this.payloadService.searchQuery();
  }

  set searchQuery(value: string) {
    this.payloadService.setSearchQuery(value);
  }

  get selectedCategory(): string {
    return this.payloadService.selectedCategory();
  }

  set selectedCategory(value: string) {
    this.payloadService.setSelectedCategory(value);
  }

  onSelectCourse(course: CourseEntity): void {
    alert(`Enrolled in "${course.title}" taught by ${course.instructor}`);
  }
}
