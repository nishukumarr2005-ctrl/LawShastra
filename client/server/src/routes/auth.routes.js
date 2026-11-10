/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
import { Router } from 'express'

const router = Router()

router.post('/register', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Registration endpoint ready',
    data: { email: req.body.email || null },
  })
})

router.post('/login', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Login endpoint ready',
    data: { token: 'placeholder.jwt.token' },
  })
})

export default router
