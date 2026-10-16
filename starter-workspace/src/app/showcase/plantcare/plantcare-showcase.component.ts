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
          [secondaryCtaText]="'Interactive Lesson Studio'"
          [secondaryCtaHref]="'#lesson-preview'"
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

        <!-- Course Catalog Main Section with Filter Chips & Sidebar & ContentGrid -->
        <section id="catalog" class="catalog-section sf-container">
          <!-- Filter Chips Bar -->
          <div class="filter-chips-bar">
            <span class="filter-chips-label">Browse by Category:</span>
            <div class="chips-container">
              <button
                type="button"
                class="chip"
                [class.chip-active]="selectedCategory === 'All Categories'"
                (click)="selectedCategory = 'All Categories'"
              >
                All Categories ({{ payloadService.payload().theme.content?.courses?.length ?? 3 }})
              </button>
              @for (cat of payloadService.payload().theme.content?.featuredCategories ?? []; track cat) {
                <button
                  type="button"
                  class="chip"
                  [class.chip-active]="selectedCategory === cat"
                  (click)="selectedCategory = cat"
                >
                  {{ cat }}
                </button>
              }
            </div>
          </div>

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
                    [actionLabel]="'Preview Lesson & Video →'"
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

        <!-- Interactive Lesson Detail Preview Section (Video Player Stub & Guides) -->
        <section id="lesson-preview" class="lesson-preview-section sf-container">
          <div class="section-heading">
            <span class="sf-badge sf-badge-primary">Interactive Masterclass Studio</span>
            <h2 class="section-title">Lesson Detail Preview: {{ activeCourse().title }}</h2>
            <p class="section-subtitle">
              Interactive video player stub with timeline scrubber, audio control, and step-by-step care guide.
            </p>
          </div>

          <div class="preview-layout">
            <!-- Left: Video Player Stub -->
            <div class="video-player-container">
              <div class="player-screen">
                <div class="video-artwork">
                  <div class="artwork-icon">🪴</div>
                  <div class="video-active-title">{{ activeCourse().title }}</div>
                  <div class="video-active-instructor">Instructor: {{ activeCourse().instructor }}</div>
                </div>

                <!-- Overlay Controls -->
                <div class="player-overlay">
                  <button type="button" class="play-btn" (click)="togglePlay()">
                    @if (isPlaying()) {
                      <span>⏸</span>
                    } @else {
                      <span>▶</span>
                    }
                  </button>
                </div>

                <!-- Stream Status Badge -->
                <div class="stream-badge">
                  @if (isPlaying()) {
                    <span class="badge-live">● Live Stream (1080p Botanical Feed)</span>
                  } @else {
                    <span class="badge-paused">⏸ Paused at {{ formattedPlaybackTime() }}</span>
                  }
                </div>
              </div>

              <!-- Video Scrubber & Bar -->
              <div class="player-controls-bar">
                <div class="time-display">{{ formattedPlaybackTime() }} / 22:00</div>
                <input
                  type="range"
                  class="scrubber-range"
                  min="0"
                  max="1320"
                  [value]="playbackSeconds()"
                  (input)="onScrub($event)"
                />
                <div class="control-actions">
                  <button type="button" class="ctrl-btn" (click)="toggleMute()">
                    {{ isMuted() ? '🔇 Unmute' : '🔊 Mute' }}
                  </button>
                  <button type="button" class="ctrl-btn" (click)="cycleSpeed()">
                    Speed: {{ playbackSpeed() }}
                  </button>
                </div>
              </div>

              <div class="active-module-bar">
                <strong>Current Module:</strong>
                <span>{{ activeCourse().modules?.[0]?.title ?? 'Core Botanical Principles' }}</span>
              </div>
            </div>

            <!-- Right: Step-by-Step Care Checklist Guide -->
            <div class="guide-container">
              <div class="guide-header">
                <h3 class="guide-title">Horticultural Action Checklist</h3>
                <div class="guide-progress">
                  <span>Progress: {{ guideProgressPercent() }}%</span>
                  <div class="progress-track">
                    <div class="progress-fill" [style.width.%]="guideProgressPercent()"></div>
                  </div>
                </div>
              </div>

              <div class="steps-list">
                @for (step of careSteps; track step.number) {
                  <div
                    class="step-card"
                    [class.step-completed]="isStepCompleted(step.number)"
                    (click)="toggleStep(step.number)"
                  >
                    <div class="step-checkbox">
                      @if (isStepCompleted(step.number)) {
                        <span>✓</span>
                      } @else {
                        <span>{{ step.number }}</span>
                      }
                    </div>
                    <div class="step-content">
                      <h4 class="step-heading">Step {{ step.number }}: {{ step.title }}</h4>
                      <p class="step-desc">{{ step.instruction }}</p>
                      <span class="step-hint">Click to toggle completion status</span>
                    </div>
                  </div>
                }
              </div>

              <div class="pro-tip-box">
                <span class="tip-icon">💡</span>
                <div class="tip-text">
                  <strong>Botanist Pro-Tip:</strong>
                  Never pack chunky aroid mix tightly around root crowns; tap the planter gently to let particles settle without crushing air pockets.
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Diagnostics & Botanical Care Spotlight Section -->
        <section id="diagnostics" class="diagnostics-section sf-container">
          <div class="section-heading">
            <span class="sf-badge sf-badge-primary">Botanical Care Tools</span>
            <h2 class="section-title">Indoor Diagnostics & Calculators</h2>
            <p class="section-subtitle">
              Science-backed formulas to ensure accurate lighting and moisture levels in your living space.
            </p>
          </div>

          <div class="diagnostics-grid">
            <!-- Light Calculator -->
            <div class="diagnostics-card">
              <div class="diagnostics-header">
                <span class="sf-badge sf-badge-primary">Light Calculator</span>
                <h3 class="diagnostics-title">Indoor Light & Foot-Candles Lux</h3>
                <p class="diagnostics-subtitle">
                  Select window orientation to calculate recommended light saturation for tropical plants.
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

            <!-- Watering Schedule Matrix -->
            <div id="watering" class="diagnostics-card">
              <div class="diagnostics-header">
                <span class="sf-badge sf-badge-accent">Watering Schedule Matrix</span>
                <h3 class="diagnostics-title">Soil Porosity & Container Dynamics</h3>
                <p class="diagnostics-subtitle">
                  Calculate ideal watering frequency based on substrate type and pot material.
                </p>
              </div>

              <div class="matrix-selector">
                <div class="selector-label">Substrate:</div>
                <div class="orientation-buttons">
                  <button
                    type="button"
                    class="sf-btn sf-btn-sm"
                    [class.sf-btn-primary]="selectedSubstrate() === 'aroid'"
                    [class.sf-btn-secondary]="selectedSubstrate() !== 'aroid'"
                    (click)="selectedSubstrate.set('aroid')"
                  >
                    Chunky Aroid Mix
                  </button>
                  <button
                    type="button"
                    class="sf-btn sf-btn-sm"
                    [class.sf-btn-primary]="selectedSubstrate() === 'peat'"
                    [class.sf-btn-secondary]="selectedSubstrate() !== 'peat'"
                    (click)="selectedSubstrate.set('peat')"
                  >
                    Peat/Perlite Blend
                  </button>
                  <button
                    type="button"
                    class="sf-btn sf-btn-sm"
                    [class.sf-btn-primary]="selectedSubstrate() === 'succulent'"
                    [class.sf-btn-secondary]="selectedSubstrate() !== 'succulent'"
                    (click)="selectedSubstrate.set('succulent')"
                  >
                    Gritty Succulent Mix
                  </button>
                </div>
              </div>

              <div class="matrix-selector">
                <div class="selector-label">Pot Material:</div>
                <div class="orientation-buttons">
                  <button
                    type="button"
                    class="sf-btn sf-btn-sm"
                    [class.sf-btn-primary]="selectedPot() === 'terracotta'"
                    [class.sf-btn-secondary]="selectedPot() !== 'terracotta'"
                    (click)="selectedPot.set('terracotta')"
                  >
                    Terracotta (Porous)
                  </button>
                  <button
                    type="button"
                    class="sf-btn sf-btn-sm"
                    [class.sf-btn-primary]="selectedPot() === 'ceramic'"
                    [class.sf-btn-secondary]="selectedPot() !== 'ceramic'"
                    (click)="selectedPot.set('ceramic')"
                  >
                    Glazed Ceramic
                  </button>
                  <button
                    type="button"
                    class="sf-btn sf-btn-sm"
                    [class.sf-btn-primary]="selectedPot() === 'plastic'"
                    [class.sf-btn-secondary]="selectedPot() !== 'plastic'"
                    (click)="selectedPot.set('plastic')"
                  >
                    Nursery Plastic
                  </button>
                </div>
              </div>

              <div class="orientation-result">
                <div class="result-box">
                  <div class="result-number">{{ currentWateringAdvice().frequency }}</div>
                  <div class="result-label">Recommended Frequency</div>
                </div>
                <div class="result-advice">
                  <strong>Pathology Advice:</strong>
                  {{ currentWateringAdvice().note }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Seasonal Tips Newsletter Subscription -->
        <section id="newsletter" class="newsletter-section sf-container">
          <div class="newsletter-card">
            <div class="newsletter-header">
              <span class="sf-badge sf-badge-primary">Curated Botanist Dispatch</span>
              <h2 class="newsletter-title">Seasonal Plant Care Alerts</h2>
              <p class="newsletter-subtitle">
                Select your season to preview climate care adjustments and subscribe to weekly horticultural briefings.
              </p>
            </div>

            <!-- Season Selector Tabs -->
            <div class="season-tabs">
              @for (season of seasons; track season.key) {
                <button
                  type="button"
                  class="season-tab"
                  [class.season-tab-active]="selectedSeason() === season.key"
                  (click)="selectedSeason.set(season.key)"
                >
                  <span class="season-icon">{{ season.icon }}</span>
                  <span class="season-name">{{ season.name }}</span>
                </button>
              }
            </div>

            <!-- Seasonal Tip Content -->
            <div class="season-preview-box">
              <div class="season-focus">
                <strong>Focus for {{ currentSeasonTip().name }}:</strong>
                {{ currentSeasonTip().focus }}
              </div>
              <p class="season-detail">{{ currentSeasonTip().detail }}</p>
            </div>

            <!-- Subscription Form -->
            <div class="subscription-form-wrapper">
              @if (isSubscribed()) {
                <div class="sub-success-message">
                  ✓ Success! You are subscribed with <strong>{{ newsletterEmail() }}</strong>. Look out for the {{ currentSeasonTip().name }} botanical guide in your inbox.
                </div>
              } @else {
                <form class="sub-form" (submit)="onSubscribe($event)">
                  <input
                    type="email"
                    class="sub-input"
                    placeholder="Enter your email (e.g. botanist@indoorjungle.com)"
                    [value]="newsletterEmail()"
                    (input)="onEmailInput($event)"
                    required
                  />
                  <button type="submit" class="sf-btn sf-btn-primary sub-btn">
                    Subscribe to {{ currentSeasonTip().name }} Tips →
                  </button>
                </form>
              }
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

    /* Filter Chips Bar */
    .filter-chips-bar {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-8);
      flex-wrap: wrap;
      padding: var(--spacing-4);
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
    }

    .filter-chips-label {
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .chips-container {
      display: flex;
      gap: var(--spacing-2);
      flex-wrap: wrap;
    }

    .chip {
      padding: var(--spacing-2) var(--spacing-4);
      background-color: var(--color-surface-muted);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-pill);
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--color-text-main);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .chip:hover {
      border-color: var(--color-primary);
    }

    .chip-active {
      background-color: var(--color-primary);
      color: #FFFFFF;
      border-color: var(--color-primary);
    }

    .catalog-section {
      padding-top: var(--spacing-4);
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

    /* Lesson Preview Studio */
    .lesson-preview-section {
      padding: var(--spacing-16) 0;
      border-top: var(--border-width) solid var(--color-border);
    }

    .section-heading {
      text-align: center;
      margin-bottom: var(--spacing-8);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2);
    }

    .preview-layout {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: var(--spacing-8);
      align-items: start;
    }

    .video-player-container {
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .player-screen {
      position: relative;
      height: 300px;
      background: linear-gradient(135deg, #1C2B1A 0%, #0F1A0E 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      overflow: hidden;
    }

    .video-artwork {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--spacing-2);
      padding: var(--spacing-4);
    }

    .artwork-icon {
      font-size: 3rem;
    }

    .video-active-title {
      font-family: var(--font-heading);
      font-size: var(--text-lg);
      font-weight: 700;
      max-width: 360px;
    }

    .video-active-instructor {
      font-size: var(--text-xs);
      color: var(--color-accent);
    }

    .player-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.2);
    }

    .play-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: var(--color-primary);
      color: #FFFFFF;
      border: none;
      font-size: var(--text-2xl);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      transition: transform var(--transition-fast);
    }

    .play-btn:hover {
      transform: scale(1.1);
    }

    .stream-badge {
      position: absolute;
      top: var(--spacing-3);
      left: var(--spacing-3);
      font-size: var(--text-xs);
      background-color: rgba(0, 0, 0, 0.6);
      padding: var(--spacing-1) var(--spacing-3);
      border-radius: var(--radius-pill);
    }

    .badge-live {
      color: #8FBC8F;
      font-weight: 700;
    }

    .badge-paused {
      color: #E6DDD4;
    }

    .player-controls-bar {
      padding: var(--spacing-3) var(--spacing-4);
      background-color: var(--color-surface);
      border-top: var(--border-width) solid var(--color-border);
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
    }

    .time-display {
      font-size: var(--text-xs);
      font-family: monospace;
      color: var(--color-text-muted);
      white-space: nowrap;
    }

    .scrubber-range {
      flex: 1;
      cursor: pointer;
      accent-color: var(--color-primary);
    }

    .control-actions {
      display: flex;
      gap: var(--spacing-2);
    }

    .ctrl-btn {
      padding: var(--spacing-1) var(--spacing-2);
      font-size: var(--text-xs);
      background-color: var(--color-surface-muted);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-btn);
      cursor: pointer;
      color: var(--color-text-main);
    }

    .active-module-bar {
      padding: var(--spacing-3) var(--spacing-4);
      background-color: var(--color-surface-muted);
      font-size: var(--text-xs);
      display: flex;
      gap: var(--spacing-2);
      border-top: var(--border-width) solid var(--color-border);
    }

    /* Guide Container */
    .guide-container {
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      padding: var(--spacing-6);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .guide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: var(--spacing-3);
      border-bottom: var(--border-width) solid var(--color-border);
    }

    .guide-title {
      font-size: var(--text-lg);
      font-weight: 800;
    }

    .guide-progress {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
      align-items: flex-end;
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--color-primary);
    }

    .progress-track {
      width: 100px;
      height: 6px;
      background-color: var(--color-surface-muted);
      border-radius: var(--radius-pill);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background-color: var(--color-primary);
      transition: width var(--transition-normal);
    }

    .steps-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }

    .step-card {
      display: flex;
      gap: var(--spacing-3);
      padding: var(--spacing-3);
      border-radius: var(--radius-sm);
      border: var(--border-width) solid var(--color-border);
      background-color: var(--color-surface-muted);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .step-card:hover {
      border-color: var(--color-primary);
    }

    .step-completed {
      background-color: #F1F6F0;
      border-color: var(--color-primary);
    }

    .step-checkbox {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-xs);
      font-weight: 700;
      flex-shrink: 0;
      color: var(--color-primary);
    }

    .step-completed .step-checkbox {
      background-color: var(--color-primary);
      color: #FFFFFF;
      border-color: var(--color-primary);
    }

    .step-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .step-heading {
      font-size: var(--text-sm);
      font-weight: 700;
    }

    .step-desc {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      line-height: var(--line-height-normal);
    }

    .step-hint {
      font-size: 10px;
      color: var(--color-primary);
      font-weight: 600;
    }

    .pro-tip-box {
      display: flex;
      gap: var(--spacing-3);
      padding: var(--spacing-3);
      background-color: #FBF4F0;
      border-left: 3px solid var(--color-accent);
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
      line-height: var(--line-height-normal);
      color: var(--color-text-main);
    }

    .tip-icon {
      font-size: var(--text-base);
    }

    /* Diagnostics Section */
    .diagnostics-section {
      padding-top: var(--spacing-8);
      padding-bottom: var(--spacing-12);
      border-top: var(--border-width) solid var(--color-border);
    }

    .diagnostics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-8);
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

    .sf-btn-sm {
      padding: var(--spacing-2) var(--spacing-3);
      font-size: var(--text-xs);
    }

    .matrix-selector {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .selector-label {
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--color-text-muted);
      text-transform: uppercase;
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

    /* Seasonal Newsletter */
    .newsletter-section {
      padding: var(--spacing-16) 0;
      border-top: var(--border-width) solid var(--color-border);
    }

    .newsletter-card {
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      padding: var(--spacing-8);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-6);
      max-width: 800px;
      margin: 0 auto;
    }

    .newsletter-header {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2);
    }

    .newsletter-title {
      font-size: var(--text-2xl);
      font-weight: 800;
    }

    .newsletter-subtitle {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      max-width: 540px;
    }

    .season-tabs {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-2);
    }

    .season-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-1);
      padding: var(--spacing-3);
      background-color: var(--color-surface-muted);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .season-tab-active {
      background-color: var(--color-primary);
      border-color: var(--color-primary);
      color: #FFFFFF;
    }

    .season-icon {
      font-size: var(--text-xl);
    }

    .season-name {
      font-size: var(--text-xs);
      font-weight: 700;
    }

    .season-preview-box {
      background-color: var(--color-surface-muted);
      border-radius: var(--radius-sm);
      padding: var(--spacing-4);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
      font-size: var(--text-xs);
    }

    .season-focus {
      color: var(--color-primary);
      font-weight: 700;
      font-size: var(--text-sm);
    }

    .season-detail {
      color: var(--color-text-muted);
      line-height: var(--line-height-normal);
    }

    .subscription-form-wrapper {
      margin-top: var(--spacing-2);
    }

    .sub-form {
      display: flex;
      gap: var(--spacing-2);
    }

    .sub-input {
      flex: 1;
      padding: var(--spacing-3) var(--spacing-4);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-btn);
      background-color: var(--color-surface-muted);
      color: var(--color-text-main);
      font-size: var(--text-sm);
      outline: none;
    }

    .sub-input:focus {
      border-color: var(--color-primary);
    }

    .sub-btn {
      white-space: nowrap;
    }

    .sub-success-message {
      padding: var(--spacing-4);
      background-color: #F1F6F0;
      border: var(--border-width) solid var(--color-primary);
      border-radius: var(--radius-btn);
      color: var(--color-primary);
      font-size: var(--text-sm);
      font-weight: 600;
      text-align: center;
    }

    .testimonials-section {
      padding-top: var(--spacing-8);
      padding-bottom: var(--spacing-12);
      border-top: var(--border-width) solid var(--color-border);
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
      .preview-layout {
        grid-template-columns: 1fr;
      }
      .diagnostics-grid {
        grid-template-columns: 1fr;
      }
      .orientation-result {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-4);
      }
      .season-tabs {
        grid-template-columns: repeat(2, 1fr);
      }
      .sub-form {
        flex-direction: column;
      }
    }
  `],
})
export class PlantCareShowcaseComponent {
  readonly payloadService = inject(PayloadService);
  readonly themeService = inject(ThemeService);

  // Video & Lesson Preview State
  readonly activeCourseId = signal<string>('course-monstera-101');
  readonly isPlaying = signal<boolean>(false);
  readonly isMuted = signal<boolean>(false);
  readonly playbackSeconds = signal<number>(142);
  readonly playbackSpeed = signal<string>('1x');
  readonly completedSteps = signal<number[]>([1]);

  // Care Tools
  readonly orientations = [
    { key: 'south', label: 'South Window (High Direct)' },
    { key: 'east-west', label: 'East/West Window (Medium Bright)' },
    { key: 'north', label: 'North Window (Low Gentle)' },
  ];
  readonly selectedOrientation = signal<string>('east-west');
  readonly selectedSubstrate = signal<string>('aroid');
  readonly selectedPot = signal<string>('terracotta');

  // Newsletter
  readonly seasons = [
    { key: 'spring', name: 'Spring', icon: '🌸' },
    { key: 'summer', name: 'Summer', icon: '☀️' },
    { key: 'autumn', name: 'Autumn', icon: '🍂' },
    { key: 'winter', name: 'Winter', icon: '❄️' },
  ];
  readonly selectedSeason = signal<string>('spring');
  readonly newsletterEmail = signal<string>('');
  readonly isSubscribed = signal<boolean>(false);

  readonly careSteps = [
    {
      number: 1,
      title: 'Substrate Aeration & Root Mass Examination',
      instruction: 'Unpot specimen, remove degraded nursery soil, and inspect root system for squishy brown necrosis.',
    },
    {
      number: 2,
      title: 'The 40/30/30 Aroid Soil Formula Mix',
      instruction: 'Combine 40% coarse pumice/perlite, 30% orchid bark, and 30% buffered coco coir with worm castings.',
    },
    {
      number: 3,
      title: 'Sanitize Pruners & Remove Debris',
      instruction: 'Wipe stainless shears with 70% isopropyl alcohol and cleanly sever dead roots above rot line.',
    },
    {
      number: 4,
      title: 'Sphagnum Pole Staking & Hydration',
      instruction: 'Anchor moist moss pole behind main stem and fasten aerial nodes with non-constricting garden velcro.',
    },
  ];

  readonly activeCourse = computed(() => {
    const list = this.payloadService.payload().theme.content?.courses ?? [];
    return list.find((c) => c.id === this.activeCourseId()) || list[0] || {
      id: 'course-monstera-101',
      title: 'Monstera Deliciosa: From Cuttings to Fenestrated Giant',
      instructor: 'Dr. Elena Vance, Botanist',
      summary: 'Master node propagation, moss pole training, and ideal light ratios for dramatic leaf splits.',
      modules: [{ title: 'Substrate & Aeration: Eliminating Root Rot', duration: '22 min' }]
    };
  });

  readonly guideProgressPercent = computed(() => {
    return Math.round((this.completedSteps().length / this.careSteps.length) * 100);
  });

  readonly formattedPlaybackTime = computed(() => {
    const totalSecs = this.playbackSeconds();
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

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

  readonly currentWateringAdvice = computed(() => {
    const pot = this.selectedPot();
    const sub = this.selectedSubstrate();

    if (pot === 'terracotta') {
      return {
        frequency: 'Every 5 – 7 Days',
        note: 'Porous terracotta accelerates substrate evaporation; check moisture meter regularly.',
      };
    } else if (sub === 'succulent') {
      return {
        frequency: 'Every 14 – 21 Days',
        note: 'Coarse mineral grit holds minimal water; soak thoroughly then allow 100% dry down.',
      };
    } else {
      return {
        frequency: 'Every 8 – 10 Days',
        note: 'Excellent root zone moisture stability; probe top 2 inches before watering.',
      };
    }
  });

  readonly currentSeasonTip = computed(() => {
    switch (this.selectedSeason()) {
      case 'spring':
        return {
          name: 'Spring',
          focus: 'Repotting, Substrate Refresh & Balanced Nutrients',
          detail: 'Days are lengthening. Increase watering frequency and apply half-strength organic fertilizer as root tips activate.',
        };
      case 'summer':
        return {
          name: 'Summer',
          focus: 'High Hydration, Misting & Preventive Pest Scouting',
          detail: 'Peak transpiration. Monitor soil moisture daily and inspect leaf undersides for spider mites during heat waves.',
        };
      case 'autumn':
        return {
          name: 'Autumn',
          focus: 'Gradual Daylight Transition & Grow Light Placement',
          detail: 'Natural foot-candles drop sharply. Move plants closer to south windows or supplement with full-spectrum LEDs.',
        };
      case 'winter':
      default:
        return {
          name: 'Winter',
          focus: 'Cold Draft Protection, Humidity Defense & Dormancy Rest',
          detail: 'Cut watering by 50%. Keep away from heating vents and run a cool-mist humidifier to sustain 55%+ ambient humidity.',
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
    this.activeCourseId.set(course.id);
    const elem = document.getElementById('lesson-preview');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  }

  togglePlay(): void {
    this.isPlaying.update((v) => !v);
  }

  toggleMute(): void {
    this.isMuted.update((v) => !v);
  }

  cycleSpeed(): void {
    const speeds = ['1x', '1.25x', '1.5x'];
    const nextIdx = (speeds.indexOf(this.playbackSpeed()) + 1) % speeds.length;
    this.playbackSpeed.set(speeds[nextIdx]);
  }

  onScrub(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.playbackSeconds.set(Number(target.value));
  }

  isStepCompleted(stepNum: number): boolean {
    return this.completedSteps().includes(stepNum);
  }

  toggleStep(stepNum: number): void {
    this.completedSteps.update((steps) =>
      steps.includes(stepNum) ? steps.filter((s) => s !== stepNum) : [...steps, stepNum]
    );
  }

  onEmailInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.newsletterEmail.set(target.value);
  }

  onSubscribe(event: Event): void {
    event.preventDefault();
    if (this.newsletterEmail().trim()) {
      this.isSubscribed.set(true);
    }
  }
}
