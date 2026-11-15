import { Router } from 'express'
import { getPublicCategoriesController } from '../../controllers/category.controller.js'

const router = Router()

// Public endpoint - only returns live, published categories
router.get('/', getPublicCategoriesController)

export default router
