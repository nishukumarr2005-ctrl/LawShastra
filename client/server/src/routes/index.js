import { Router } from 'express'
import authRoutes from './auth.routes.js'
import categoryRoutes from './category.routes.js'
import lawRoutes from './law.routes.js'
import courseRoutes from './course.routes.js'
import userRoutes from './user.routes.js'
import adminCategoryRoutes from './admin/categories.routes.js'
import adminCmsRoutes from './admin/cms.routes.js'
import publicCategoryRoutes from './public/categories.routes.js'
import publicCatalogRoutes from './public/catalog.routes.js'
import { getDashboardController } from '../controllers/dashboard.controller.js'
import { authenticate } from '../middlewares/auth.js'

const router = Router()

// Auth
router.use('/auth', authRoutes)

// Admin Dashboard & Management
router.get('/admin/dashboard', authenticate, getDashboardController)
router.use('/admin/users', userRoutes)
router.use('/admin/categories', adminCategoryRoutes)
router.use('/admin', adminCmsRoutes)

// Public API
router.use('/public/categories', publicCategoryRoutes)
router.use('/public', publicCatalogRoutes)

// Existing endpoints preserved for full backward compatibility
router.use('/categories', categoryRoutes)
router.use('/laws', lawRoutes)
router.use('/courses', courseRoutes)

export default router
