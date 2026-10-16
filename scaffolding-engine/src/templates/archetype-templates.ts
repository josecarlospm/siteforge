export type SiteType =
  | 'learning_platform'
  | 'blog'
  | 'newsletter'
  | 'ecommerce'
  | 'social_media'
  | 'landing_page';

export interface ArchetypeMeta {
  siteType: SiteType;
  title: string;
  tagline: string;
  description: string;
  content?: Record<string, unknown>;
}

export class ArchetypeTemplates {
  static getArchetypeComponent(siteType: SiteType, meta: ArchetypeMeta): string {
    switch (siteType) {
      case 'learning_platform':
        return this.getLearningPlatformTemplate(meta);
      case 'blog':
        return this.getBlogTemplate(meta);
      case 'newsletter':
        return this.getNewsletterTemplate(meta);
      case 'ecommerce':
        return this.getEcommerceTemplate(meta);
      case 'social_media':
        return this.getSocialMediaTemplate(meta);
      case 'landing_page':
      default:
        return this.getLandingPageTemplate(meta);
    }
  }

  private static getLearningPlatformTemplate(meta: ArchetypeMeta): string {
    return `import { Component, signal, computed } from '@angular/core';

export interface CourseModule {
  title: string;
  duration: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  level: string;
  category: string;
  duration: string;
  lessonsCount: number;
  rating: number;
  studentsCount: number;
  badge: string;
  summary: string;
  modules: CourseModule[];
}

@Component({
  selector: 'sf-archetype-view',
  template: \\\`
    <div class="platform-shell">
      <!-- Top Navigation Bar -->
      <header class="top-nav">
        <div class="sf-container nav-inner">
          <div class="nav-brand">
            <span class="brand-icon">🌿</span>
            <div class="brand-info">
              <span class="brand-name">${meta.title}</span>
              <span class="brand-tagline">Indoor Horticultural Academy</span>
            </div>
          </div>

          <div class="nav-search">
            <input
              type="search"
              class="search-bar"
              placeholder="Search masterclasses, pests, light guides..."
              [value]="searchQuery()"
              (input)="onSearchInput(\\\$event)"
            />
          </div>

          <nav class="nav-links">
            <a href="#catalog" class="nav-link">Catalog</a>
            <a href="#lesson-preview" class="nav-link">Lesson Preview</a>
            <a href="#diagnostics" class="nav-link">Diagnostics</a>
            <a href="#watering" class="nav-link">Watering</a>
            <a href="#newsletter" class="sf-btn sf-btn-primary nav-cta">Seasonal Dispatch</a>
          </nav>
        </div>
      </header>

      <main>
        <!-- Hero Section with Plant Illustration & Search -->
        <section id="hero" class="hero-section">
          <div class="sf-container hero-grid">
            <div class="hero-text">
              <div class="badge-row">
                <span class="sf-badge sf-badge-primary">Flagship Archetype: learning_platform</span>
                <span class="sf-badge sf-badge-accent">warm-organic</span>
              </div>
              <h1 class="hero-title">${meta.title}</h1>
              <p class="hero-tagline">${meta.tagline}</p>
              <p class="hero-desc">${meta.description}</p>

              <div class="hero-actions">
                <a href="#catalog" class="sf-btn sf-btn-primary hero-btn">Explore Masterclasses →</a>
                <a href="#lesson-preview" class="sf-btn sf-btn-secondary hero-btn">Watch Lesson Preview</a>
              </div>

              <!-- Quick Proof Stats -->
              <div class="hero-stats">
                <div class="stat-item">
                  <div class="stat-number">12,000+</div>
                  <div class="stat-label">Plants Saved</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">98%</div>
                  <div class="stat-label">Success Rate</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">24/7</div>
                  <div class="stat-label">Diagnostics</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">4.9★</div>
                  <div class="stat-label">Student Rating</div>
                </div>
              </div>
            </div>

            <div class="hero-visual">
              <div class="botanical-art-card">
                <svg class="plant-svg" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Pot -->
                  <path d="M100 220 L120 290 Q160 300 200 290 L220 220 Z" fill="#1A5F7A" stroke="#144A5F" stroke-width="3" />
                  <ellipse cx="160" cy="220" rx="60" ry="12" fill="#E28E73" stroke="#A7533B" stroke-width="2" />
                  <!-- Soil -->
                  <ellipse cx="160" cy="220" rx="55" ry="9" fill="#4A3525" />
                  <!-- Main Stems -->
                  <path d="M160 215 Q150 160 120 120" stroke="#145C45" stroke-width="6" stroke-linecap="round" fill="none" />
                  <path d="M160 215 Q165 140 200 90" stroke="#145C45" stroke-width="6" stroke-linecap="round" fill="none" />
                  <path d="M160 215 Q170 170 160 60" stroke="#145C45" stroke-width="5" stroke-linecap="round" fill="none" />
                  <!-- Monstera Left Leaf with Fenestrations -->
                  <path d="M120 120 C90 100 60 110 50 140 C40 170 70 200 110 180 C130 170 135 140 120 120 Z" fill="#145C45" />
                  <ellipse cx="85" cy="140" rx="4" ry="12" transform="rotate(-25 85 140)" fill="#FDFBF7" />
                  <ellipse cx="95" cy="165" rx="3" ry="10" transform="rotate(-15 95 165)" fill="#FDFBF7" />
                  <!-- Monstera Right Leaf with Fenestrations -->
                  <path d="M200 90 C230 70 265 80 275 110 C285 140 255 170 215 150 C195 140 190 110 200 90 Z" fill="#43783D" />
                  <ellipse cx="235" cy="110" rx="4" ry="12" transform="rotate(25 235 110)" fill="#FDFBF7" />
                  <ellipse cx="225" cy="135" rx="3" ry="10" transform="rotate(15 225 135)" fill="#FDFBF7" />
                  <!-- Top Center Emerging Leaf -->
                  <path d="M160 60 C150 30 170 20 180 35 C190 50 180 80 160 60 Z" fill="#8FBC8F" />
                </svg>
                <div class="art-caption">
                  <strong>Botanical Specimen:</strong>
                  <span>Monstera Deliciosa (Aroid Family)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Course Catalog Main Section with Filter Chips & Cards -->
        <section id="catalog" class="catalog-section sf-container">
          <div class="section-heading">
            <span class="sf-badge sf-badge-primary">Interactive Curriculum</span>
            <h2 class="section-title">Horticultural Masterclasses & Field Guides</h2>
            <p class="section-subtitle">
              Browse science-backed courses taught by certified botanists and plant pathologists.
            </p>
          </div>

          <!-- Category Filter Chips -->
          <div class="filter-group">
            <div class="filter-label">Category Filter:</div>
            <div class="filter-chips">
              @for (cat of categories; track cat) {
                <button
                  type="button"
                  class="chip"
                  [class.chip-active]="selectedCategory() === cat"
                  (click)="setCategory(cat)"
                >
                  {{ cat }}
                  @if (cat === 'All Categories') {
                    <span class="chip-count">({{ courses().length }})</span>
                  }
                </button>
              }
            </div>
          </div>

          <!-- Difficulty Level Filter Chips -->
          <div class="filter-group level-group">
            <div class="filter-label">Skill Level:</div>
            <div class="filter-chips">
              @for (lvl of levels; track lvl) {
                <button
                  type="button"
                  class="chip chip-sm"
                  [class.chip-active]="selectedLevel() === lvl"
                  (click)="setLevel(lvl)"
                >
                  {{ lvl }}
                </button>
              }
            </div>
          </div>

          <!-- Courses Grid -->
          <div class="catalog-grid">
            @for (course of filteredCourses(); track course.id) {
              <article class="course-card" [class.course-card-active]="activeCourseId() === course.id">
                <div class="card-header">
                  <span class="sf-badge sf-badge-accent">{{ course.badge }}</span>
                  <div class="card-rating">★ {{ course.rating }} ({{ course.studentsCount }})</div>
                </div>

                <div class="card-meta-row">
                  <span class="level-tag">{{ course.level }}</span>
                  <span class="duration-tag">{{ course.duration }} • {{ course.lessonsCount }} lessons</span>
                </div>

                <h3 class="course-title">{{ course.title }}</h3>
                <p class="course-instructor">Instructor: {{ course.instructor }}</p>
                <p class="course-summary">{{ course.summary }}</p>

                <!-- Curriculum Snapshot -->
                <div class="curriculum-snapshot">
                  <div class="curriculum-title">Curriculum Modules:</div>
                  <ul class="curriculum-list">
                    @for (module of course.modules; track module.title) {
                      <li class="curriculum-item">
                        <span>✓ {{ module.title }}</span>
                        <span class="item-duration">{{ module.duration }}</span>
                      </li>
                    }
                  </ul>
                </div>

                <div class="card-actions">
                  <button
                    type="button"
                    class="sf-btn sf-btn-primary preview-btn"
                    (click)="selectCourse(course.id)"
                  >
                    Preview Lesson & Video →
                  </button>
                </div>
              </article>
            } @empty {
              <div class="empty-state">
                <p>No masterclasses match your current search or category filter.</p>
                <button type="button" class="sf-btn sf-btn-secondary" (click)="resetFilters()">
                  Reset All Filters
                </button>
              </div>
            }
          </div>
        </section>

        <!-- Interactive Lesson Detail Preview Section (Video Player Stub & Guides) -->
        <section id="lesson-preview" class="lesson-preview-section sf-container">
          <div class="section-heading">
            <span class="sf-badge sf-badge-primary">Hands-On Studio</span>
            <h2 class="section-title">Interactive Lesson Detail Preview</h2>
            <p class="section-subtitle">
              Experience the masterclass player: video playback controls and step-by-step horticultural checklist.
            </p>
          </div>

          <div class="preview-layout">
            <!-- Left: Video Player Stub -->
            <div class="video-player-container">
              <div class="player-screen">
                <div class="video-artwork">
                  <div class="artwork-icon">🪴</div>
                  <div class="video-active-title">{{ activeCourse().title }}</div>
                  <div class="video-active-instructor">Lecture with {{ activeCourse().instructor }}</div>
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
                  (input)="onScrub(\\\$event)"
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
                <span>{{ activeCourse().modules[0].title }} ({{ activeCourse().modules[0].duration }})</span>
              </div>
            </div>

            <!-- Right: Step-by-Step Practical Care Guide -->
            <div class="guide-container">
              <div class="guide-header">
                <h3 class="guide-title">Step-by-Step Horticultural Guide</h3>
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
                      <span class="step-hint">Click to mark as complete</span>
                    </div>
                  </div>
                }
              </div>

              <div class="pro-tip-box">
                <span class="tip-icon">💡</span>
                <div class="tip-text">
                  <strong>Botanist Pro-Tip:</strong>
                  Never compact chunky aroid soil down with your fists; gently tap the pot against your workbench to settle substrate while preserving root oxygen channels.
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Light & Watering Diagnostics Section -->
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
            <div class="calc-card">
              <h3 class="calc-title">☀️ Foot-Candles & Light Calculator</h3>
              <p class="calc-desc">Select your primary window exposure to calculate foot-candle lux saturation:</p>

              <div class="option-buttons">
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

              <div class="calc-result">
                <div class="result-number">{{ currentLightData().footCandles }} FC</div>
                <div class="result-label">Available Foot-Candles Intensity</div>
                <div class="result-advice">
                  <strong>Compatible Species:</strong> {{ currentLightData().recommendation }}
                </div>
              </div>
            </div>

            <!-- Watering Schedule Matrix -->
            <div id="watering" class="calc-card">
              <h3 class="calc-title">💧 Watering & Substrate Dynamic Matrix</h3>
              <p class="calc-desc">Select substrate porosity and container type to compute hydration interval:</p>

              <div class="matrix-selector">
                <div class="selector-label">Substrate:</div>
                <div class="option-buttons">
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
                <div class="option-buttons">
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

              <div class="calc-result">
                <div class="result-number">{{ currentWateringAdvice().frequency }}</div>
                <div class="result-label">Recommended Watering Frequency</div>
                <div class="result-advice">
                  <strong>Pathology Note:</strong> {{ currentWateringAdvice().note }}
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
                <form class="sub-form" (submit)="onSubscribe(\\\$event)">
                  <input
                    type="email"
                    class="sub-input"
                    placeholder="Enter your email (e.g. botanist@indoorjungle.com)"
                    [value]="newsletterEmail()"
                    (input)="onEmailInput(\\\$event)"
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

        <!-- Botanist Community Reviews -->
        <section class="testimonials-section sf-container">
          <div class="section-heading">
            <h2 class="section-title">Verified Student Outcomes</h2>
            <p class="section-subtitle">Real experiences from indoor gardeners and botanical enthusiasts.</p>
          </div>

          <div class="testimonials-grid">
            @for (item of testimonials; track item.author) {
              <div class="testimonial-card">
                <div class="testimonial-stars">★★★★★</div>
                <p class="testimonial-quote">"{{ item.quote }}"</p>
                <div class="testimonial-author">
                  <strong>{{ item.author }}</strong>
                  <span>{{ item.role }}</span>
                </div>
              </div>
            }
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="footer-root">
        <div class="sf-container footer-content">
          <div class="footer-top">
            <div class="footer-brand">
              <span class="brand-logo">🌿</span>
              <span class="brand-name">${meta.title}</span>
            </div>
            <p class="footer-desc">${meta.description}</p>
          </div>
          <div class="footer-bottom">
            <span>© 2026 ${meta.title}. Built with SiteForge Autonomous Web Factory.</span>
            <span>100% Angular 19+ Standalone • Signals Reactivity • Zoneless Change Detection</span>
          </div>
        </div>
      </footer>
    </div>
  \\\`,
  styles: [\\\`
    .platform-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--color-bg);
      color: var(--color-text-main);
      font-family: var(--font-body);
    }

    /* Top Navigation */
    .top-nav {
      position: sticky;
      top: 0;
      z-index: 50;
      background-color: var(--color-surface);
      border-bottom: var(--border-width) solid var(--color-border);
      backdrop-filter: blur(var(--backdrop-blur));
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-4);
      height: 72px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .brand-icon {
      font-size: var(--text-2xl);
    }

    .brand-info {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-family: var(--font-heading);
      font-size: var(--text-lg);
      font-weight: 700;
      color: var(--color-primary);
    }

    .brand-tagline {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .nav-search {
      flex: 1;
      max-width: 360px;
    }

    .search-bar {
      width: 100%;
      padding: var(--spacing-2) var(--spacing-4);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-pill);
      background-color: var(--color-surface-muted);
      color: var(--color-text-main);
      font-size: var(--text-sm);
      outline: none;
    }

    .search-bar:focus {
      border-color: var(--color-primary);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: var(--spacing-4);
    }

    .nav-link {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-text-main);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .nav-link:hover {
      color: var(--color-primary);
    }

    .nav-cta {
      padding: var(--spacing-2) var(--spacing-4);
      text-decoration: none;
    }

    /* Hero Section */
    .hero-section {
      padding: var(--spacing-16) 0 var(--spacing-12);
      background: linear-gradient(180deg, var(--color-surface-muted) 0%, var(--color-bg) 100%);
      border-bottom: var(--border-width) solid var(--color-border);
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: var(--spacing-12);
      align-items: center;
    }

    .hero-text {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .badge-row {
      display: flex;
      gap: var(--spacing-2);
      flex-wrap: wrap;
    }

    .hero-title {
      font-size: var(--text-4xl);
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--color-primary);
    }

    .hero-tagline {
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--color-text-main);
    }

    .hero-desc {
      font-size: var(--text-base);
      color: var(--color-text-muted);
      line-height: var(--line-height-relaxed);
      max-width: 600px;
    }

    .hero-actions {
      display: flex;
      gap: var(--spacing-4);
      margin-top: var(--spacing-2);
      flex-wrap: wrap;
    }

    .hero-btn {
      text-decoration: none;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-4);
      margin-top: var(--spacing-6);
      padding-top: var(--spacing-6);
      border-top: var(--border-width) solid var(--color-border);
    }

    .stat-item {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-family: var(--font-heading);
      font-size: var(--text-2xl);
      font-weight: 800;
      color: var(--color-primary);
    }

    .stat-label {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      font-weight: 600;
    }

    .hero-visual {
      display: flex;
      justify-content: center;
    }

    .botanical-art-card {
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      padding: var(--spacing-6);
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 340px;
      width: 100%;
    }

    .plant-svg {
      width: 100%;
      height: 240px;
    }

    .art-caption {
      margin-top: var(--spacing-3);
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    /* Section Headings */
    .section-heading {
      text-align: center;
      margin-bottom: var(--spacing-8);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-2);
    }

    .section-title {
      font-size: var(--text-3xl);
      font-weight: 800;
    }

    .section-subtitle {
      font-size: var(--text-base);
      color: var(--color-text-muted);
      max-width: 640px;
    }

    /* Catalog & Filter Chips */
    .catalog-section {
      padding: var(--spacing-16) 0;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-4);
      flex-wrap: wrap;
    }

    .filter-label {
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .filter-chips {
      display: flex;
      gap: var(--spacing-2);
      flex-wrap: wrap;
    }

    .chip {
      padding: var(--spacing-2) var(--spacing-4);
      background-color: var(--color-surface);
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

    .chip-sm {
      padding: var(--spacing-1) var(--spacing-3);
    }

    .chip-count {
      opacity: 0.8;
      margin-left: var(--spacing-1);
    }

    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--spacing-8);
      margin-top: var(--spacing-8);
    }

    .course-card {
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      padding: var(--spacing-6);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
      transition: transform var(--transition-fast), border-color var(--transition-fast);
    }

    .course-card:hover {
      transform: translateY(-2px);
      border-color: var(--color-primary);
    }

    .course-card-active {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px var(--color-primary);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-rating {
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--color-primary);
    }

    .card-meta-row {
      display: flex;
      justify-content: space-between;
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .level-tag {
      font-weight: 600;
    }

    .course-title {
      font-size: var(--text-xl);
      font-weight: 800;
      color: var(--color-text-main);
    }

    .course-instructor {
      font-size: var(--text-xs);
      color: var(--color-primary);
      font-weight: 600;
    }

    .course-summary {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      line-height: var(--line-height-relaxed);
    }

    .curriculum-snapshot {
      background-color: var(--color-surface-muted);
      border-radius: var(--radius-sm);
      padding: var(--spacing-3);
      font-size: var(--text-xs);
    }

    .curriculum-title {
      font-weight: 700;
      margin-bottom: var(--spacing-2);
      color: var(--color-text-main);
    }

    .curriculum-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .curriculum-item {
      display: flex;
      justify-content: space-between;
      color: var(--color-text-muted);
    }

    .item-duration {
      font-weight: 600;
    }

    .preview-btn {
      width: 100%;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: var(--spacing-12);
      background-color: var(--color-surface);
      border: var(--border-width) dashed var(--color-border);
      border-radius: var(--radius-card);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-4);
    }

    /* Lesson Preview Studio */
    .lesson-preview-section {
      padding: var(--spacing-16) 0;
      border-top: var(--border-width) solid var(--color-border);
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
      height: 320px;
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
      font-size: 3.5rem;
    }

    .video-active-title {
      font-family: var(--font-heading);
      font-size: var(--text-lg);
      font-weight: 700;
      max-width: 380px;
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
      width: 64px;
      height: 64px;
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

    /* Diagnostics & Tools */
    .diagnostics-section {
      padding: var(--spacing-16) 0;
      border-top: var(--border-width) solid var(--color-border);
    }

    .diagnostics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-8);
    }

    .calc-card {
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      padding: var(--spacing-6);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }

    .calc-title {
      font-size: var(--text-xl);
      font-weight: 800;
    }

    .calc-desc {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
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

    .option-buttons {
      display: flex;
      gap: var(--spacing-2);
      flex-wrap: wrap;
    }

    .sf-btn-sm {
      padding: var(--spacing-2) var(--spacing-3);
      font-size: var(--text-xs);
    }

    .calc-result {
      background-color: var(--color-surface-muted);
      border-left: 4px solid var(--color-primary);
      border-radius: var(--radius-sm);
      padding: var(--spacing-4);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-1);
    }

    .result-number {
      font-family: var(--font-heading);
      font-size: var(--text-2xl);
      font-weight: 800;
      color: var(--color-primary);
    }

    .result-label {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-text-muted);
      letter-spacing: 0.05em;
    }

    .result-advice {
      font-size: var(--text-xs);
      color: var(--color-text-main);
      margin-top: var(--spacing-2);
      line-height: var(--line-height-normal);
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

    /* Testimonials */
    .testimonials-section {
      padding: var(--spacing-16) 0;
      border-top: var(--border-width) solid var(--color-border);
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-6);
    }

    .testimonial-card {
      background-color: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      padding: var(--spacing-6);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
      justify-content: space-between;
    }

    .testimonial-stars {
      color: var(--color-accent);
      font-size: var(--text-sm);
      letter-spacing: 0.1em;
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

    /* Footer */
    .footer-root {
      background-color: var(--color-surface);
      border-top: var(--border-width) solid var(--color-border);
      padding: var(--spacing-12) 0 var(--spacing-6);
      margin-top: var(--spacing-12);
    }

    .footer-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-8);
    }

    .footer-top {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2);
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }

    .footer-desc {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      max-width: 520px;
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      border-top: var(--border-width) solid var(--color-border);
      padding-top: var(--spacing-4);
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    /* Responsive */
    @media (max-width: 900px) {
      .hero-grid {
        grid-template-columns: 1fr;
      }
      .hero-visual {
        order: -1;
      }
      .preview-layout {
        grid-template-columns: 1fr;
      }
      .diagnostics-grid {
        grid-template-columns: 1fr;
      }
      .nav-search {
        display: none;
      }
      .footer-bottom {
        flex-direction: column;
        gap: var(--spacing-2);
      }
      .hero-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  \\\`
  ]
})
export class ArchetypeViewComponent {
  // Signals for Search and Filters
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('All Categories');
  readonly selectedLevel = signal<string>('All Levels');

  // Signals for Interactive Lesson Studio
  readonly activeCourseId = signal<string>('course-monstera-101');
  readonly isPlaying = signal<boolean>(false);
  readonly isMuted = signal<boolean>(false);
  readonly playbackSeconds = signal<number>(142);
  readonly playbackSpeed = signal<string>('1x');
  readonly completedSteps = signal<number[]>([1]);

  // Signals for Diagnostics
  readonly selectedOrientation = signal<string>('east-west');
  readonly selectedSubstrate = signal<string>('aroid');
  readonly selectedPot = signal<string>('terracotta');

  // Signals for Newsletter
  readonly selectedSeason = signal<string>('spring');
  readonly newsletterEmail = signal<string>('');
  readonly isSubscribed = signal<boolean>(false);

  readonly categories = [
    'All Categories',
    'Tropical Foliage',
    'Watering & Soil Dynamics',
    'Pest Eradication',
    'Propagation Masterclasses',
    'Low-Light Survivors',
  ];

  readonly levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  readonly courses = signal<Course[]>([
    {
      id: 'course-monstera-101',
      title: 'Monstera Deliciosa: From Cuttings to Fenestrated Giant',
      instructor: 'Dr. Elena Vance, Botanist',
      level: 'Beginner',
      category: 'Tropical Foliage',
      duration: '2h 45m',
      lessonsCount: 8,
      rating: 4.9,
      studentsCount: 1420,
      badge: 'Bestseller',
      summary: 'Master node propagation, moss pole training, and ideal light ratios for dramatic leaf splits.',
      modules: [
        { title: 'Substrate & Aeration: Eliminating Root Rot', duration: '22 min' },
        { title: 'Moss Poles vs Trellises: Vertical Growth Mechanics', duration: '35 min' },
        { title: 'Lighting & Nutrient Regimes for Giant Leaves', duration: '28 min' },
      ],
    },
    {
      id: 'course-light-calculator',
      title: 'Light Diagnostics: Foot-Candles, Lux & Window Orientation',
      instructor: 'Julian Croft, Horticulturist',
      level: 'All Levels',
      category: 'Low-Light Survivors',
      duration: '1h 30m',
      lessonsCount: 5,
      rating: 4.8,
      studentsCount: 980,
      badge: 'Essential',
      summary: 'Understand north vs south exposure and optimize grow lights for winter indoor survival.',
      modules: [
        { title: 'The Physics of Photosynthesis Indoors', duration: '18 min' },
        { title: 'Using a Light Meter Like a Horticultural Pro', duration: '25 min' },
      ],
    },
    {
      id: 'course-pest-defense',
      title: 'Organic Pest Eradication: Thrips, Spider Mites & Fungus Gnats',
      instructor: 'Samantha Wei, Integrated Pest Specialist',
      level: 'Intermediate',
      category: 'Pest Eradication',
      duration: '2h 10m',
      lessonsCount: 6,
      rating: 4.95,
      studentsCount: 2100,
      badge: 'Life Saver',
      summary: 'Non-toxic biological controls, beneficial nematodes, and predatory mites that save collections.',
      modules: [
        { title: 'Early Identification & Inspection Guide', duration: '20 min' },
        { title: 'Beneficial Insects Deployment Strategies', duration: '30 min' },
      ],
    },
  ]);

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

  readonly orientations = [
    { key: 'south', label: 'South Window (High Direct)' },
    { key: 'east-west', label: 'East/West Window (Medium Bright)' },
    { key: 'north', label: 'North Window (Low Gentle)' },
  ];

  readonly seasons = [
    { key: 'spring', name: 'Spring', icon: '🌸' },
    { key: 'summer', name: 'Summer', icon: '☀️' },
    { key: 'autumn', name: 'Autumn', icon: '🍂' },
    { key: 'winter', name: 'Winter', icon: '❄️' },
  ];

  readonly testimonials = [
    {
      quote: 'My fiddle leaf fig dropped half its leaves before this masterclass. Two months later, four massive fenestrated leaves sprouted!',
      author: 'Marcus Thorne',
      role: 'Apartment Gardener, Barcelona',
    },
    {
      quote: 'The light diagnostics calculator completely changed my perspective on window lux. Not a single yellow leaf all winter.',
      author: 'Clara Lindqvist',
      role: 'Botanical Designer, Stockholm',
    },
    {
      quote: 'Beneficial predatory mites saved 40 rare monsteras from thrips in 10 days. The best practical guide online.',
      author: 'Julian Croft',
      role: 'Aroid Collector, Berlin',
    },
  ];

  // Computed Properties
  readonly activeCourse = computed(() => {
    return this.courses().find((c) => c.id === this.activeCourseId()) || this.courses()[0];
  });

  readonly filteredCourses = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const lvl = this.selectedLevel();

    return this.courses().filter((c) => {
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);

      const matchesCat = cat === 'All Categories' || c.category === cat;
      const matchesLvl = lvl === 'All Levels' || c.level.includes(lvl);

      return matchesQuery && matchesCat && matchesLvl;
    });
  });

  readonly guideProgressPercent = computed(() => {
    return Math.round((this.completedSteps().length / this.careSteps.length) * 100);
  });

  readonly formattedPlaybackTime = computed(() => {
    const totalSecs = this.playbackSeconds();
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return \\\`\\\${mins.toString().padStart(2, '0')}:\\\${secs.toString().padStart(2, '0')}\\\`;
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

  // Event Handlers
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }

  setLevel(lvl: string): void {
    this.selectedLevel.set(lvl);
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('All Categories');
    this.selectedLevel.set('All Levels');
  }

  selectCourse(id: string): void {
    this.activeCourseId.set(id);
    const element = document.getElementById('lesson-preview');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
`;
  }

  private static getBlogTemplate(meta: ArchetypeMeta): string {
    return `import { Component, signal } from '@angular/core';

@Component({
  selector: 'sf-archetype-view',
  template: \`
    <div class="sf-container archetype-container">
      <header class="blog-header">
        <span class="sf-badge sf-badge-primary">Editorial Publication</span>
        <h1 class="blog-title">${meta.title}</h1>
        <p class="blog-tagline">${meta.tagline}</p>
      </header>

      <section class="posts-list">
        @for (post of posts(); track post.id) {
          <article class="post-item">
            <div class="post-meta">
              <span>{{ post.category }}</span> • <span>{{ post.readTime }}</span>
            </div>
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-author">By {{ post.author }}</div>
          </article>
        }
      </section>
    </div>
  \`,
  styles: [\`
    .archetype-container { max-width: 800px; padding: var(--spacing-12) var(--spacing-6); }
    .blog-header { text-align: center; margin-bottom: var(--spacing-12); }
    .blog-title { font-size: var(--text-4xl); margin-top: var(--spacing-3); }
    .blog-tagline { font-size: var(--text-lg); color: var(--color-text-muted); margin-top: var(--spacing-2); }
    .posts-list { display: flex; flex-direction: column; gap: var(--spacing-8); }
    .post-item { background: var(--color-surface); border: var(--border-width) solid var(--color-border); border-radius: var(--radius-card); padding: var(--spacing-6); box-shadow: var(--shadow-card); }
    .post-meta { font-size: var(--text-xs); color: var(--color-primary); font-weight: 700; text-transform: uppercase; }
    .post-title { font-size: var(--text-2xl); margin-top: var(--spacing-2); font-weight: 800; }
    .post-excerpt { font-size: var(--text-base); color: var(--color-text-muted); margin-top: var(--spacing-3); line-height: var(--line-height-relaxed); }
    .post-author { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: var(--spacing-4); }
  \`],
})
export class ArchetypeViewComponent {
  readonly posts = signal([
    { id: '1', title: 'The Scientific Approach to Indoor Cultivation', category: 'Botanical Science', readTime: '5 min read', excerpt: 'Deep dive into photosynthetic active radiation and transpiration dynamics.', author: 'Dr. E. Vance' },
    { id: '2', title: 'Substrate Mechanics: Why Porosity Trumps Volume', category: 'Soil Ecology', readTime: '8 min read', excerpt: 'How capillary action and aeration prevent fungal pathogen colonization.', author: 'J. Croft' },
  ]);
}
`;
  }

  private static getNewsletterTemplate(meta: ArchetypeMeta): string {
    return `import { Component, signal } from '@angular/core';

@Component({
  selector: 'sf-archetype-view',
  template: \`
    <div class="sf-container archetype-container">
      <header class="newsletter-header">
        <span class="sf-badge sf-badge-primary">Curated Newsletter</span>
        <h1 class="newsletter-title">${meta.title}</h1>
        <p class="newsletter-tagline">${meta.tagline}</p>
        <div class="subscribe-box">
          <input type="email" class="sub-input" placeholder="Enter your work email" />
          <button type="button" class="sf-btn sf-btn-primary">Join Subscribers</button>
        </div>
      </header>

      <section class="archive-section">
        <h2 class="archive-title">Recent Dispatches</h2>
        <div class="issues-grid">
          @for (issue of issues(); track issue.number) {
            <div class="issue-card">
              <span class="issue-num">#{{ issue.number }}</span>
              <h3 class="issue-name">{{ issue.title }}</h3>
              <p class="issue-desc">{{ issue.summary }}</p>
            </div>
          }
        </div>
      </section>
    </div>
  \`,
  styles: [\`
    .archetype-container { max-width: 900px; padding: var(--spacing-12) var(--spacing-6); }
    .newsletter-header { text-align: center; margin-bottom: var(--spacing-16); }
    .newsletter-title { font-size: var(--text-4xl); margin-top: var(--spacing-3); font-weight: 800; }
    .newsletter-tagline { font-size: var(--text-lg); color: var(--color-text-muted); margin-top: var(--spacing-2); }
    .subscribe-box { display: flex; justify-content: center; gap: var(--spacing-3); margin-top: var(--spacing-6); max-width: 480px; margin-left: auto; margin-right: auto; }
    .sub-input { flex: 1; padding: var(--spacing-3) var(--spacing-4); border: var(--border-width) solid var(--color-border); border-radius: var(--radius-btn); background: var(--color-surface); color: var(--color-text-main); }
    .archive-title { font-size: var(--text-2xl); font-weight: 700; margin-bottom: var(--spacing-6); }
    .issues-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-6); }
    .issue-card { background: var(--color-surface); border: var(--border-width) solid var(--color-border); border-radius: var(--radius-card); padding: var(--spacing-6); box-shadow: var(--shadow-card); }
    .issue-num { font-size: var(--text-xs); color: var(--color-accent); font-weight: 700; }
    .issue-name { font-size: var(--text-lg); font-weight: 700; margin-top: var(--spacing-2); }
    .issue-desc { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--spacing-2); }
  \`],
})
export class ArchetypeViewComponent {
  readonly issues = signal([
    { number: 42, title: 'Winter Photoperiods & LED Spectrum Allocation', summary: 'How to transition indoor foliage into low natural daylight without dormancy shock.' },
    { number: 41, title: 'Root Pruning vs Pot Upsizing', summary: 'When to keep plants in identical containers through root system revitalization.' },
  ]);
}
`;
  }

  private static getEcommerceTemplate(meta: ArchetypeMeta): string {
    return `import { Component, signal } from '@angular/core';

@Component({
  selector: 'sf-archetype-view',
  template: \`
    <div class="sf-container archetype-container">
      <header class="store-header">
        <span class="sf-badge sf-badge-primary">Commercial Catalog</span>
        <h1 class="store-title">${meta.title}</h1>
        <p class="store-tagline">${meta.tagline}</p>
      </header>

      <section class="products-grid">
        @for (product of products(); track product.id) {
          <div class="product-card">
            <div class="product-badge">{{ product.badge }}</div>
            <h3 class="product-title">{{ product.name }}</h3>
            <p class="product-price">{{ product.price }}</p>
            <button type="button" class="sf-btn sf-btn-primary buy-btn">Add to Cart</button>
          </div>
        }
      </section>
    </div>
  \`,
  styles: [\`
    .archetype-container { padding: var(--spacing-12) var(--spacing-6); }
    .store-header { text-align: center; margin-bottom: var(--spacing-12); }
    .store-title { font-size: var(--text-4xl); margin-top: var(--spacing-3); }
    .store-tagline { font-size: var(--text-lg); color: var(--color-text-muted); margin-top: var(--spacing-2); }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--spacing-6); }
    .product-card { background: var(--color-surface); border: var(--border-width) solid var(--color-border); border-radius: var(--radius-card); padding: var(--spacing-6); box-shadow: var(--shadow-card); display: flex; flex-direction: column; justify-content: space-between; gap: var(--spacing-4); }
    .product-badge { font-size: var(--text-xs); color: var(--color-primary); font-weight: 700; }
    .product-title { font-size: var(--text-xl); font-weight: 700; }
    .product-price { font-size: var(--text-2xl); font-weight: 800; color: var(--color-primary); }
    .buy-btn { width: 100%; }
  \`],
})
export class ArchetypeViewComponent {
  readonly products = signal([
    { id: 'p1', name: 'Premium Chunky Aroid Substrate (5L)', price: '$24.00', badge: 'Best Seller' },
    { id: 'p2', name: 'Precision Calibrated Soil Hygrometer', price: '$38.50', badge: 'New Release' },
    { id: 'p3', name: 'Full-Spectrum Magnetic Grow Pod', price: '$89.00', badge: 'Featured' },
  ]);
}
`;
  }

  private static getSocialMediaTemplate(meta: ArchetypeMeta): string {
    return `import { Component, signal } from '@angular/core';

@Component({
  selector: 'sf-archetype-view',
  template: \`
    <div class="sf-container archetype-container">
      <header class="feed-header">
        <span class="sf-badge sf-badge-primary">Community Discussion</span>
        <h1 class="feed-title">${meta.title}</h1>
        <p class="feed-tagline">${meta.tagline}</p>
      </header>

      <section class="posts-feed">
        @for (thread of threads(); track thread.id) {
          <article class="thread-card">
            <div class="thread-user">@{{ thread.author }} • {{ thread.timestamp }}</div>
            <h3 class="thread-topic">{{ thread.topic }}</h3>
            <p class="thread-content">{{ thread.content }}</p>
            <div class="thread-actions">
              <span class="action-item">▲ {{ thread.upvotes }} upvotes</span>
              <span class="action-item">💬 {{ thread.replies }} replies</span>
            </div>
          </article>
        }
      </section>
    </div>
  \`,
  styles: [\`
    .archetype-container { max-width: 800px; padding: var(--spacing-12) var(--spacing-6); }
    .feed-header { text-align: center; margin-bottom: var(--spacing-12); }
    .feed-title { font-size: var(--text-4xl); margin-top: var(--spacing-3); }
    .feed-tagline { font-size: var(--text-lg); color: var(--color-text-muted); margin-top: var(--spacing-2); }
    .posts-feed { display: flex; flex-direction: column; gap: var(--spacing-4); }
    .thread-card { background: var(--color-surface); border: var(--border-width) solid var(--color-border); border-radius: var(--radius-card); padding: var(--spacing-6); box-shadow: var(--shadow-card); }
    .thread-user { font-size: var(--text-xs); color: var(--color-text-muted); font-weight: 600; }
    .thread-topic { font-size: var(--text-lg); font-weight: 700; margin-top: var(--spacing-2); }
    .thread-content { font-size: var(--text-sm); color: var(--color-text-main); margin-top: var(--spacing-2); }
    .thread-actions { display: flex; gap: var(--spacing-4); margin-top: var(--spacing-4); font-size: var(--text-xs); color: var(--color-primary); font-weight: 700; }
  \`],
})
export class ArchetypeViewComponent {
  readonly threads = signal([
    { id: 't1', author: 'monstera_queen', timestamp: '2h ago', topic: 'Is terracotta actually drying out your soil too fast in winter?', content: 'Observed 30% faster moisture loss during heating season. Switching to glazed ceramics.', upvotes: 48, replies: 19 },
    { id: 't2', author: 'botanist_dave', timestamp: '5h ago', topic: 'Beneficial nematodes vs predatory mites: field review', content: 'Here is my 30-day side by side trial for thrips eradication on a 50-plant collection.', upvotes: 92, replies: 34 },
  ]);
}
`;
  }

  private static getLandingPageTemplate(meta: ArchetypeMeta): string {
    return `import { Component } from '@angular/core';

@Component({
  selector: 'sf-archetype-view',
  template: \`
    <div class="sf-container archetype-container">
      <header class="landing-hero">
        <span class="sf-badge sf-badge-primary">Product Showcase</span>
        <h1 class="landing-title">${meta.title}</h1>
        <p class="landing-tagline">${meta.tagline}</p>
        <div class="landing-actions">
          <button type="button" class="sf-btn sf-btn-primary">Get Started Today →</button>
          <button type="button" class="sf-btn sf-btn-secondary">View Documentation</button>
        </div>
      </header>

      <section class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">Instant Setup</h3>
          <p class="feature-desc">Zero manual configuration required. Fully automated scaffolding.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">Design.md Tokens</h3>
          <p class="feature-desc">Predefined aesthetic presets guarantee brand consistency across all pages.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3 class="feature-title">Vercel Edge Ready</h3>
          <p class="feature-desc">Optimized for sub-second static generation and rapid edge delivery.</p>
        </div>
      </section>
    </div>
  \`,
  styles: [\`
    .archetype-container { padding: var(--spacing-16) var(--spacing-6); }
    .landing-hero { text-align: center; max-width: 800px; margin: 0 auto var(--spacing-16); }
    .landing-title { font-size: var(--text-5xl); font-weight: 800; margin-top: var(--spacing-4); }
    .landing-tagline { font-size: var(--text-xl); color: var(--color-text-muted); margin-top: var(--spacing-4); line-height: var(--line-height-relaxed); }
    .landing-actions { display: flex; justify-content: center; gap: var(--spacing-4); margin-top: var(--spacing-8); }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-8); }
    .feature-card { background: var(--color-surface); border: var(--border-width) solid var(--color-border); border-radius: var(--radius-card); padding: var(--spacing-8); box-shadow: var(--shadow-card); }
    .feature-icon { font-size: var(--text-3xl); margin-bottom: var(--spacing-3); }
    .feature-title { font-size: var(--text-xl); font-weight: 700; }
    .feature-desc { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--spacing-2); }
  \`],
})
export class ArchetypeViewComponent {}
`;
  }
}
