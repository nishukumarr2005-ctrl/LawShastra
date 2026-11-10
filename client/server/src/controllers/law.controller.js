import { sendError, sendSuccess } from '../utils/response.js'
import { createLaw, deleteLaw, getAllLaws, getLawById, getLawBySlug, updateLaw } from '../services/law.service.js'

export const getLaws = async (req, res, next) => {
  try {
    const laws = await getAllLaws()
    return sendSuccess(res, 'Laws fetched successfully', laws)
  } catch (error) {
    return next(error)
  }
}

export const getLaw = async (req, res, next) => {
  try {
    const law = await getLawBySlug(req.params.slug)

    if (!law) {
      return sendError(res, 'Law not found', [], 404)
    }

    return sendSuccess(res, 'Law fetched successfully', law)
  } catch (error) {
    return next(error)
  }
}

export const createLawController = async (req, res, next) => {
  try {
    const law = await createLaw(req.body || {})
    return sendSuccess(res, 'Law created successfully', law, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateLawController = async (req, res, next) => {
  try {
    const law = await updateLaw(req.params.id, req.body || {})

    if (!law) {
      return sendError(res, 'Law not found', [], 404)
    }

    return sendSuccess(res, 'Law updated successfully', law)
  } catch (error) {
    return next(error)
  }
}

export const deleteLawController = async (req, res, next) => {
  try {
    const existing = await getLawById(req.params.id)

    if (!existing) {
      return sendError(res, 'Law not found', [], 404)
    }

    await deleteLaw(req.params.id)
    return sendSuccess(res, 'Law deleted successfully', { id: Number(req.params.id) })
  } catch (error) {
    return next(error)
  }
}
