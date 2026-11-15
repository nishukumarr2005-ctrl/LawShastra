import { Router } from 'express'
import { authenticate, requirePermission } from '../middlewares/auth.js'
import { PERMISSIONS, ROLES, ROLE_PERMISSIONS } from '../config/rbac.js'
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../services/auth.service.js'
import { sendSuccess, sendError } from '../utils/response.js'

const router = Router()

// All user management routes require authentication
router.use(authenticate)

// List users (requires users.read)
router.get('/', requirePermission(PERMISSIONS.USERS_READ), async (req, res, next) => {
  try {
    const users = await getAllUsers()
    return sendSuccess(res, 'Users fetched successfully', users)
  } catch (err) {
    return next(err)
  }
})

// Get role definitions (requires roles.manage)
router.get('/roles', requirePermission(PERMISSIONS.ROLES_MANAGE), (req, res) => {
  return sendSuccess(res, 'Roles fetched successfully', {
    roles: Object.values(ROLES),
    permissions: ROLE_PERMISSIONS,
  })
})

// Get single user
router.get('/:id', requirePermission(PERMISSIONS.USERS_READ), async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id)
    if (!user) {
      return sendError(res, 'User not found', [], 404)
    }
    return sendSuccess(res, 'User fetched successfully', user)
  } catch (err) {
    return next(err)
  }
})

// Create new user (requires users.manage)
router.post('/', requirePermission(PERMISSIONS.USERS_MANAGE), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body || {}
    if (!name || !email) {
      return sendError(res, 'Name and email are required', [], 400)
    }

    const newUser = await createUser({ name, email, password, role })
    return sendSuccess(res, 'User created successfully', newUser, 201)
  } catch (err) {
    return sendError(res, err.message, [], 400)
  }
})

// Update user (requires users.manage)
router.put('/:id', requirePermission(PERMISSIONS.USERS_MANAGE), async (req, res, next) => {
  try {
    const updated = await updateUser(req.params.id, req.body || {})
    return sendSuccess(res, 'User updated successfully', updated)
  } catch (err) {
    return sendError(res, err.message, [], 400)
  }
})

// Delete user (requires users.manage)
router.delete('/:id', requirePermission(PERMISSIONS.USERS_MANAGE), async (req, res, next) => {
  try {
    const result = await deleteUser(req.params.id)
    return sendSuccess(res, 'User deleted successfully', result)
  } catch (err) {
    return sendError(res, err.message, [], 400)
  }
})

export default router
