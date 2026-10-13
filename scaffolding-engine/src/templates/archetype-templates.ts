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

@Component({
  selector: 'sf-archetype-view',
  template: \`
    <div class="sf-container archetype-container">
      <div class="archetype-hero">
        <span class="sf-badge sf-badge-primary">Learning Platform</span>
        <h1 class="hero-title">${meta.title}</h1>
        <p class="hero-tagline">${meta.tagline}</p>
      </div>

      <div class="catalog-grid">
        @for (course of courses(); track course.id) {
          <article class="course-card">
            <div class="course-top">
              <span class="sf-badge sf-badge-accent">{{ course.level }}</span>
              <span class="course-duration">{{ course.duration }}</span>
            </div>
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-instructor">Instructor: {{ course.instructor }}</p>
            <div class="course-action">
              <button type="button" class="sf-btn sf-btn-primary">Enroll Now →</button>
            </div>
          </article>
        }
      </div>
    </div>
  \`,
  styles: [\`
    .archetype-container { padding: var(--spacing-12) var(--spacing-6); }
    .archetype-hero { text-align: center; margin-bottom: var(--spacing-12); }
    .hero-title { font-size: var(--text-4xl); margin-top: var(--spacing-3); }
    .hero-tagline { font-size: var(--text-lg); color: var(--color-text-muted); margin-top: var(--spacing-2); }
    .catalog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-6); }
    .course-card { background: var(--color-surface); border: var(--border-width) solid var(--color-border); border-radius: var(--radius-card); padding: var(--spacing-6); box-shadow: var(--shadow-card); display: flex; flex-direction: column; justify-content: space-between; gap: var(--spacing-4); }
    .course-top { display: flex; justify-content: space-between; align-items: center; }
    .course-title { font-size: var(--text-xl); font-weight: 700; color: var(--color-text-main); }
    .course-instructor { font-size: var(--text-sm); color: var(--color-text-muted); }
  \`],
})
export class ArchetypeViewComponent {
  readonly courses = signal([
    { id: '1', title: 'Foundations & Core Principles', level: 'Beginner', duration: '2h 15m', instructor: 'Lead Specialist' },
    { id: '2', title: 'Advanced Methodologies & Field Practice', level: 'Advanced', duration: '3h 40m', instructor: 'Senior Fellow' },
    { id: '3', title: 'Diagnostic Masterclass', level: 'Intermediate', duration: '1h 50m', instructor: 'Research Director' },
  ]);
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
