import { apiRequest } from './apiClient'

export type Id = number

const enc = (v: string | number) => encodeURIComponent(String(v))

const list = <T>(path: string) => apiRequest<T[]>(path)
const create = <T>(path: string, body: unknown) => apiRequest<T>(path, { method: 'POST', body })
const update = <T>(path: string, id: Id, body: unknown) => apiRequest<T>(`${path}/${enc(id)}`, { method: 'PUT', body })
const remove = <T = { id: Id }>(path: string, id: Id) => apiRequest<T>(`${path}/${enc(id)}`, { method: 'DELETE' })
const post = <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'POST', body })

// Dashboard / bootstrap
export const fetchDashboard = () => apiRequest<any>('/admin/dashboard')
export const fetchBootstrap = () => apiRequest<any>('/admin/bootstrap')

// Categories (admin, protected)
export const fetchAdminCategories = () => list<any>('/admin/categories')
export const createAdminCategory = (body: any) => create<any>('/admin/categories', body)
export const updateAdminCategory = (id: Id, body: any) => update<any>('/admin/categories', id, body)
export const deleteAdminCategory = (id: Id) => remove('/admin/categories', id)

// Subcategories
export const fetchSubcategories = () => list<any>('/admin/subcategories')
export const createSubcategory = (body: any) => create<any>('/admin/subcategories', body)
export const updateSubcategory = (id: Id, body: any) => update<any>('/admin/subcategories', id, body)
export const deleteSubcategory = (id: Id) => remove('/admin/subcategories', id)

// Articles
export const fetchArticles = () => list<any>('/admin/articles')
export const createArticle = (body: any) => create<any>('/admin/articles', body)
export const updateArticle = (id: Id, body: any) => update<any>('/admin/articles', id, body)
export const deleteArticle = (id: Id) => remove('/admin/articles', id)

// Legal resources (laws) - reuse existing endpoints
export const fetchLegalResources = () => list<any>('/laws')
export const createLegalResource = (body: any) => create<any>('/laws', body)
export const updateLegalResource = (id: Id, body: any) => update<any>('/laws', id, body)
export const deleteLegalResource = (id: Id) => remove('/laws', id)

// Pages
export const fetchPages = () => list<any>('/admin/pages')
export const createPage = (body: any) => create<any>('/admin/pages', body)
export const updatePage = (id: Id, body: any) => update<any>('/admin/pages', id, body)
export const deletePage = (id: Id) => remove('/admin/pages', id)

// Media
export const fetchMedia = () => list<any>('/admin/media')
export const createMedia = (body: any) => create<any>('/admin/media', body)
export const updateMedia = (id: Id, body: any) => update<any>('/admin/media', id, body)
export const deleteMedia = (id: Id) => remove('/admin/media', id)

// Tags
export const fetchTags = () => list<any>('/admin/tags')
export const createTag = (body: any) => create<any>('/admin/tags', body)
export const updateTag = (id: Id, body: any) => update<any>('/admin/tags', id, body)
export const deleteTag = (id: Id) => remove('/admin/tags', id)

// Homepage blocks
export const fetchHomepageBlocks = () => list<any>('/admin/homepage-blocks')
export const createHomepageBlock = (body: any) => create<any>('/admin/homepage-blocks', body)
export const updateHomepageBlock = (id: Id, body: any) => update<any>('/admin/homepage-blocks', id, body)
export const deleteHomepageBlock = (id: Id) => remove('/admin/homepage-blocks', id)

// Banners
export const fetchBanners = () => list<any>('/admin/banners')
export const createBanner = (body: any) => create<any>('/admin/banners', body)
export const updateBanner = (id: Id, body: any) => update<any>('/admin/banners', id, body)
export const deleteBanner = (id: Id) => remove('/admin/banners', id)

// Menus
export const fetchMenus = () => list<any>('/admin/menus')
export const createMenu = (body: any) => create<any>('/admin/menus', body)
export const updateMenu = (id: Id, body: any) => update<any>('/admin/menus', id, body)
export const deleteMenu = (id: Id) => remove('/admin/menus', id)

// Visibility
export const fetchVisibility = () => list<any>('/admin/visibility')
export const createVisibility = (body: any) => create<any>('/admin/visibility', body)
export const updateVisibility = (id: Id, body: any) => update<any>('/admin/visibility', id, body)
export const deleteVisibility = (id: Id) => remove('/admin/visibility', id)

// SEO
export const fetchSeo = () => list<any>('/admin/seo')
export const createSeo = (body: any) => create<any>('/admin/seo', body)
export const updateSeo = (id: Id, body: any) => update<any>('/admin/seo', id, body)
export const deleteSeo = (id: Id) => remove('/admin/seo', id)

// Users & Roles
export const fetchUsers = () => list<any>('/admin/users')
export const createUser = (body: any) => create<any>('/admin/users', body)
export const updateUser = (id: Id, body: any) => update<any>('/admin/users', id, body)
export const deleteUser = (id: Id) => remove('/admin/users', id)

export const fetchRoles = () => list<any>('/admin/roles')
export const createRole = (body: any) => create<any>('/admin/roles', body)
export const updateRole = (id: Id, body: any) => update<any>('/admin/roles', id, body)
export const deleteRole = (id: Id) => remove('/admin/roles', id)

// Feature flags
export const fetchFeatureFlags = () => list<any>('/admin/feature-flags')
export const createFeatureFlag = (body: any) => create<any>('/admin/feature-flags', body)
export const updateFeatureFlag = (id: Id, body: any) => update<any>('/admin/feature-flags', id, body)
export const deleteFeatureFlag = (id: Id) => remove('/admin/feature-flags', id)
export const toggleFeatureFlag = (id: Id) => post<any>(`/admin/feature-flags/${enc(id)}/toggle`)

// Settings
export const fetchSettings = () => apiRequest<any>('/admin/settings')
export const saveSettings = (body: any) => apiRequest<any>('/admin/settings', { method: 'PUT', body })

// Activity logs
export const fetchActivityLogs = () => list<any>('/admin/activity-logs')
export const createActivityLog = (body: any) => create<any>('/admin/activity-logs', body)

// Notifications
export const fetchNotifications = () => list<any>('/admin/notifications')
export const createNotification = (body: any) => create<any>('/admin/notifications', body)
export const markNotificationRead = (id: Id) => post<any>(`/admin/notifications/${enc(id)}/read`)

// Backups & maintenance
export const fetchBackups = () => list<any>('/admin/backups')
export const runBackup = () => post<any>('/admin/backups/run')
export const fetchMaintenance = () => list<any>('/admin/maintenance')
export const toggleMaintenance = (id: Id) => post<any>(`/admin/maintenance/${enc(id)}/toggle`)
export const runMaintenance = (id: Id) => post<any>(`/admin/maintenance/${enc(id)}/run`)
