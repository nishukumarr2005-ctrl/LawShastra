import { Router } from 'express'
import { loginController, getMeController, logoutController } from '../controllers/auth.controller.js'
import { authenticate } from '../middlewares/auth.js'

const router = Router()

router.post('/login', loginController)
router.get('/me', authenticate, getMeController)
router.post('/logout', logoutController)

router.post('/register', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Registration endpoint ready',
    data: { email: req.body.email || null },
  })
})

export default router
