import { Router } from 'express'
import { createLawController, deleteLawController, getLaw, getLaws, updateLawController } from '../controllers/law.controller.js'

const router = Router()

router.get('/', getLaws)
router.get('/slug/:slug', getLaw)
router.post('/', createLawController)
router.put('/:id', updateLawController)
router.delete('/:id', deleteLawController)

export default router
