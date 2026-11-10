import { Router } from 'express'
import { createCourseController, deleteCourseController, getCourse, getCourses, updateCourseController } from '../controllers/course.controller.js'

const router = Router()

router.get('/', getCourses)
router.get('/:id', getCourse)
router.post('/', createCourseController)
router.put('/:id', updateCourseController)
router.delete('/:id', deleteCourseController)

export default router
