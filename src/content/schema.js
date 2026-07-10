import { z } from 'zod'

export const socialSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
  handle: z.string().optional().default(''),
})

export const profileSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  tagline: z.string().min(1),
  avatar: z.string().min(1),
  avatars: z.array(z.string().min(1)).optional().default([]),
  location: z.string().min(1),
  email: z.string().email(),
  resumeUrl: z.string().min(1),
  availability: z.string().optional().default(''),
  bio: z.string().min(1),
  socials: z.array(socialSchema).default([]),
})

export const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().optional().default(''),
  liveUrl: z.string().optional().default(''),
  repoUrl: z.string().optional().default(''),
  featured: z.boolean().optional().default(false),
  date: z.string().optional().default(''),
})

export const skillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  proficiency: z.number().min(0).max(100),
  icon: z.string().optional().default(''),
})

export const experienceSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional().default(''),
  summary: z.string().optional().default(''),
  bullets: z.array(z.string()).default([]),
})

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  ogImage: z.string().optional().default(''),
  twitterHandle: z.string().optional().default(''),
  siteUrl: z.string().min(1),
})

export const contentSchema = z.object({
  profile: profileSchema,
  projects: z.array(projectSchema),
  skills: z.array(skillSchema),
  experience: z.array(experienceSchema),
  seo: seoSchema,
})

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
})

/**
 * Validate the full content object, throwing a readable error naming the
 * exact failing field if anything is malformed.
 * @param {unknown} raw
 */
export function validateContent(raw) {
  const result = contentSchema.safeParse(raw)
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n')
    throw new Error(`Portfolio content failed validation:\n${issues}`)
  }
  return result.data
}
