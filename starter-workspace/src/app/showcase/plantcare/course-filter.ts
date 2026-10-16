export interface FilterableCourse {
  id: string;
  title: string;
  instructor: string;
  level: string;
  category: string;
  summary: string;
}

export interface CourseFilterCriteria {
  query: string;
  category: string;
  level: string;
}

/**
 * Pure catalog filter used by the PlantCare learning platform UI.
 */
export function filterCourses<T extends FilterableCourse>(
  courses: readonly T[],
  criteria: CourseFilterCriteria,
): T[] {
  const q = criteria.query.toLowerCase().trim();
  const cat = criteria.category;
  const lvl = criteria.level;

  return courses.filter((c) => {
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
}
