import { sendError, sendSuccess } from '../utils/response.js'
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse } from '../services/course.service.js'

export const getCourses = async (req, res, next) => {
  try {
    const courses = await getAllCourses()
    return sendSuccess(res, 'Courses fetched successfully', courses)
  } catch (error) {
    return next(error)
  }
}

export const getCourse = async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.id)

    if (!course) {
      return sendError(res, 'Course not found', [], 404)
    }

    return sendSuccess(res, 'Course fetched successfully', course)
  } catch (error) {
    return next(error)
  }
}

export const createCourseController = async (req, res, next) => {
  try {
    const course = await createCourse(req.body || {})
    return sendSuccess(res, 'Course created successfully', course, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateCourseController = async (req, res, next) => {
  try {
    const course = await updateCourse(req.params.id, req.body || {})
    if (!course) {
      return sendError(res, 'Course not found', [], 404)
    }
    return sendSuccess(res, 'Course updated successfully', course)
  } catch (error) {
    return next(error)
  }
}

export const deleteCourseController = async (req, res, next) => {
  try {
    const existing = await getCourseById(req.params.id)
    if (!existing) {
      return sendError(res, 'Course not found', [], 404)
    }
    await deleteCourse(req.params.id)
    return sendSuccess(res, 'Course deleted successfully', { id: Number(req.params.id) })
  } catch (error) {
    return next(error)
  }
}
