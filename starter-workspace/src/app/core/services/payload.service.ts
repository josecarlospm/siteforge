import { Injectable, signal, computed } from '@angular/core';
import { SiteForgePayload, CourseEntity, PlantCareContent } from '../models/site-payload.model';

export const INITIAL_PLANTCARE_PAYLOAD: SiteForgePayload<PlantCareContent> = {
  version: '1.0.0',
  siteType: 'learning_platform',
  designPreset: 'warm-organic',
  theme: {
    topic: 'Indoor Houseplant Care',
    name: 'PlantCare Academy',
    tagline: 'Keep Your Indoor Jungle Thriving with Science-Backed Care',
    description:
      'Interactive masterclasses, watering diagnostics, lighting calculators, and pest emergency guides taught by botanical experts.',
    branding: {
      primaryColor: '#145C45',
      secondaryColor: '#2F8F6B',
      fontHeading: 'Syne',
      fontBody: 'DM Sans',
    },
    content: {
      featuredCategories: [
        'All Topics',
        'Tropical Foliage',
        'Watering & Soil Dynamics',
        'Pest Eradication',
        'Propagation Masterclasses',
        'Low-Light Survivors',
      ],
      courses: [
        {
          id: 'course-monstera-101',
          title: 'Monstera Deliciosa: From Cuttings to Fenestrated Giant',
          instructor: 'Dr. Elena Vance, Botanist',
          level: 'Beginner to Intermediate',
          duration: '2h 45m',
          lessonsCount: 8,
          rating: 4.9,
          studentsCount: 1420,
          badge: 'Bestseller',
          summary:
            'Master node propagation, moss pole training, and ideal light ratios for dramatic leaf splits.',
          modules: [
            { title: 'Substrate & Aeration: Eliminating Root Rot', duration: '22 min' },
            { title: 'Moss Poles vs Trellises: Vertical Growth Mechanics', duration: '35 min' },
            { title: 'Lighting & Nutrient Regimes', duration: '28 min' },
          ],
        },
        {
          id: 'course-light-calculator',
          title: 'Light Diagnostics: Foot-Candles, Lux & Window Orientation',
          instructor: 'Julian Croft, Horticulturist',
          level: 'All Levels',
          duration: '1h 30m',
          lessonsCount: 5,
          rating: 4.8,
          studentsCount: 980,
          badge: 'Essential',
          summary:
            'Understand north vs south exposure and optimize grow lights for winter survival.',
          modules: [
            { title: 'The Physics of Photosynthesis Indoors', duration: '18 min' },
            { title: 'Using a Light Meter Like a Pro', duration: '25 min' },
          ],
        },
        {
          id: 'course-pest-defense',
          title: 'Organic Pest Eradication: Thrips, Spider Mites & Fungus Gnats',
          instructor: 'Samantha Wei, Integrated Pest Specialist',
          level: 'Intermediate',
          duration: '2h 10m',
          lessonsCount: 6,
          rating: 4.95,
          studentsCount: 2100,
          badge: 'Life Saver',
          summary:
            'Non-toxic biological controls, beneficial nematodes, and predatory mites that save your collection.',
          modules: [
            { title: 'Early Identification Guide', duration: '20 min' },
            { title: 'Beneficial Insects Deployment', duration: '30 min' },
          ],
        },
      ],
      stats: [
        { value: '12,000+', label: 'Houseplants Saved' },
        { value: '98%', label: 'Success Rate' },
        { value: '24/7', label: 'Community Diagnosis' },
      ],
      testimonials: [
        {
          quote:
            'My fiddle leaf fig dropped half its leaves before this course. Within two months, I had four huge new leaves!',
          author: 'Marcus Thorne',
          role: 'Apartment Gardener, Barcelona',
        },
        {
          quote:
            'The light diagnostics module completely transformed how I place my plants. Not a single yellow leaf this winter.',
          author: 'Clara Lindqvist',
          role: 'Botanical Designer, Stockholm',
        },
      ],
    },
  },
  integrations: {
    github: {
      repoName: 'plantcare-academy-web',
      owner: 'jos3k4',
      isPrivate: false,
      autoInit: true,
    },
    vercel: {
      projectName: 'plantcare-academy',
      framework: 'angular',
      envVariables: {
        NEXT_PUBLIC_APP_ENV: 'production',
        ENABLE_SEARCH: 'true',
      },
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class PayloadService {
  readonly payload = signal<SiteForgePayload<PlantCareContent>>(INITIAL_PLANTCARE_PAYLOAD);

  /** Active search query signal */
  readonly searchQuery = signal<string>('');

  /** Selected category filter signal */
  readonly selectedCategory = signal<string>('All Topics');

  /** Derived theme metadata */
  readonly theme = computed(() => this.payload().theme);

  /** Derived course list with reactive filtering */
  readonly filteredCourses = computed<CourseEntity[]>(() => {
    const rawCourses = this.payload().theme.content?.courses ?? [];
    const query = this.searchQuery().trim().toLowerCase();
    const category = this.selectedCategory();

    return rawCourses.filter((course) => {
      const matchesQuery =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.summary.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query);

      const matchesCategory =
        category === 'All Topics' ||
        course.title.toLowerCase().includes(category.toLowerCase().split(' ')[0]);

      return matchesQuery && matchesCategory;
    });
  });

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setSelectedCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }
}
