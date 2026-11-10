import { Router } from 'express'
import { createCategoryController, deleteCategoryController, getCategories, getCategory, updateCategoryController } from '../controllers/category.controller.js'

const router = Router()

router.get('/', getCategories)
router.get('/:id', getCategory)
router.post('/', createCategoryController)
router.put('/:id', updateCategoryController)
router.delete('/:id', deleteCategoryController)

export default router
