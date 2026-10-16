import { z } from 'zod';

export const courseModuleSchema = z.object({
  title: z.string().min(1, 'Module title is required'),
  duration: z.string().min(1, 'Module duration is required'),
  summary: z.string().optional(),
});

export const courseItemSchema = z.object({
  id: z.string().min(1, 'Course ID is required'),
  title: z.string().min(1, 'Course title is required'),
  instructor: z.string().min(1, 'Instructor name is required'),
  level: z.string().min(1, 'Level is required'),
  duration: z.string().min(1, 'Duration is required'),
  lessonsCount: z.number().int().min(1, 'lessonsCount must be at least 1'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  studentsCount: z.number().int().min(0, 'studentsCount cannot be negative'),
  badge: z.string().optional(),
  summary: z.string().min(1, 'Course summary is required'),
  thumbnailUrl: z.string().optional(),
  modules: z.array(courseModuleSchema).min(1, 'At least one module is required'),
});

export const statItemSchema = z.object({
  value: z.string().min(1, 'Stat value is required'),
  label: z.string().min(1, 'Stat label is required'),
  icon: z.string().optional(),
});

export const testimonialItemSchema = z.object({
  quote: z.string().min(1, 'Testimonial quote is required'),
  author: z.string().min(1, 'Testimonial author is required'),
  role: z.string().min(1, 'Testimonial author role is required'),
  avatarUrl: z.string().optional(),
});

export const faqItemSchema = z.object({
  question: z.string().min(1, 'FAQ question is required'),
  answer: z.string().min(1, 'FAQ answer is required'),
});

export const learningPlatformContentSchema = z.object({
  featuredCategories: z
    .array(z.string().min(1))
    .min(1, 'At least one featured category is required'),
  courses: z.array(courseItemSchema).min(1, 'At least one course is required'),
  stats: z.array(statItemSchema).optional(),
  testimonials: z.array(testimonialItemSchema).optional(),
  faqs: z.array(faqItemSchema).optional(),
});
