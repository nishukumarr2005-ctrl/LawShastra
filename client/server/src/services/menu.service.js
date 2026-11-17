import { prisma } from '../config/database.js'

const normalizeLocation = (value) => {
  const v = String(value || 'Header')
  return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
}

const normalizeMenu = (m) => ({
  id: m.id,
  label: m.label,
  path: m.path,
  location: m.location || 'Header',
  visible: m.visible !== false,
  order: m.order ?? 0,
  createdAt: m.createdAt,
  updatedAt: m.updatedAt,
})

export const listMenus = async ({ location, onlyVisible } = {}) => {
  const where = {}
  if (location) where.location = normalizeLocation(location)
  if (onlyVisible) where.visible = true
  const menus = await prisma.menuItem.findMany({
    where,
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
  })
  return menus.map(normalizeMenu)
}

export const getMenu = async (id) => {
  const m = await prisma.menuItem.findUnique({ where: { id: Number(id) } })
  return m ? normalizeMenu(m) : null
}

export const createMenu = async (payload = {}) => {
  const created = await prisma.menuItem.create({
    data: {
      label: payload.label || 'Menu',
      path: payload.path || '/',
      location: normalizeLocation(payload.location),
      visible: payload.visible !== false,
      order: Number(payload.order) || 0,
    },
  })
  return normalizeMenu(created)
}

export const updateMenu = async (id, payload = {}) => {
  const existing = await prisma.menuItem.findUnique({ where: { id: Number(id) } })
  if (!existing) return null
  const updated = await prisma.menuItem.update({
    where: { id: Number(id) },
    data: {
      label: payload.label ?? existing.label,
      path: payload.path ?? existing.path,
      location: payload.location ? normalizeLocation(payload.location) : existing.location,
      visible: payload.visible ?? existing.visible,
      order: payload.order !== undefined ? Number(payload.order) : existing.order,
    },
  })
  return normalizeMenu(updated)
}

export const deleteMenu = async (id) => {
  const existing = await prisma.menuItem.findUnique({ where: { id: Number(id) } })
  if (!existing) return false
  await prisma.menuItem.delete({ where: { id: Number(id) } })
  return true
}