# Flagship Product Example: PlantCare Academy

## 1. Concept & Product Archetype
* **Commercial Name**: **PlantCare Academy**
* **Site Archetype (`siteType`)**: `learning_platform`
* **Design Preset (`designPreset`)**: `warm-organic`
* **Domain Theme (`theme`)**: Indoor Houseplant Care & Horticultural Mastery
* **Target Audience**: Urban plant parents, indoor gardening hobbyists, beginners looking to keep fiddle-leaf figs and monsteras thriving.

---

## 2. Complete Canonical Payload (`plantcare-academy.payload.json`)

```json
{
  "version": "1.0.0",
  "siteType": "learning_platform",
  "designPreset": "warm-organic",
  "theme": {
    "topic": "Indoor Houseplant Care",
    "name": "PlantCare Academy",
    "tagline": "Keep Your Indoor Jungle Thriving with Science-Backed Care",
    "description": "Interactive masterclasses, watering diagnostics, lighting calculators, and pest emergency guides taught by botanical experts.",
    "branding": {
      "primaryColor": "#145C45",
      "secondaryColor": "#2F8F6B",
      "fontHeading": "Syne",
      "fontBody": "DM Sans"
    },
    "content": {
      "featuredCategories": [
        "Tropical Foliage",
        "Watering & Soil Dynamics",
        "Pest Eradication",
        "Propagation Masterclasses",
        "Low-Light Survivors"
      ],
      "courses": [
        {
          "id": "course-monstera-101",
          "title": "Monstera Deliciosa: From Cuttings to Fenestrated Giant",
          "instructor": "Dr. Elena Vance, Botanist",
          "level": "Beginner to Intermediate",
          "duration": "2h 45m",
          "lessonsCount": 8,
          "rating": 4.9,
          "studentsCount": 1420,
          "badge": "Bestseller",
          "summary": "Master node propagation, moss pole training, and ideal light ratios for dramatic leaf splits.",
          "modules": [
            { "title": "Substrate & Aeration: Eliminating Root Rot", "duration": "22 min" },
            { "title": "Moss Poles vs Trellises: Vertical Growth Mechanics", "duration": "35 min" },
            { "title": "Lighting & Nutrient Regimes", "duration": "28 min" }
          ]
        },
        {
          "id": "course-light-calculator",
          "title": "Light Diagnostics: Foot-Candles, Lux & Window Orientation",
          "instructor": "Julian Croft, Horticulturist",
          "level": "All Levels",
          "duration": "1h 30m",
          "lessonsCount": 5,
          "rating": 4.8,
          "studentsCount": 980,
          "badge": "Essential",
          "summary": "Understand north vs south exposure and optimize grow lights for winter survival.",
          "modules": [
            { "title": "The Physics of Photosynthesis Indoors", "duration": "18 min" },
            { "title": "Using a Light Meter Like a Pro", "duration": "25 min" }
          ]
        },
        {
          "id": "course-pest-defense",
          "title": "Organic Pest Eradication: Thrips, Spider Mites & Fungus Gnats",
          "instructor": "Samantha Wei, Integrated Pest Specialist",
          "level": "Intermediate",
          "duration": "2h 10m",
          "lessonsCount": 6,
          "rating": 4.95,
          "studentsCount": 2100,
          "badge": "Life Saver",
          "summary": "Non-toxic biological controls, beneficial nematodes, and predatory mites that save your collection.",
          "modules": [
            { "title": "Early Identification Guide", "duration": "20 min" },
            { "title": "Beneficial Insects Deployment", "duration": "30 min" }
          ]
        }
      ],
      "stats": [
        { "value": "12,000+", "label": "Houseplants Saved" },
        { "value": "98%", "label": "Success Rate" },
        { "value": "24/7", "label": "Community Diagnosis" }
      ],
      "testimonials": [
        {
          "quote": "My fiddle leaf fig dropped half its leaves before this course. Within two months, I had four huge new leaves!",
          "author": "Marcus Thorne",
          "role": "Apartment Gardener, Barcelona"
        },
        {
          "quote": "The light diagnostics module completely transformed how I place my plants. Not a single yellow leaf this winter.",
          "author": "Clara Lindqvist",
          "role": "Botanical Designer, Stockholm"
        }
      ]
    }
  },
  "integrations": {
    "github": {
      "repoName": "plantcare-academy-web",
      "owner": "jos3k4",
      "isPrivate": false,
      "autoInit": true
    },
    "vercel": {
      "projectName": "plantcare-academy-web",
      "framework": "angular",
      "envVariables": {
        "NEXT_PUBLIC_APP_ENV": "production",
        "ENABLE_SEARCH": "true"
      }
    }
  }
}
```

---

## 3. Angular 19 Component Architecture for PlantCare Academy

```
plantcare-academy/src/app/
├── core/
│   ├── services/
│   │   ├── course.service.ts         (Signal-based state store for course catalog)
│   │   └── theme.service.ts          (Injects warm-organic CSS variables to :root)
│   └── models/
│       └── plantcare.model.ts        (TypeScript interfaces for courses, modules, lessons)
├── components/
│   ├── header/header.component.ts    (Navigation, logo, search input signal)
│   ├── hero/hero.component.ts        (Warm oat background, terracotta CTA, search bar)
│   ├── stats/stats.component.ts      (3-column proof grid with botanical icons)
│   ├── course-card/course-card.component.ts (Card with pill badge, duration, instructor)
│   ├── course-list/course-list.component.ts (@for loop tracking course.id with filters)
│   ├── lesson-preview/lesson-preview.component.ts (Interactive curriculum accordion)
│   ├── testimonials/testimonials.component.ts (Quotes with organic curved container)
│   └── footer/footer.component.ts    (Botanical copyright, newsletter capture)
└── app.routes.ts                     (Standalone routes: catalog, course details, lessons)
```
