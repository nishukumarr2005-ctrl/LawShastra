import { sendError, sendSuccess } from '../utils/response.js'
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../services/category.service.js'

export const getCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategories()
    return sendSuccess(res, 'Categories fetched successfully', categories)
  } catch (error) {
    return next(error)
  }
}

export const getCategory = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id)

    if (!category) {
      return sendError(res, 'Category not found', [], 404)
    }

    return sendSuccess(res, 'Category fetched successfully', category)
  } catch (error) {
    return next(error)
  }
}

export const createCategoryController = async (req, res, next) => {
  try {
    const category = await createCategory(req.body || {})
    return sendSuccess(res, 'Category created successfully', category, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateCategoryController = async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body || {})
    if (!category) {
      return sendError(res, 'Category not found', [], 404)
    }
    return sendSuccess(res, 'Category updated successfully', category)
  } catch (error) {
    return next(error)
  }
}

export const deleteCategoryController = async (req, res, next) => {
  try {
    const existing = await getCategoryById(req.params.id)
    if (!existing) {
      return sendError(res, 'Category not found', [], 404)
    }
    await deleteCategory(req.params.id)
    return sendSuccess(res, 'Category deleted successfully', { id: Number(req.params.id) })
  } catch (error) {
    return next(error)
  }
}
