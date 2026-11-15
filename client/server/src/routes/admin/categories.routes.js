import { Router } from 'express'
import {
  getCategories,
  getCategory,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from '../../controllers/category.controller.js'
import { authenticate, requirePermission } from '../../middlewares/auth.js'
import { PERMISSIONS } from '../../config/rbac.js'

const router = Router()

// All admin category operations require authentication
router.use(authenticate)

router.get('/', requirePermission(PERMISSIONS.CATEGORIES_READ), getCategories)
router.get('/:id', requirePermission(PERMISSIONS.CATEGORIES_READ), getCategory)
router.post('/', requirePermission(PERMISSIONS.CATEGORIES_CREATE), createCategoryController)
router.put('/:id', requirePermission(PERMISSIONS.CATEGORIES_UPDATE), updateCategoryController)
router.delete('/:id', requirePermission(PERMISSIONS.CATEGORIES_DELETE), deleteCategoryController)

export default router
