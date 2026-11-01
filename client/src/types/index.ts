export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'

export interface CurriculumSection {
  title: string
  lessons: string[]
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  longDescription?: string
  category: string
  categorySlug: string
  instructor: string
  instructorRole: string
  instructorAvatar: string
  thumbnail: string
  duration: string
  lessonsCount: number
  level: CourseLevel
  price: number
  originalPrice?: number
  rating: number
  reviewsCount: number
  totalStudents: number
  tags: string[]
  badge?: 'Bestseller' | 'Trending' | 'New' | 'Top Rated'
  featured?: boolean
  popular?: boolean
  curriculum?: CurriculumSection[]
  learningOutcomes?: string[]
  updatedAt?: string
  language?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  iconName: string
  coursesCount: number
  accentColor: 'yellow' | 'orange' | 'purple' | 'slate'
  popular: boolean
}

export interface Instructor {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  bio: string
  rating: number
  studentsCount: number
  coursesCount: number
  badge?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  content: string
  rating: number
  courseTaken: string
}
