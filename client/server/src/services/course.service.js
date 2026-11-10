import { prisma } from '../config/database.js'

const toDisplayStatus = (status) => {
  if (status === 'PUBLISHED') return 'Published'
  return 'Draft'
}

const toDbStatus = (status) => {
  if (status === 'Published') return 'PUBLISHED'
  return 'DRAFT'
}

const toDisplayLevel = (level) => {
  if (level === 'BEGINNER') return 'Beginner'
  if (level === 'INTERMEDIATE') return 'Intermediate'
  return 'Advanced'
}

export const getAllCourses = async () => {
  const courses = await prisma.course.findMany({
    orderBy: { id: 'asc' },
  })

  return courses.map((course) => ({
    ...course,
    category: course.category,
    level: toDisplayLevel(course.level),
    status: toDisplayStatus(course.status),
  }))
}

export const getCourseById = async (id) => {
  const course = await prisma.course.findUnique({ where: { id: Number(id) } })

  if (!course) {
    return null
  }

  return {
    ...course,
    category: course.category,
    level: toDisplayLevel(course.level),
    status: toDisplayStatus(course.status),
  }
}

export const createCourse = async (payload = {}) => {
  const course = await prisma.course.create({
    data: {
      title: payload.title || 'New Course',
      category: payload.category || 'Civil Law',
      level: payload.level === 'Intermediate' ? 'INTERMEDIATE' : payload.level === 'Advanced' ? 'ADVANCED' : 'BEGINNER',
      duration: payload.duration || '4 weeks',
      status: toDbStatus(payload.status || 'Draft'),
      summary: payload.summary || '',
    },
  })

  return {
    ...course,
    category: course.category,
    level: toDisplayLevel(course.level),
    status: toDisplayStatus(course.status),
  }
}

export const updateCourse = async (id, payload = {}) => {
  const existing = await prisma.course.findUnique({ where: { id: Number(id) } })

  if (!existing) {
    throw new Error('Course not found')
  }

  const course = await prisma.course.update({
    where: { id: Number(id) },
    data: {
      title: payload.title || existing.title,
      category: payload.category || existing.category,
      level: payload.level === 'Intermediate' ? 'INTERMEDIATE' : payload.level === 'Advanced' ? 'ADVANCED' : 'BEGINNER',
      duration: payload.duration || existing.duration,
      status: payload.status ? toDbStatus(payload.status) : existing.status,
      summary: payload.summary || existing.summary,
    },
  })

  return {
    ...course,
    category: course.category,
    level: toDisplayLevel(course.level),
    status: toDisplayStatus(course.status),
  }
}

export const deleteCourse = async (id) => {
  await prisma.course.delete({ where: { id: Number(id) } })
  return true
}
