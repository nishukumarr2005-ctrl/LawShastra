import * as menuService from '../../services/menu.service.js'
import { sendSuccess, sendError } from '../../utils/response.js'
import { cms } from '../../services/admin/cms.service.js'

const logMenu = (actor, action, target, level = 'info') => {
  try {
    cms.logActivity(actor, action, target, level)
  } catch {
    // logging is best-effort
  }
}

export const list = async (req, res, next) => {
  try {
    const menus = await menuService.listMenus()
    return sendSuccess(res, 'menus fetched', menus)
  } catch (error) {
    return next(error)
  }
}

export const get = async (req, res, next) => {
  try {
    const item = await menuService.getMenu(req.params.id)
    if (!item) return sendError(res, 'Not found', [], 404)
    return sendSuccess(res, 'menu item fetched', item)
  } catch (error) {
    return next(error)
  }
}

export const create = async (req, res, next) => {
  try {
    const item = await menuService.createMenu(req.body || {})
    logMenu(req.user?.email || 'Admin', 'Created menu', item.label, 'success')
    return sendSuccess(res, 'menu created', item, 201)
  } catch (error) {
    return next(error)
  }
}

export const update = async (req, res, next) => {
  try {
    const item = await menuService.updateMenu(req.params.id, req.body || {})
    if (!item) return sendError(res, 'Not found', [], 404)
    logMenu(req.user?.email || 'Admin', 'Updated menu', item.label, 'success')
    return sendSuccess(res, 'menu updated', item)
  } catch (error) {
    return next(error)
  }
}

export const remove = async (req, res, next) => {
  try {
    const ok = await menuService.deleteMenu(req.params.id)
    if (!ok) return sendError(res, 'Not found', [], 404)
    logMenu(req.user?.email || 'Admin', 'Deleted menu', `#${req.params.id}`, 'warning')
    return sendSuccess(res, 'menu deleted', { id: Number(req.params.id) })
  } catch (error) {
    return next(error)
  }
}