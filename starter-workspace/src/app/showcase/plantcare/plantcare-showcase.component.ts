import { Component, computed, signal } from '@angular/core';
import { filterCourses } from './course-filter';

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
  summary: string;
  modules: CourseModule[];
}

/** SF-10 Greenhouse Lab reference — customer-facing factory output example. */
@Component({
  selector: 'sf-plantcare-showcase',
  template: `
    <div class="platform-shell">
      <aside class="reference-banner" aria-label="Live reference links">
        <div class="sf-container reference-inner">
          <div class="reference-copy">
            <p class="reference-kicker">Customer reference · learning_platform · designPreset: warm-organic</p>
            <p class="reference-title">PlantCare Academy — Greenhouse Lab result</p>
          </div>
          <div class="reference-links">
            <a
              class="sf-btn sf-btn-primary"
              href="https://plantcare-academy-web.vercel.app"
              target="_blank"
              rel="noopener"
            >
              Open live site
            </a>
            <a
              class="sf-btn sf-btn-secondary"
              href="https://josecarlospm.github.io/plantcare-academy-web/"
              target="_blank"
              rel="noopener"
            >
              GitHub Pages
            </a>
          </div>
        </div>
      </aside>

      <header class="top-nav">
        <div class="sf-container nav-inner">
          <a href="#hero" class="nav-brand">PlantCare Academy</a>
          <nav class="nav-links" aria-label="Primary">
            <a href="#catalog" class="nav-link">Courses</a>
            <a href="#lesson-preview" class="nav-link">Studio</a>
            <a href="#diagnostics" class="nav-link">Labs</a>
            <a href="#newsletter" class="nav-link">Dispatch</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="hero" class="hero" aria-labelledby="hero-brand">
          <div class="hero-plane" aria-hidden="true">
            <svg class="hero-foliage" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#c5d8ce" />
                  <stop offset="45%" stop-color="#9bb8a8" />
                  <stop offset="100%" stop-color="#145c45" />
                </linearGradient>
                <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f5f9f6" stop-opacity="0.15" />
                  <stop offset="55%" stop-color="#0f241c" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#0f241c" stop-opacity="0.72" />
                </linearGradient>
              </defs>
              <rect width="1440" height="900" fill="url(#sky)" />
              <path
                d="M0 620 C180 540 260 700 420 640 C560 590 620 480 780 520 C940 560 1020 700 1180 640 C1300 600 1380 540 1440 560 L1440 900 L0 900 Z"
                fill="#0e4634"
                opacity="0.55"
              />
              <path
                d="M920 180 C980 90 1120 70 1180 160 C1240 250 1180 340 1080 320 C980 300 860 270 920 180 Z"
                fill="#2f8f6b"
              />
              <path
                d="M1080 220 C1140 150 1260 160 1290 240 C1320 320 1220 370 1140 340 C1060 310 1020 290 1080 220 Z"
                fill="#145c45"
              />
              <path
                d="M1040 300 C1060 250 1120 230 1160 270"
                stroke="#0f241c"
                stroke-width="8"
                fill="none"
                stroke-linecap="round"
              />
              <ellipse cx="320" cy="340" rx="140" ry="90" fill="#267a5a" opacity="0.85" />
              <ellipse cx="420" cy="300" rx="110" ry="70" fill="#145c45" />
              <path
                d="M360 420 C370 300 410 220 460 160"
                stroke="#0e4634"
                stroke-width="10"
                fill="none"
                stroke-linecap="round"
              />
              <rect x="1180" y="520" width="18" height="120" rx="2" fill="#1a5f7a" opacity="0.9" />
              <rect x="1168" y="500" width="42" height="22" rx="2" fill="#f5f9f6" opacity="0.9" />
              <rect width="1440" height="900" fill="url(#mist)" />
            </svg>
          </div>

          <div class="sf-container hero-copy">
            <p id="hero-brand" class="hero-brand">PlantCare Academy</p>
            <h1 class="hero-headline">Field lab for indoor growers</h1>
            <p class="hero-support">
              Masterclasses, light diagnostics, and watering protocols built like a greenhouse bench —
              cool, precise, botanical.
            </p>
            <div class="hero-actions">
              <a href="#catalog" class="sf-btn sf-btn-primary">Browse masterclasses</a>
              <a href="#lesson-preview" class="sf-btn sf-btn-secondary">Open studio</a>
            </div>
          </div>
        </section>

        <section id="catalog" class="section catalog" aria-labelledby="catalog-title">
          <div class="sf-container">
            <header class="section-head">
              <h2 id="catalog-title">Masterclass catalog</h2>
              <p>Select a course to open it in the studio.</p>
            </header>

            <div class="filters" role="search">
              <label class="filter-field">
                <span class="filter-label">Search</span>
                <input
                  type="search"
                  class="filter-input"
                  placeholder="Title, instructor, topic"
                  [value]="searchQuery()"
                  (input)="onSearchInput($event)"
                />
              </label>
              <label class="filter-field">
                <span class="filter-label">Category</span>
                <select
                  class="filter-input"
                  [value]="selectedCategory()"
                  (change)="onCategoryChange($event)"
                >
                  @for (cat of categories; track cat) {
                    <option [value]="cat">{{ cat }}</option>
                  }
                </select>
              </label>
              <label class="filter-field">
                <span class="filter-label">Level</span>
                <select class="filter-input" [value]="selectedLevel()" (change)="onLevelChange($event)">
                  @for (lvl of levels; track lvl) {
                    <option [value]="lvl">{{ lvl }}</option>
                  }
                </select>
              </label>
            </div>

            <div class="catalog-grid">
              @for (course of filteredCourses(); track course.id) {
                <article
                  class="course-card"
                  [class.course-card-active]="activeCourseId() === course.id"
                >
                  <div class="course-meta">
                    <span>{{ course.level }}</span>
                    <span>{{ course.duration }} · {{ course.lessonsCount }} lessons</span>
                  </div>
                  <h3 class="course-title">{{ course.title }}</h3>
                  <p class="course-instructor">{{ course.instructor }}</p>
                  <p class="course-summary">{{ course.summary }}</p>
                  <button
                    type="button"
                    class="sf-btn sf-btn-primary course-cta"
                    (click)="selectCourse(course.id)"
                  >
                    Preview in studio
                  </button>
                </article>
              } @empty {
                <div class="empty-state">
                  <p>No masterclasses match these filters.</p>
                  <button type="button" class="sf-btn sf-btn-secondary" (click)="resetFilters()">
                    Reset filters
                  </button>
                </div>
              }
            </div>
          </div>
        </section>

        <section id="lesson-preview" class="section studio" aria-labelledby="studio-title">
          <div class="sf-container">
            <header class="section-head">
              <h2 id="studio-title">Lesson studio</h2>
              <p>Playback and horticultural checklist for the selected masterclass.</p>
            </header>

            <div class="studio-layout">
              <div class="player">
                <div class="player-screen">
                  <p class="player-kicker">Now studying</p>
                  <h3 class="player-title">{{ activeCourse().title }}</h3>
                  <p class="player-instructor">{{ activeCourse().instructor }}</p>
                  <button type="button" class="play-btn" (click)="togglePlay()" [attr.aria-pressed]="isPlaying()">
                    {{ isPlaying() ? 'Pause' : 'Play' }}
                  </button>
                </div>
                <div class="player-bar">
                  <span class="time">{{ formattedPlaybackTime() }} / 22:00</span>
                  <input
                    type="range"
                    class="scrubber"
                    min="0"
                    max="1320"
                    [value]="playbackSeconds()"
                    (input)="onScrub($event)"
                    aria-label="Lesson scrubber"
                  />
                  <button type="button" class="text-btn" (click)="toggleMute()">
                    {{ isMuted() ? 'Unmute' : 'Mute' }}
                  </button>
                  <button type="button" class="text-btn" (click)="cycleSpeed()">
                    {{ playbackSpeed() }}
                  </button>
                </div>
                <p class="module-line">
                  Module: {{ activeCourse().modules[0].title }}
                  ({{ activeCourse().modules[0].duration }})
                </p>
              </div>

              <div class="guide">
                <div class="guide-head">
                  <h3>Care checklist</h3>
                  <span>{{ guideProgressPercent() }}% complete</span>
                </div>
                <ul class="steps">
                  @for (step of careSteps; track step.number) {
                    <li>
                      <button
                        type="button"
                        class="step"
                        [class.step-done]="isStepCompleted(step.number)"
                        (click)="toggleStep(step.number)"
                      >
                        <span class="step-index" aria-hidden="true">
                          {{ isStepCompleted(step.number) ? '✓' : step.number }}
                        </span>
                        <span class="step-body">
                          <strong>{{ step.title }}</strong>
                          <span>{{ step.instruction }}</span>
                        </span>
                      </button>
                    </li>
                  }
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="diagnostics" class="section labs" aria-labelledby="labs-title">
          <div class="sf-container">
            <header class="section-head">
              <h2 id="labs-title">Light and watering labs</h2>
              <p>Dial orientation and substrate to get a working care interval.</p>
            </header>

            <div class="labs-grid">
              <div class="lab-panel">
                <h3>Foot-candle estimate</h3>
                <p class="lab-help">Choose window exposure</p>
                <div class="option-row" role="group" aria-label="Window orientation">
                  @for (orient of orientations; track orient.key) {
                    <button
                      type="button"
                      class="option"
                      [class.option-active]="selectedOrientation() === orient.key"
                      (click)="selectedOrientation.set(orient.key)"
                    >
                      {{ orient.label }}
                    </button>
                  }
                </div>
                <div class="lab-result">
                  <p class="result-value">{{ currentLightData().footCandles }} FC</p>
                  <p class="result-note">{{ currentLightData().recommendation }}</p>
                </div>
              </div>

              <div id="watering" class="lab-panel">
                <h3>Watering interval</h3>
                <p class="lab-help">Substrate</p>
                <div class="option-row" role="group" aria-label="Substrate">
                  @for (sub of substrates; track sub.key) {
                    <button
                      type="button"
                      class="option"
                      [class.option-active]="selectedSubstrate() === sub.key"
                      (click)="selectedSubstrate.set(sub.key)"
                    >
                      {{ sub.label }}
                    </button>
                  }
                </div>
                <p class="lab-help">Pot material</p>
                <div class="option-row" role="group" aria-label="Pot material">
                  @for (pot of pots; track pot.key) {
                    <button
                      type="button"
                      class="option"
                      [class.option-active]="selectedPot() === pot.key"
                      (click)="selectedPot.set(pot.key)"
                    >
                      {{ pot.label }}
                    </button>
                  }
                </div>
                <div class="lab-result">
                  <p class="result-value">{{ currentWateringAdvice().frequency }}</p>
                  <p class="result-note">{{ currentWateringAdvice().note }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="newsletter" class="section dispatch" aria-labelledby="dispatch-title">
          <div class="sf-container dispatch-inner">
            <header class="section-head section-head-left">
              <h2 id="dispatch-title">Seasonal dispatch</h2>
              <p>One care briefing per season. Pick a season, then subscribe.</p>
            </header>

            <div class="season-row" role="tablist" aria-label="Season">
              @for (season of seasons; track season.key) {
                <button
                  type="button"
                  role="tab"
                  class="season"
                  [class.season-active]="selectedSeason() === season.key"
                  [attr.aria-selected]="selectedSeason() === season.key"
                  (click)="selectedSeason.set(season.key)"
                >
                  {{ season.name }}
                </button>
              }
            </div>

            <div class="season-copy">
              <p class="season-focus">{{ currentSeasonTip().focus }}</p>
              <p>{{ currentSeasonTip().detail }}</p>
            </div>

            @if (isSubscribed()) {
              <p class="sub-success" role="status">
                Subscribed as {{ newsletterEmail() }} for {{ currentSeasonTip().name }} briefings.
              </p>
            } @else {
              <form class="sub-form" (submit)="onSubscribe($event)">
                <label class="sr-only" for="dispatch-email">Email</label>
                <input
                  id="dispatch-email"
                  type="email"
                  class="filter-input sub-input"
                  placeholder="you@greenhouse.lab"
                  [value]="newsletterEmail()"
                  (input)="onEmailInput($event)"
                  required
                />
                <button type="submit" class="sf-btn sf-btn-primary">
                  Subscribe to {{ currentSeasonTip().name }}
                </button>
              </form>
            }
          </div>
        </section>
      </main>

      <footer class="footer">
        <div class="sf-container footer-inner">
          <p class="footer-brand">PlantCare Academy</p>
          <p class="footer-meta">
            Greenhouse Lab preset · SiteForge learning_platform reference · © 2026
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: `
    .platform-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--color-bg);
      color: var(--color-text-main);
    }

    .reference-banner {
      border-bottom: var(--border-width) solid var(--color-border);
      background: var(--color-surface);
      padding: var(--spacing-4) 0;
    }

    .reference-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-4);
      flex-wrap: wrap;
    }

    .reference-kicker {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--color-accent);
      margin: 0 0 4px;
      letter-spacing: 0.02em;
    }

    .reference-title {
      margin: 0;
      font-family: var(--font-heading);
      font-size: var(--text-base);
      font-weight: 700;
      color: var(--color-text-main);
    }

    .reference-links {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-2);
    }

    .top-nav {
      position: sticky;
      top: 56px;
      z-index: 40;
      background: color-mix(in srgb, var(--color-surface) 92%, transparent);
      border-bottom: var(--border-width) solid var(--color-border);
      backdrop-filter: blur(10px);
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 4rem;
      gap: var(--spacing-4);
    }

    .nav-brand {
      font-family: var(--font-heading);
      font-size: var(--text-lg);
      font-weight: 700;
      text-decoration: none;
      letter-spacing: -0.02em;
      color: var(--color-primary);
    }

    .nav-links {
      display: flex;
      gap: var(--spacing-5);
      flex-wrap: wrap;
    }

    .nav-link {
      font-size: var(--text-sm);
      font-weight: 600;
      text-decoration: none;
      color: var(--color-text-muted);
      transition: color var(--transition-fast);
    }

    .nav-link:hover,
    .nav-link:focus-visible {
      color: var(--color-primary);
    }

    .hero {
      position: relative;
      min-height: 100svh;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
      color: #f5f9f6;
    }

    .hero-plane {
      position: absolute;
      inset: 0;
    }

    .hero-foliage {
      width: 100%;
      height: 100%;
      object-fit: cover;
      animation: foliage-drift 18s ease-in-out infinite alternate;
    }

    .hero-copy {
      position: relative;
      z-index: 1;
      padding-top: var(--spacing-16);
      padding-bottom: clamp(3rem, 8vw, 5.5rem);
      max-width: 42rem;
      margin-right: auto;
      animation: rise-in 700ms ease-out both;
    }

    .hero-brand {
      font-family: var(--font-heading);
      font-size: clamp(2.75rem, 7vw, 4.75rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 0.95;
      margin-bottom: var(--spacing-5);
    }

    .hero-headline {
      font-size: clamp(1.35rem, 2.6vw, 1.85rem);
      font-weight: 600;
      margin-bottom: var(--spacing-3);
      color: #e7eeea;
    }

    .hero-support {
      font-size: var(--text-base);
      line-height: var(--line-height-relaxed);
      color: color-mix(in srgb, #f5f9f6 82%, transparent);
      margin-bottom: var(--spacing-8);
      max-width: 34rem;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-3);
    }

    .hero .sf-btn-secondary {
      color: #f5f9f6;
      border-color: color-mix(in srgb, #f5f9f6 45%, transparent);
    }

    .hero .sf-btn-secondary:hover {
      border-color: #f5f9f6;
      color: #f5f9f6;
    }

    .section {
      padding: var(--spacing-16) 0;
    }

    .section-head {
      text-align: center;
      max-width: 40rem;
      margin: 0 auto var(--spacing-10);
      display: grid;
      gap: var(--spacing-2);
    }

    .section-head-left {
      text-align: left;
      margin-left: 0;
    }

    .section-head h2 {
      font-size: var(--text-3xl);
      letter-spacing: -0.03em;
    }

    .section-head p {
      color: var(--color-text-muted);
    }

    .filters {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-8);
    }

    .filter-field {
      display: grid;
      gap: var(--spacing-2);
    }

    .filter-label {
      font-size: var(--text-xs);
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }

    .filter-input {
      width: 100%;
      padding: var(--spacing-3) var(--spacing-4);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      color: var(--color-text-main);
      font: inherit;
      font-size: var(--text-sm);
    }

    .filter-input:focus {
      outline: 2px solid var(--color-accent);
      outline-offset: 1px;
    }

    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-6);
    }

    .course-card {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
      padding: var(--spacing-6);
      background: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-ambient);
      transition:
        border-color var(--transition-fast),
        transform var(--transition-fast),
        box-shadow var(--transition-fast);
    }

    .course-card:hover {
      border-color: var(--color-secondary);
      transform: translateY(-2px);
    }

    .course-card-active {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-card);
    }

    .course-meta {
      display: flex;
      justify-content: space-between;
      gap: var(--spacing-3);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .course-title {
      font-size: var(--text-xl);
      letter-spacing: -0.02em;
    }

    .course-instructor {
      font-size: var(--text-sm);
      color: var(--color-accent);
      font-weight: 600;
    }

    .course-summary {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      line-height: var(--line-height-relaxed);
      flex: 1;
    }

    .course-cta {
      margin-top: var(--spacing-2);
      width: 100%;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: var(--spacing-12);
      border: var(--border-width) dashed var(--color-border);
      border-radius: var(--radius-card);
      display: grid;
      gap: var(--spacing-4);
      justify-items: center;
      color: var(--color-text-muted);
    }

    .studio {
      background: linear-gradient(180deg, var(--color-bg), var(--color-surface-muted));
      border-top: var(--border-width) solid var(--color-border);
      border-bottom: var(--border-width) solid var(--color-border);
    }

    .studio-layout {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: var(--spacing-8);
      align-items: start;
    }

    .player,
    .guide,
    .lab-panel {
      background: var(--color-surface);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-card);
      overflow: hidden;
    }

    .player-screen {
      min-height: 280px;
      padding: var(--spacing-8);
      display: grid;
      align-content: center;
      gap: var(--spacing-3);
      background:
        radial-gradient(circle at 80% 20%, rgba(47, 143, 107, 0.35), transparent 40%),
        linear-gradient(145deg, #0f241c, #145c45 55%, #1a5f7a);
      color: #f5f9f6;
    }

    .player-kicker {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.8;
    }

    .player-title {
      font-size: var(--text-2xl);
      max-width: 28rem;
    }

    .player-instructor {
      font-size: var(--text-sm);
      opacity: 0.85;
      margin-bottom: var(--spacing-4);
    }

    .play-btn {
      width: fit-content;
      padding: var(--spacing-3) var(--spacing-6);
      border: none;
      border-radius: var(--radius-btn);
      background: #f5f9f6;
      color: var(--color-primary);
      font-weight: 700;
      cursor: pointer;
    }

    .player-bar {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3) var(--spacing-4);
      border-top: var(--border-width) solid var(--color-border);
      flex-wrap: wrap;
    }

    .time {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .scrubber {
      flex: 1;
      min-width: 120px;
      accent-color: var(--color-primary);
    }

    .text-btn {
      border: none;
      background: transparent;
      color: var(--color-accent);
      font: inherit;
      font-size: var(--text-xs);
      font-weight: 700;
      cursor: pointer;
    }

    .module-line {
      padding: var(--spacing-3) var(--spacing-4);
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      background: var(--color-surface-muted);
      border-top: var(--border-width) solid var(--color-border);
    }

    .guide {
      padding: var(--spacing-6);
    }

    .guide-head {
      display: flex;
      justify-content: space-between;
      gap: var(--spacing-3);
      margin-bottom: var(--spacing-4);
      font-size: var(--text-sm);
      color: var(--color-text-muted);
    }

    .guide-head h3 {
      color: var(--color-text-main);
      font-size: var(--text-lg);
    }

    .steps {
      list-style: none;
      display: grid;
      gap: var(--spacing-3);
    }

    .step {
      width: 100%;
      display: flex;
      gap: var(--spacing-3);
      text-align: left;
      padding: var(--spacing-3);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-bg);
      cursor: pointer;
      transition: border-color var(--transition-fast);
    }

    .step:hover,
    .step-done {
      border-color: var(--color-primary);
    }

    .step-index {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 50%;
      border: var(--border-width) solid var(--color-border);
      display: grid;
      place-items: center;
      flex-shrink: 0;
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--color-primary);
    }

    .step-done .step-index {
      background: var(--color-primary);
      color: #f5f9f6;
      border-color: var(--color-primary);
    }

    .step-body {
      display: grid;
      gap: var(--spacing-1);
      font-size: var(--text-sm);
    }

    .step-body span {
      color: var(--color-text-muted);
      font-size: var(--text-xs);
      line-height: var(--line-height-normal);
    }

    .labs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-6);
    }

    .lab-panel {
      padding: var(--spacing-6);
      display: grid;
      gap: var(--spacing-3);
    }

    .lab-panel h3 {
      font-size: var(--text-xl);
    }

    .lab-help {
      font-size: var(--text-xs);
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }

    .option-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-2);
    }

    .option {
      padding: var(--spacing-2) var(--spacing-3);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-btn);
      background: var(--color-bg);
      color: var(--color-text-main);
      font: inherit;
      font-size: var(--text-xs);
      font-weight: 600;
      cursor: pointer;
    }

    .option-active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #f5f9f6;
    }

    .lab-result {
      margin-top: var(--spacing-2);
      padding: var(--spacing-4);
      border-left: 3px solid var(--color-accent);
      background: var(--color-surface-muted);
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
    }

    .result-value {
      font-family: var(--font-heading);
      font-size: var(--text-2xl);
      color: var(--color-primary);
      margin-bottom: var(--spacing-2);
    }

    .result-note {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      line-height: var(--line-height-relaxed);
    }

    .dispatch {
      border-top: var(--border-width) solid var(--color-border);
    }

    .dispatch-inner {
      max-width: 42rem;
    }

    .season-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-6);
    }

    .season {
      padding: var(--spacing-3);
      border: var(--border-width) solid var(--color-border);
      border-radius: var(--radius-btn);
      background: var(--color-surface);
      font: inherit;
      font-size: var(--text-sm);
      font-weight: 700;
      cursor: pointer;
    }

    .season-active {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: #f5f9f6;
    }

    .season-copy {
      display: grid;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-6);
      color: var(--color-text-muted);
      font-size: var(--text-sm);
      line-height: var(--line-height-relaxed);
    }

    .season-focus {
      font-family: var(--font-heading);
      font-size: var(--text-lg);
      color: var(--color-text-main);
    }

    .sub-form {
      display: flex;
      gap: var(--spacing-2);
      flex-wrap: wrap;
    }

    .sub-input {
      flex: 1;
      min-width: 220px;
    }

    .sub-success {
      padding: var(--spacing-4);
      border: var(--border-width) solid var(--color-secondary);
      border-radius: var(--radius-md);
      background: color-mix(in srgb, var(--color-secondary) 12%, var(--color-surface));
      color: var(--color-primary);
      font-weight: 600;
    }

    .footer {
      margin-top: auto;
      border-top: var(--border-width) solid var(--color-border);
      background: var(--color-surface);
      padding: var(--spacing-8) 0;
    }

    .footer-inner {
      display: flex;
      justify-content: space-between;
      gap: var(--spacing-4);
      flex-wrap: wrap;
    }

    .footer-brand {
      font-family: var(--font-heading);
      font-weight: 700;
      color: var(--color-primary);
    }

    .footer-meta {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (max-width: 900px) {
      .filters,
      .studio-layout,
      .labs-grid {
        grid-template-columns: 1fr;
      }

      .nav-links {
        gap: var(--spacing-3);
      }

      .hero {
        min-height: 92svh;
      }

      .season-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .nav-links {
        display: none;
      }
    }
  `,
})
export class PlantCareShowcaseComponent {
  readonly searchQuery = signal('');
  readonly selectedCategory = signal('All Categories');
  readonly selectedLevel = signal('All Levels');

  readonly activeCourseId = signal('course-monstera-101');
  readonly isPlaying = signal(false);
  readonly isMuted = signal(false);
  readonly playbackSeconds = signal(142);
  readonly playbackSpeed = signal('1x');
  readonly completedSteps = signal<number[]>([1]);

  readonly selectedOrientation = signal('east-west');
  readonly selectedSubstrate = signal('aroid');
  readonly selectedPot = signal('terracotta');

  readonly selectedSeason = signal('spring');
  readonly newsletterEmail = signal('');
  readonly isSubscribed = signal(false);

  readonly categories = [
    'All Categories',
    'Tropical Foliage',
    'Watering & Soil Dynamics',
    'Pest Eradication',
    'Propagation Masterclasses',
    'Low-Light Survivors',
  ];

  readonly levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  readonly substrates = [
    { key: 'aroid', label: 'Chunky aroid mix' },
    { key: 'peat', label: 'Peat / perlite' },
    { key: 'succulent', label: 'Gritty succulent' },
  ];

  readonly pots = [
    { key: 'terracotta', label: 'Terracotta' },
    { key: 'ceramic', label: 'Glazed ceramic' },
    { key: 'plastic', label: 'Nursery plastic' },
  ];

  readonly courses = signal<Course[]>([
    {
      id: 'course-monstera-101',
      title: 'Monstera Deliciosa: cuttings to fenestrated giant',
      instructor: 'Dr. Elena Vance, Botanist',
      level: 'Beginner',
      category: 'Tropical Foliage',
      duration: '2h 45m',
      lessonsCount: 8,
      summary: 'Node propagation, moss-pole training, and light ratios for dramatic leaf splits.',
      modules: [
        { title: 'Substrate & aeration', duration: '22 min' },
        { title: 'Moss poles vs trellises', duration: '35 min' },
        { title: 'Nutrient regimes for giant leaves', duration: '28 min' },
      ],
    },
    {
      id: 'course-light-calculator',
      title: 'Light diagnostics: foot-candles and orientation',
      instructor: 'Julian Croft, Horticulturist',
      level: 'All Levels',
      category: 'Low-Light Survivors',
      duration: '1h 30m',
      lessonsCount: 5,
      summary: 'Read north vs south exposure and place grow lights for winter survival.',
      modules: [
        { title: 'Photosynthesis indoors', duration: '18 min' },
        { title: 'Using a light meter', duration: '25 min' },
      ],
    },
    {
      id: 'course-pest-defense',
      title: 'Organic pest eradication: thrips to fungus gnats',
      instructor: 'Samantha Wei, IPM Specialist',
      level: 'Intermediate',
      category: 'Pest Eradication',
      duration: '2h 10m',
      lessonsCount: 6,
      summary: 'Biological controls, nematodes, and predatory mites that protect collections.',
      modules: [
        { title: 'Early identification', duration: '20 min' },
        { title: 'Beneficial insect strategies', duration: '30 min' },
      ],
    },
  ]);

  readonly careSteps = [
    {
      number: 1,
      title: 'Inspect root mass',
      instruction: 'Unpot, clear degraded soil, and check for soft brown necrosis.',
    },
    {
      number: 2,
      title: 'Mix 40/30/30 aroid soil',
      instruction: 'Combine pumice, orchid bark, and buffered coco with worm castings.',
    },
    {
      number: 3,
      title: 'Sanitize and prune',
      instruction: 'Wipe shears with isopropyl and sever dead roots above the rot line.',
    },
    {
      number: 4,
      title: 'Stake the moss pole',
      instruction: 'Anchor moist sphagnum behind the stem and fasten aerial nodes loosely.',
    },
  ];

  readonly orientations = [
    { key: 'south', label: 'South (high direct)' },
    { key: 'east-west', label: 'East / West' },
    { key: 'north', label: 'North (low)' },
  ];

  readonly seasons = [
    { key: 'spring', name: 'Spring' },
    { key: 'summer', name: 'Summer' },
    { key: 'autumn', name: 'Autumn' },
    { key: 'winter', name: 'Winter' },
  ];

  readonly activeCourse = computed(
    () => this.courses().find((c) => c.id === this.activeCourseId()) ?? this.courses()[0],
  );

  readonly filteredCourses = computed(() =>
    filterCourses(this.courses(), {
      query: this.searchQuery(),
      category: this.selectedCategory(),
      level: this.selectedLevel(),
    }),
  );

  readonly guideProgressPercent = computed(() =>
    Math.round((this.completedSteps().length / this.careSteps.length) * 100),
  );

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
          recommendation: 'Fiddle leaf fig, citrus, bird of paradise, succulents.',
        };
      case 'north':
        return {
          footCandles: '200 – 400',
          recommendation: 'Snake plant, ZZ, cast iron, pothos, peace lily.',
        };
      default:
        return {
          footCandles: '600 – 1,200',
          recommendation: 'Monstera, calathea, philodendron, anthurium, ferns.',
        };
    }
  });

  readonly currentWateringAdvice = computed(() => {
    const pot = this.selectedPot();
    const sub = this.selectedSubstrate();

    if (pot === 'terracotta') {
      return {
        frequency: 'Every 5 – 7 days',
        note: 'Porous clay accelerates evaporation; probe moisture before each pour.',
      };
    }
    if (sub === 'succulent') {
      return {
        frequency: 'Every 14 – 21 days',
        note: 'Mineral grit holds little water; soak thoroughly, then full dry-down.',
      };
    }
    return {
      frequency: 'Every 8 – 10 days',
      note: 'Stable root-zone moisture; check the top two inches before watering.',
    };
  });

  readonly currentSeasonTip = computed(() => {
    switch (this.selectedSeason()) {
      case 'summer':
        return {
          name: 'Summer',
          focus: 'Hydration, scouting, heat defense',
          detail: 'Peak transpiration. Check moisture daily and inspect undersides for mites.',
        };
      case 'autumn':
        return {
          name: 'Autumn',
          focus: 'Daylight transition and grow-light placement',
          detail: 'Natural foot-candles drop. Shift plants south or add full-spectrum LEDs.',
        };
      case 'winter':
        return {
          name: 'Winter',
          focus: 'Draft protection and dormancy rest',
          detail: 'Cut watering by half. Keep off heating vents and hold humidity near 55%.',
        };
      default:
        return {
          name: 'Spring',
          focus: 'Repotting, substrate refresh, balanced feed',
          detail: 'Days lengthen. Increase water and apply half-strength organic fertilizer.',
        };
    }
  });

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onCategoryChange(event: Event): void {
    this.selectedCategory.set((event.target as HTMLSelectElement).value);
  }

  onLevelChange(event: Event): void {
    this.selectedLevel.set((event.target as HTMLSelectElement).value);
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('All Categories');
    this.selectedLevel.set('All Levels');
  }

  selectCourse(id: string): void {
    this.activeCourseId.set(id);
    document.getElementById('lesson-preview')?.scrollIntoView({ behavior: 'smooth' });
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
    this.playbackSeconds.set(Number((event.target as HTMLInputElement).value));
  }

  isStepCompleted(stepNum: number): boolean {
    return this.completedSteps().includes(stepNum);
  }

  toggleStep(stepNum: number): void {
    this.completedSteps.update((steps) =>
      steps.includes(stepNum) ? steps.filter((s) => s !== stepNum) : [...steps, stepNum],
    );
  }

  onEmailInput(event: Event): void {
    this.newsletterEmail.set((event.target as HTMLInputElement).value);
  }

  onSubscribe(event: Event): void {
    event.preventDefault();
    if (this.newsletterEmail().trim()) {
      this.isSubscribed.set(true);
    }
  }
}
