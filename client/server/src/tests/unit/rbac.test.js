import { ROLES, PERMISSIONS, getPermissionsForRole, hasPermission } from '../../config/rbac.js'

describe('RBAC Configuration and Permission Checker', () => {
  it('defines all required roles and permissions', () => {
    expect(ROLES.SUPER_ADMIN).toBe('SUPER_ADMIN')
    expect(ROLES.ADMIN).toBe('ADMIN')
    expect(ROLES.EDITOR).toBe('EDITOR')
    expect(ROLES.AUTHOR).toBe('AUTHOR')
    expect(ROLES.REVIEWER).toBe('REVIEWER')
    expect(ROLES.MEDIA_MANAGER).toBe('MEDIA_MANAGER')
    expect(ROLES.ANALYST).toBe('ANALYST')

    expect(PERMISSIONS.CATEGORIES_READ).toBe('categories.read')
    expect(PERMISSIONS.CATEGORIES_CREATE).toBe('categories.create')
    expect(PERMISSIONS.ARTICLES_PUBLISH).toBe('articles.publish')
    expect(PERMISSIONS.USERS_MANAGE).toBe('users.manage')
  })

  it('grants full access to SUPER_ADMIN', () => {
    const permissions = getPermissionsForRole(ROLES.SUPER_ADMIN)
    expect(permissions).toContain('*')
    expect(hasPermission(permissions, 'categories.delete')).toBe(true)
    expect(hasPermission(permissions, 'users.manage')).toBe(true)
    expect(hasPermission(permissions, 'any.custom.permission')).toBe(true)
  })

  it('restricts EDITOR permissions according to principle of least privilege', () => {
    const permissions = getPermissionsForRole(ROLES.EDITOR)
    expect(hasPermission(permissions, 'categories.read')).toBe(true)
    expect(hasPermission(permissions, 'categories.create')).toBe(true)
    expect(hasPermission(permissions, 'categories.delete')).toBe(false)
    expect(hasPermission(permissions, 'users.manage')).toBe(false)
  })

  it('restricts ANALYST to read-only reporting', () => {
    const permissions = getPermissionsForRole(ROLES.ANALYST)
    expect(hasPermission(permissions, 'categories.read')).toBe(true)
    expect(hasPermission(permissions, 'audit.read')).toBe(true)
    expect(hasPermission(permissions, 'categories.create')).toBe(false)
    expect(hasPermission(permissions, 'articles.create')).toBe(false)
  })

  it('denies access by default for empty or invalid roles', () => {
    expect(hasPermission([], 'categories.read')).toBe(false)
    expect(hasPermission(undefined, 'categories.read')).toBe(false)
    expect(hasPermission(['unrelated.permission'], 'categories.read')).toBe(false)
  })
})
