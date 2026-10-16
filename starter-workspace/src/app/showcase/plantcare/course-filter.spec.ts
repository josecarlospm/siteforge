import { describe, expect, it } from 'vitest';
import { filterCourses, type FilterableCourse } from './course-filter';

const sample: FilterableCourse[] = [
  {
    id: 'a',
    title: 'Monstera Deliciosa Basics',
    instructor: 'Elena Vance',
    level: 'Beginner',
    category: 'Tropical Foliage',
    summary: 'Node propagation and moss poles',
  },
  {
    id: 'b',
    title: 'Organic Pest Eradication',
    instructor: 'Samantha Wei',
    level: 'Intermediate',
    category: 'Pest Eradication',
    summary: 'Thrips and spider mites',
  },
  {
    id: 'c',
    title: 'Light Diagnostics',
    instructor: 'Julian Croft',
    level: 'All Levels',
    category: 'Low-Light Survivors',
    summary: 'Foot-candles and window orientation',
  },
];

describe('filterCourses', () => {
  it('returns all courses when filters are open', () => {
    const result = filterCourses(sample, {
      query: '',
      category: 'All Categories',
      level: 'All Levels',
    });
    expect(result).toHaveLength(3);
  });

  it('filters by category', () => {
    const result = filterCourses(sample, {
      query: '',
      category: 'Pest Eradication',
      level: 'All Levels',
    });
    expect(result.map((c) => c.id)).toEqual(['b']);
  });

  it('filters by search query across title and summary', () => {
    const result = filterCourses(sample, {
      query: 'moss',
      category: 'All Categories',
      level: 'All Levels',
    });
    expect(result.map((c) => c.id)).toEqual(['a']);
  });

  it('filters by skill level', () => {
    const result = filterCourses(sample, {
      query: '',
      category: 'All Categories',
      level: 'Intermediate',
    });
    expect(result.map((c) => c.id)).toEqual(['b']);
  });
});
