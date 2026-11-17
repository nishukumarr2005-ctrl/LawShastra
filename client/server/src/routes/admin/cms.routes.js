import { Router } from 'express'
import { authenticate } from '../../middlewares/auth.js'
import * as c from '../../controllers/admin/cms.controller.js'
import * as menuController from '../../controllers/admin/menu.controller.js'

const router = Router()
router.use(authenticate)

const crud = (base, h) => {
  router.get(`/${base}`, h.list)
  router.get(`/${base}/:id`, h.get)
  router.post(`/${base}`, h.create)
  router.put(`/${base}/:id`, h.update)
  router.delete(`/${base}/:id`, h.remove)
}

router.get('/bootstrap', c.bootstrap)

crud('subcategories', c.subcategories)
crud('articles', c.articles)
crud('pages', c.pages)
crud('media', c.media)
crud('tags', c.tags)
crud('homepage-blocks', c.homepageBlocks)
crud('banners', c.banners)
// Menus are backed by D1 (MenuItem table) so they persist across requests
crud('menus', menuController)
crud('visibility', c.visibilityRules)
crud('seo', c.seoEntries)
crud('feature-flags', c.featureFlags)
crud('roles', c.roles)

router.post('/feature-flags/:id/toggle', c.toggleFeatureFlag)

router.get('/settings', c.getSettings)
router.put('/settings', c.updateSettings)

router.get('/activity-logs', c.listActivityLogs)
router.post('/activity-logs', c.createActivityLog)

router.get('/notifications', c.listNotifications)
router.post('/notifications', c.createNotification)
router.post('/notifications/:id/read', c.markNotificationRead)

router.get('/backups', c.listBackups)
router.post('/backups/run', c.runBackup)

router.get('/maintenance', c.listMaintenance)
router.post('/maintenance/:id/toggle', c.toggleMaintenance)
router.post('/maintenance/:id/run', c.runMaintenance)

export default router
