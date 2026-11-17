import { cms } from '../../services/admin/cms.service.js'
import { sendSuccess, sendError } from '../../utils/response.js'
import { listMenus } from '../../services/menu.service.js'

const resource = (key, opts = {}) => ({
  list: (req, res) => sendSuccess(res, `${key} fetched`, cms.list(key)),
  get: (req, res) => {
    const item = cms.getById(key, req.params.id)
    if (!item) return sendError(res, 'Not found', [], 404)
    return sendSuccess(res, `${key} item fetched`, item)
  },
  create: (req, res) => {
    const body = opts.prepareCreate ? opts.prepareCreate(req.body || {}) : (req.body || {})
    const item = cms.create(key, body)
    cms.logActivity(req.user?.email || 'Admin', `Created ${opts.label || key}`, item.title || item.name || item.label || item.component || item.path || item.key || `#${item.id}`, 'success')
    return sendSuccess(res, `${opts.label || key} created`, item, 201)
  },
  update: (req, res) => {
    const body = opts.prepareUpdate ? opts.prepareUpdate(req.body || {}) : (req.body || {})
    const item = cms.update(key, req.params.id, body)
    if (!item) return sendError(res, 'Not found', [], 404)
    cms.logActivity(req.user?.email || 'Admin', `Updated ${opts.label || key}`, item.title || item.name || item.label || item.component || item.path || item.key || `#${item.id}`, 'success')
    return sendSuccess(res, `${opts.label || key} updated`, item)
  },
  remove: (req, res) => {
    const ok = cms.remove(key, req.params.id)
    if (!ok) return sendError(res, 'Not found', [], 404)
    cms.logActivity(req.user?.email || 'Admin', `Deleted ${opts.label || key}`, `#${req.params.id}`, 'warning')
    return sendSuccess(res, `${opts.label || key} deleted`, { id: Number(req.params.id) })
  },
})

export const subcategories = resource('subcategories', { label: 'subcategory', prepareCreate: (b) => ({ name: b.name || 'Untitled', slug: b.slug || cms.slugify(b.name || ''), categoryId: Number(b.categoryId) || 0, status: b.status || 'Draft' }), prepareUpdate: (b) => ({ ...b, ...(b.name && !b.slug ? { slug: cms.slugify(b.name) } : {}), ...(b.categoryId ? { categoryId: Number(b.categoryId) } : {}) }) })
export const articles = resource('articles', { label: 'article', prepareCreate: (b) => ({ title: b.title || 'Untitled', slug: b.slug || cms.slugify(b.title || ''), categoryId: b.categoryId ?? null, excerpt: b.excerpt || '', content: b.content || '', status: b.status || 'Draft', author: b.author || 'Admin', tags: b.tags || [], updatedAt: new Date().toISOString() }), prepareUpdate: (b) => ({ ...b, updatedAt: new Date().toISOString(), ...(b.title && !b.slug ? { slug: cms.slugify(b.title) } : {}) }) })
export const pages = resource('pages', { label: 'page', prepareCreate: (b) => ({ title: b.title || 'Untitled', slug: b.slug || cms.slugify(b.title || ''), status: b.status || 'Draft', template: b.template || 'Standard', content: b.content || '', updatedAt: new Date().toISOString() }), prepareUpdate: (b) => ({ ...b, updatedAt: new Date().toISOString() }) })
export const media = resource('media', { label: 'media', prepareCreate: (b) => ({ name: b.name || 'file', type: b.type || 'Document', url: b.url || `/uploads/${cms.slugify(b.name || 'file')}`, size: b.size || '—', updatedAt: new Date().toISOString() }) })
export const tags = resource('tags', { label: 'tag', prepareCreate: (b) => ({ name: b.name || 'tag', slug: b.slug || cms.slugify(b.name || ''), usage: b.usage ?? 0 }) })
export const homepageBlocks = resource('homepageBlocks', { label: 'homepage block', prepareCreate: (b) => ({ title: b.title || 'Block', type: b.type || 'Custom', enabled: b.enabled ?? true, order: Number(b.order) || 1 }) })
export const banners = resource('banners', { label: 'banner', prepareCreate: (b) => ({ title: b.title || 'Banner', location: b.location || 'Homepage', status: b.status || 'Active', link: b.link || '/', image: b.image || '' }) })
export const menus = resource('menus', { label: 'menu', prepareCreate: (b) => ({ label: b.label || 'Menu', path: b.path || '/', location: b.location || 'Header', visible: b.visible ?? true, order: Number(b.order) || 1 }) })
export const visibilityRules = resource('visibilityRules', { label: 'visibility rule', prepareCreate: (b) => ({ component: b.component || 'Component', desktop: b.desktop ?? true, tablet: b.tablet ?? true, mobile: b.mobile ?? true, note: b.note || '' }) })
export const seoEntries = resource('seoEntries', { label: 'seo entry', prepareCreate: (b) => ({ path: b.path || '/', title: b.title || '', description: b.description || '', noindex: b.noindex ?? false }) })
export const featureFlags = resource('featureFlags', { label: 'feature flag', prepareCreate: (b) => ({ key: b.key || cms.slugify(b.label || 'flag'), label: b.label || 'Flag', enabled: b.enabled ?? false, description: b.description || '' }) })
export const roles = resource('roles', { label: 'role', prepareCreate: (b) => ({ name: b.name || 'ROLE', description: b.description || '', permissions: b.permissions || [] }) })
export const maintenance = resource('maintenance', { label: 'maintenance task' })

export const toggleFeatureFlag = (req, res) => {
  const item = cms.toggleFlag(req.params.id)
  if (!item) return sendError(res, 'Not found', [], 404)
  cms.logActivity(req.user?.email || 'Admin', 'Toggled feature flag', item.label, 'success')
  return sendSuccess(res, 'Feature flag toggled', item)
}

export const getSettings = (req, res) => sendSuccess(res, 'Settings fetched', cms.getSettings())
export const updateSettings = (req, res) => {
  const s = cms.updateSettings(req.body || {})
  cms.logActivity(req.user?.email || 'Admin', 'Updated settings', 'website settings', 'success')
  return sendSuccess(res, 'Settings updated', s)
}

export const listActivityLogs = (req, res) => sendSuccess(res, 'Activity logs fetched', cms.list('activityLogs'))
export const createActivityLog = (req, res) => {
  const b = req.body || {}
  const item = cms.create('activityLogs', { actor: b.actor || req.user?.email || 'Admin', action: b.action || 'Action', target: b.target || '', createdAt: new Date().toISOString(), level: b.level || 'info' })
  return sendSuccess(res, 'Activity log created', item, 201)
}

export const listNotifications = (req, res) => sendSuccess(res, 'Notifications fetched', cms.list('notifications'))
export const createNotification = (req, res) => {
  const b = req.body || {}
  const item = cms.create('notifications', { title: b.title || 'Notification', message: b.message || '', channel: b.channel || 'In-App', read: false, createdAt: new Date().toISOString() })
  return sendSuccess(res, 'Notification created', item, 201)
}
export const markNotificationRead = (req, res) => {
  const item = cms.markNotificationRead(req.params.id)
  if (!item) return sendError(res, 'Not found', [], 404)
  return sendSuccess(res, 'Notification marked read', item)
}

export const listBackups = (req, res) => sendSuccess(res, 'Backups fetched', cms.list('backups'))
export const runBackup = (req, res) => sendSuccess(res, 'Backup completed', cms.runBackup())

export const listMaintenance = (req, res) => sendSuccess(res, 'Maintenance fetched', cms.list('maintenance'))
export const toggleMaintenance = (req, res) => {
  const item = cms.toggleMaintenance(req.params.id)
  if (!item) return sendError(res, 'Not found', [], 404)
  return sendSuccess(res, 'Maintenance toggled', item)
}
export const runMaintenance = (req, res) => {
  const item = cms.runMaintenance(req.params.id)
  if (!item) return sendError(res, 'Not found', [], 404)
  return sendSuccess(res, 'Maintenance run', item)
}

export const bootstrap = async (req, res, next) => {
  try {
    const data = cms.getAll()
    // Menus are D1-backed; merge them into the bootstrap payload so the
    // admin Menus page reflects the persisted (D1) navigation items.
    const menus = await listMenus().catch(() => data.menus || [])
    return sendSuccess(res, 'CMS bootstrap fetched', { ...data, menus })
  } catch (error) {
    return next(error)
  }
}
