import { Router } from 'express'
import { getPublicCatalog, getPublicCms } from '../../controllers/public/catalog.controller.js'

const router = Router()

router.get('/catalog', getPublicCatalog)
router.get('/cms', getPublicCms)

export default router