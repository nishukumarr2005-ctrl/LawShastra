import { Router } from 'express'
import authRoutes from './auth.routes.js'
import categoryRoutes from './category.routes.js'
import lawRoutes from './law.routes.js'
import courseRoutes from './course.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/categories', categoryRoutes)
router.use('/laws', lawRoutes)
router.use('/courses', courseRoutes)

export default router
