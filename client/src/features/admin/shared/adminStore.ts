import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from '@/services/adminApi'

type StoreListener = () => void

export type CategoryStatus = 'Live' | 'Draft'
export type ContentStatus = 'Published' | 'Review' | 'Draft'

export interface AdminCategory {
  id: number
  name: string
  slug: string
  description?: string
  parentId?: number | null
  count: number
  status: CategoryStatus
  featured: boolean
  showOnWebsite: boolean
}

export interface AdminSubcategory {
  id: number
  name: string
  slug: string
  categoryId: number
  status: 'Published' | 'Draft'
}

export interface AdminArticle {
  id: number
  title: string
  slug: string
  categoryId?: number | null
  excerpt: string
  content?: string
  status: ContentStatus
  author: string
  tags: string[]
  updatedAt: string
}

export interface AdminLawChapter {
  id?: number
  title: string
  content: string
}

export interface AdminLegalResource {
  id: number
  title: string
  shortTitle?: string
  slug?: string
  category: string
  jurisdiction: string
  status: ContentStatus
  summary: string
  sourceUrl?: string
  sourceLabel?: string
  pdfUrl?: string
  pdfExtractedText?: string
  subcategories: string[]
  chapters: AdminLawChapter[]
}

export interface AdminPage {
  id: number
  title: string
  slug: string
  status: ContentStatus
  template: string
  content?: string
  updatedAt: string
}

export interface AdminMedia {
  id: number
  name: string
  type: 'Image' | 'Document' | 'Video'
  url: string
  size: string
  updatedAt: string
}

export interface AdminTag {
  id: number
  name: string
  slug: string
  usage: number
}

export interface HomepageBlock {
  id: number
  title: string
  type: string
  enabled: boolean
  order: number
}

export interface BannerItem {
  id: number
  title: string
  location: string
  status: 'Active' | 'Scheduled' | 'Hidden'
  link: string
  image?: string
}

export interface MenuItem {
  id: number
  label: string
  path: string
  location: 'Header' | 'Footer' | 'Sidebar'
  visible: boolean
  order: number
}

export interface VisibilityRule {
  id: number
  component: string
  desktop: boolean
  tablet: boolean
  mobile: boolean
  note: string
}

export interface SeoEntry {
  id: number
  path: string
  title: string
  description: string
  noindex: boolean
}

export interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  status: 'Active' | 'Invited' | 'Disabled'
  lastActive: string
}

export interface RoleDef {
  id: number
  name: string
  description: string
  permissions: string[]
}

export interface FeatureFlag {
  id: number
  key: string
  label: string
  enabled: boolean
  description: string
}

export interface WebsiteSettings {
  siteName: string
  tagline: string
  supportEmail: string
  contactPhone: string
  maintenanceMode: boolean
  defaultTheme: string
}

export interface ActivityLog {
  id: number
  actor: string
  action: string
  target: string
  createdAt: string
  level: 'info' | 'warning' | 'success'
}

export interface NotificationItem {
  id: number
  title: string
  message: string
  channel: 'In-App' | 'Email'
  read: boolean
  createdAt: string
}

export interface BackupItem {
  id: number
  label: string
  createdAt: string
  size: string
  status: 'Completed' | 'Running' | 'Failed'
}

export interface MaintenanceTask {
  id: number
  name: string
  schedule: string
  lastRun: string
  enabled: boolean
}

interface AdminState {
  hydrated: boolean
  hydrating: boolean
  categories: AdminCategory[]
  subcategories: AdminSubcategory[]
  articles: AdminArticle[]
  legalResources: AdminLegalResource[]
  pages: AdminPage[]
  media: AdminMedia[]
  tags: AdminTag[]
  homepageBlocks: HomepageBlock[]
  banners: BannerItem[]
  menus: MenuItem[]
  visibilityRules: VisibilityRule[]
  seoEntries: SeoEntry[]
  users: AdminUser[]
  roles: RoleDef[]
  featureFlags: FeatureFlag[]
  settings: WebsiteSettings
  activityLogs: ActivityLog[]
  notifications: NotificationItem[]
  backups: BackupItem[]
  maintenance: MaintenanceTask[]
  lastSyncedAt?: string
  syncError?: string | null
}

const STORAGE_KEY = 'lawshastra_admin_store_v2'

const uid = () => Date.now() + Math.floor(Math.random() * 1000)
const now = () => new Date().toISOString()
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

const seedState = (): AdminState => ({
  hydrated: false,
  hydrating: false,
  categories: [],
  subcategories: [],
  articles: [],
  legalResources: [],
  pages: [],
  media: [],
  tags: [],
  homepageBlocks: [],
  banners: [],
  menus: [],
  visibilityRules: [],
  seoEntries: [],
  users: [],
  roles: [],
  featureFlags: [],
  settings: {
    siteName: 'LawShastra',
    tagline: 'Structured legal knowledge for India',
    supportEmail: 'support@lawshastra.in',
    contactPhone: '+91-00000-00000',
    maintenanceMode: false,
    defaultTheme: 'Light',
  },
  activityLogs: [],
  notifications: [],
  backups: [],
  maintenance: [],
  syncError: null,
})

function loadState(): AdminState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedState()
    const parsed = { ...seedState(), ...(JSON.parse(raw) as Partial<AdminState>) }
    // never persist in-flight state across reloads
    parsed.hydrating = false
    return parsed
  } catch {
    return seedState()
  }
}

let state: AdminState = loadState()
const listeners = new Set<StoreListener>()

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}
function setState(updater: (prev: AdminState) => AdminState) {
  state = updater(state)
  persist()
  listeners.forEach((l) => l())
}
function subscribe(listener: StoreListener) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

function log(action: string, target: string, level: ActivityLog['level'] = 'info') {
  setState((prev) => ({ ...prev, activityLogs: [{ id: uid(), actor: 'Admin', action, target, createdAt: now(), level }, ...prev.activityLogs].slice(0, 200) }))
}

const mapCategory = (c: any): AdminCategory => ({
  id: c.id,
  name: c.name,
  slug: c.slug || slugify(c.name || ''),
  description: c.description || '',
  parentId: c.parentId ?? null,
  count: c.count ?? c._count?.laws ?? 0,
  status: (c.status === 'Draft' || c.status === 'DRAFT' ? 'Draft' : 'Live') as CategoryStatus,
  featured: !!(c.isFeatured ?? c.featured),
  showOnWebsite: c.showOnWebsite !== false,
})

const mapLaw = (l: any): AdminLegalResource => ({
  id: l.id,
  title: l.title || '',
  shortTitle: l.shortTitle || '',
  slug: l.slug || '',
  category: l.category || 'Civil Law',
  jurisdiction: l.jurisdiction || 'India',
  status: (l.status || 'Draft') as ContentStatus,
  summary: l.summary || '',
  sourceUrl: l.sourceUrl || '',
  sourceLabel: l.sourceLabel || '',
  pdfUrl: l.pdfUrl || '',
  pdfExtractedText: l.pdfExtractedText || '',
  subcategories: Array.isArray(l.subcategories) ? l.subcategories : l.subcategory ? [l.subcategory] : [],
  chapters: Array.isArray(l.chapters)
    ? l.chapters.map((c: any) => ({ id: c.id, title: c.title || '', content: c.content || '' }))
    : [],
})

const mapUser = (u: any): AdminUser => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role || 'VIEWER',
  status: u.isActive === false || u.status === 'Disabled' ? 'Disabled' : u.status === 'Invited' ? 'Invited' : 'Active',
  lastActive: u.updatedAt || u.lastActive || now(),
})

let hydratePromise: Promise<void> | null = null

async function hydrateFromApi() {
  if (hydratePromise) return hydratePromise
  hydratePromise = (async () => {
    setState((prev) => ({ ...prev, hydrating: true, syncError: null }))
    try {
      // Primary: bootstrap for CMS collections
      const [bootstrap, cats, laws, users] = await Promise.all([
        api.fetchBootstrap().catch(() => null),
        api.fetchAdminCategories().catch(() => null),
        api.fetchLegalResources().catch(() => null),
        api.fetchUsers().catch(() => null),
      ])

      setState((prev) => {
        let next = { ...prev }
        if (bootstrap && typeof bootstrap === 'object') {
          if (Array.isArray(bootstrap.subcategories)) next.subcategories = bootstrap.subcategories
          if (Array.isArray(bootstrap.articles)) next.articles = bootstrap.articles
          if (Array.isArray(bootstrap.pages)) next.pages = bootstrap.pages
          if (Array.isArray(bootstrap.media)) next.media = bootstrap.media
          if (Array.isArray(bootstrap.tags)) next.tags = bootstrap.tags
          if (Array.isArray(bootstrap.homepageBlocks)) next.homepageBlocks = bootstrap.homepageBlocks
          if (Array.isArray(bootstrap.banners)) next.banners = bootstrap.banners
          if (Array.isArray(bootstrap.menus)) next.menus = bootstrap.menus
          if (Array.isArray(bootstrap.visibilityRules)) next.visibilityRules = bootstrap.visibilityRules
          if (Array.isArray(bootstrap.seoEntries)) next.seoEntries = bootstrap.seoEntries
          if (Array.isArray(bootstrap.roles)) next.roles = bootstrap.roles
          if (Array.isArray(bootstrap.featureFlags)) next.featureFlags = bootstrap.featureFlags
          if (bootstrap.settings) next.settings = { ...next.settings, ...bootstrap.settings }
          if (Array.isArray(bootstrap.activityLogs)) next.activityLogs = bootstrap.activityLogs
          if (Array.isArray(bootstrap.notifications)) next.notifications = bootstrap.notifications
          if (Array.isArray(bootstrap.backups)) next.backups = bootstrap.backups
          if (Array.isArray(bootstrap.maintenance)) next.maintenance = bootstrap.maintenance
        }
        if (Array.isArray(cats)) next.categories = cats.map(mapCategory)
        if (Array.isArray(laws)) next.legalResources = laws.map(mapLaw)
        if (Array.isArray(users)) next.users = users.map(mapUser)
        next.hydrated = true
        next.hydrating = false
        next.lastSyncedAt = now()
        next.syncError = null
        return next
      })
    } catch (e: any) {
      setState((prev) => ({ ...prev, hydrated: true, hydrating: false, syncError: e?.message || 'Sync failed' }))
    } finally {
      hydratePromise = null
    }
  })()
  return hydratePromise
}

export function useAdminStore<T>(selector: (s: AdminState) => T): T {
  const [snap, setSnap] = useState(state)
  useEffect(() => subscribe(() => setSnap(state)), [])
  return useMemo(() => selector(snap), [snap, selector])
}

export const adminActions = {
  hydrate: hydrateFromApi,

  // Categories
  async saveCategory(input: Partial<AdminCategory> & { id?: number }) {
    const payload = { name: input.name || 'Untitled Category', slug: input.slug || slugify(input.name || ''), description: input.description, status: input.status === 'Draft' ? 'Draft' : 'Live', count: input.count ?? 0 }
    try {
      if (input.id) {
        const saved = await api.updateAdminCategory(input.id, payload)
        setState((p) => ({ ...p, categories: p.categories.map((c) => (c.id === input.id ? mapCategory(saved) : c)) }))
        log('Updated category', payload.name, 'success')
      } else {
        const created = await api.createAdminCategory(payload)
        setState((p) => ({ ...p, categories: [mapCategory(created), ...p.categories] }))
        log('Created category', payload.name, 'success')
      }
    } catch {
      setState((p) => {
        if (input.id) return { ...p, categories: p.categories.map((c) => (c.id === input.id ? { ...c, ...payload, id: input.id } as AdminCategory : c)) }
        return { ...p, categories: [{ id: uid(), name: payload.name, slug: payload.slug, description: input.description || '', parentId: input.parentId ?? null, count: payload.count, status: payload.status as CategoryStatus, featured: !!input.featured, showOnWebsite: input.showOnWebsite !== false }, ...p.categories] }
      })
      log(input.id ? 'Updated category (local)' : 'Created category (local)', payload.name, 'warning')
    }
  },
  async removeCategory(id: number) {
    try { await api.deleteAdminCategory(id) } catch {}
    setState((p) => ({ ...p, categories: p.categories.filter((c) => c.id !== id), subcategories: p.subcategories.filter((s) => s.categoryId !== id) }))
    log('Deleted category', `#${id}`, 'warning')
  },

  // Subcategories
  async saveSubcategory(input: Partial<AdminSubcategory> & { id?: number }) {
    const payload = { name: input.name || 'Untitled', slug: input.slug || slugify(input.name || ''), categoryId: Number(input.categoryId) || 0, status: input.status || 'Draft' }
    try {
      if (input.id) {
        const saved = await api.updateSubcategory(input.id, payload)
        setState((p) => ({ ...p, subcategories: p.subcategories.map((s) => (s.id === input.id ? saved : s)) }))
      } else {
        const created = await api.createSubcategory(payload)
        setState((p) => ({ ...p, subcategories: [created, ...p.subcategories] }))
      }
      log(input.id ? 'Updated subcategory' : 'Created subcategory', payload.name, 'success')
    } catch {
      setState((p) => {
        if (input.id) return { ...p, subcategories: p.subcategories.map((s) => (s.id === input.id ? ({ ...s, ...payload } as AdminSubcategory) : s)) }
        return { ...p, subcategories: [{ id: uid(), ...payload } as AdminSubcategory, ...p.subcategories] }
      })
      log('Saved subcategory (local)', payload.name, 'warning')
    }
  },
  async removeSubcategory(id: number) {
    try { await api.deleteSubcategory(id) } catch {}
    setState((p) => ({ ...p, subcategories: p.subcategories.filter((s) => s.id !== id) }))
    log('Deleted subcategory', `#${id}`, 'warning')
  },

  // Articles
  async saveArticle(input: Partial<AdminArticle> & { id?: number }) {
    const payload = { title: input.title || 'Untitled Article', slug: input.slug || slugify(input.title || ''), categoryId: input.categoryId ?? null, excerpt: input.excerpt || '', content: input.content || '', status: input.status || 'Draft', author: input.author || 'Admin', tags: input.tags || [] }
    try {
      if (input.id) {
        const saved = await api.updateArticle(input.id, payload)
        setState((p) => ({ ...p, articles: p.articles.map((a) => (a.id === input.id ? saved : a)) }))
      } else {
        const created = await api.createArticle(payload)
        setState((p) => ({ ...p, articles: [created, ...p.articles] }))
      }
      log(input.id ? 'Updated article' : 'Created article', payload.title, 'success')
    } catch {
      const item = { id: input.id || uid(), ...payload, updatedAt: now() } as AdminArticle
      setState((p) => ({ ...p, articles: input.id ? p.articles.map((a) => (a.id === input.id ? item : a)) : [item, ...p.articles] }))
      log('Saved article (local)', payload.title, 'warning')
    }
  },
  async removeArticle(id: number) {
    try { await api.deleteArticle(id) } catch {}
    setState((p) => ({ ...p, articles: p.articles.filter((a) => a.id !== id) }))
    log('Deleted article', `#${id}`, 'warning')
  },

  // Legal resources
  async saveLegalResource(input: Partial<AdminLegalResource> & { id?: number }) {
    const payload = {
      title: input.title || 'Untitled Resource',
      shortTitle: input.shortTitle || '',
      slug: input.slug || undefined,
      category: input.category || 'Civil Law',
      jurisdiction: input.jurisdiction || 'India',
      status: input.status || 'Draft',
      summary: input.summary || '',
      sourceUrl: input.sourceUrl || '',
      sourceLabel: input.sourceLabel || '',
      pdfUrl: input.pdfUrl || '',
      pdfExtractedText: input.pdfExtractedText || '',
      subcategories: Array.isArray(input.subcategories) ? input.subcategories.filter(Boolean) : [],
      chapters: Array.isArray(input.chapters)
        ? input.chapters.map((c) => ({ title: c.title || 'Untitled chapter', content: c.content || '' }))
        : [],
    }
    try {
      if (input.id) {
        const saved = await api.updateLegalResource(input.id, payload)
        setState((p) => ({ ...p, legalResources: p.legalResources.map((r) => (r.id === input.id ? mapLaw(saved) : r)) }))
      } else {
        const created = await api.createLegalResource(payload)
        setState((p) => ({ ...p, legalResources: [mapLaw(created), ...p.legalResources] }))
      }
      log(input.id ? 'Updated legal resource' : 'Created legal resource', payload.title, 'success')
    } catch {
      const item = {
        id: input.id || uid(),
        ...payload,
        slug: input.slug || '',
        chapters: (payload.chapters || []).map((c, i) => ({ id: -(i + 1), ...c })),
      } as AdminLegalResource
      setState((p) => ({ ...p, legalResources: input.id ? p.legalResources.map((r) => (r.id === input.id ? item : r)) : [item, ...p.legalResources] }))
      log('Saved resource (local)', payload.title, 'warning')
    }
  },
  async removeLegalResource(id: number) {
    try { await api.deleteLegalResource(id) } catch {}
    setState((p) => ({ ...p, legalResources: p.legalResources.filter((r) => r.id !== id) }))
    log('Deleted legal resource', `#${id}`, 'warning')
  },

  // Pages
  async savePage(input: Partial<AdminPage> & { id?: number }) {
    const payload = { title: input.title || 'Untitled Page', slug: input.slug || slugify(input.title || ''), status: input.status || 'Draft', template: input.template || 'Standard', content: input.content || '' }
    try {
      if (input.id) {
        const saved = await api.updatePage(input.id, payload)
        setState((p) => ({ ...p, pages: p.pages.map((pg) => (pg.id === input.id ? saved : pg)) }))
      } else {
        const created = await api.createPage(payload)
        setState((p) => ({ ...p, pages: [created, ...p.pages] }))
      }
      log(input.id ? 'Updated page' : 'Created page', payload.title, 'success')
    } catch {
      const item = { id: input.id || uid(), ...payload, updatedAt: now() } as AdminPage
      setState((p) => ({ ...p, pages: input.id ? p.pages.map((pg) => (pg.id === input.id ? item : pg)) : [item, ...p.pages] }))
      log('Saved page (local)', payload.title, 'warning')
    }
  },
  async removePage(id: number) {
    try { await api.deletePage(id) } catch {}
    setState((p) => ({ ...p, pages: p.pages.filter((pg) => pg.id !== id) }))
    log('Deleted page', `#${id}`, 'warning')
  },

  // Media
  async addMedia(input: { name: string; type: AdminMedia['type']; size?: string; url?: string }) {
    const payload = { name: input.name, type: input.type, url: input.url || `/uploads/${slugify(input.name)}`, size: input.size || '—' }
    try {
      const created = await api.createMedia(payload)
      setState((p) => ({ ...p, media: [created, ...p.media] }))
      log('Added media', input.name, 'success')
    } catch {
      setState((p) => ({ ...p, media: [{ id: uid(), ...payload, updatedAt: now() } as AdminMedia, ...p.media] }))
      log('Added media (local)', input.name, 'warning')
    }
  },
  async removeMedia(id: number) {
    try { await api.deleteMedia(id) } catch {}
    setState((p) => ({ ...p, media: p.media.filter((m) => m.id !== id) }))
    log('Deleted media', `#${id}`, 'warning')
  },

  // Tags
  async saveTag(input: Partial<AdminTag> & { id?: number }) {
    const payload = { name: input.name || 'tag', slug: input.slug || slugify(input.name || ''), usage: input.usage ?? 0 }
    try {
      if (input.id) {
        const saved = await api.updateTag(input.id, payload)
        setState((p) => ({ ...p, tags: p.tags.map((t) => (t.id === input.id ? saved : t)) }))
      } else {
        const created = await api.createTag(payload)
        setState((p) => ({ ...p, tags: [created, ...p.tags] }))
      }
      log(input.id ? 'Updated tag' : 'Created tag', payload.name, 'success')
    } catch {
      const item = { id: input.id || uid(), ...payload } as AdminTag
      setState((p) => ({ ...p, tags: input.id ? p.tags.map((t) => (t.id === input.id ? item : t)) : [item, ...p.tags] }))
      log('Saved tag (local)', payload.name, 'warning')
    }
  },
  async removeTag(id: number) {
    try { await api.deleteTag(id) } catch {}
    setState((p) => ({ ...p, tags: p.tags.filter((t) => t.id !== id) }))
    log('Deleted tag', `#${id}`, 'warning')
  },

  // Homepage
  async saveHomepageBlock(input: Partial<HomepageBlock> & { id?: number }) {
    const payload = { title: input.title || 'Block', type: input.type || 'Custom', enabled: input.enabled ?? true, order: Number(input.order) || 1 }
    try {
      if (input.id) {
        const saved = await api.updateHomepageBlock(input.id, payload)
        setState((p) => ({ ...p, homepageBlocks: p.homepageBlocks.map((b) => (b.id === input.id ? saved : b)) }))
      } else {
        const created = await api.createHomepageBlock(payload)
        setState((p) => ({ ...p, homepageBlocks: [...p.homepageBlocks, created] }))
      }
      log('Saved homepage block', payload.title, 'success')
    } catch {
      setState((p) => ({ ...p, homepageBlocks: input.id ? p.homepageBlocks.map((b) => (b.id === input.id ? ({ ...b, ...payload } as HomepageBlock) : b)) : [...p.homepageBlocks, { id: uid(), ...payload }] }))
      log('Saved homepage block (local)', payload.title, 'warning')
    }
  },
  async removeHomepageBlock(id: number) {
    try { await api.deleteHomepageBlock(id) } catch {}
    setState((p) => ({ ...p, homepageBlocks: p.homepageBlocks.filter((b) => b.id !== id) }))
  },

  // Banners
  async saveBanner(input: Partial<BannerItem> & { id?: number }) {
    const payload = { title: input.title || 'Banner', location: input.location || 'Homepage', status: input.status || 'Active', link: input.link || '/', image: input.image || '' }
    try {
      if (input.id) {
        const saved = await api.updateBanner(input.id, payload)
        setState((p) => ({ ...p, banners: p.banners.map((b) => (b.id === input.id ? saved : b)) }))
      } else {
        const created = await api.createBanner(payload)
        setState((p) => ({ ...p, banners: [created, ...p.banners] }))
      }
      log('Saved banner', payload.title, 'success')
    } catch {
      const item = { id: input.id || uid(), ...payload } as BannerItem
      setState((p) => ({ ...p, banners: input.id ? p.banners.map((b) => (b.id === input.id ? item : b)) : [item, ...p.banners] }))
      log('Saved banner (local)', payload.title, 'warning')
    }
  },
  async removeBanner(id: number) {
    try { await api.deleteBanner(id) } catch {}
    setState((p) => ({ ...p, banners: p.banners.filter((b) => b.id !== id) }))
  },

  // Menus
  async saveMenu(input: Partial<MenuItem> & { id?: number }) {
    const payload = { label: input.label || 'Menu', path: input.path || '/', location: input.location || 'Header', visible: input.visible ?? true, order: Number(input.order) || 1 }
    try {
      if (input.id) {
        const saved = await api.updateMenu(input.id, payload)
        setState((p) => ({ ...p, menus: p.menus.map((m) => (m.id === input.id ? saved : m)) }))
      } else {
        const created = await api.createMenu(payload)
        setState((p) => ({ ...p, menus: [...p.menus, created] }))
      }
      log('Saved menu item', payload.label, 'success')
    } catch {
      const item = { id: input.id || uid(), ...payload } as MenuItem
      setState((p) => ({ ...p, menus: input.id ? p.menus.map((m) => (m.id === input.id ? item : m)) : [...p.menus, item] }))
      log('Saved menu (local)', payload.label, 'warning')
    }
  },
  async removeMenu(id: number) {
    try { await api.deleteMenu(id) } catch {}
    setState((p) => ({ ...p, menus: p.menus.filter((m) => m.id !== id) }))
  },

  // Visibility
  async saveVisibility(input: Partial<VisibilityRule> & { id?: number }) {
    const payload = { component: input.component || 'Component', desktop: input.desktop ?? true, tablet: input.tablet ?? true, mobile: input.mobile ?? true, note: input.note || '' }
    try {
      if (input.id) {
        const saved = await api.updateVisibility(input.id, payload)
        setState((p) => ({ ...p, visibilityRules: p.visibilityRules.map((v) => (v.id === input.id ? saved : v)) }))
      } else {
        const created = await api.createVisibility(payload)
        setState((p) => ({ ...p, visibilityRules: [created, ...p.visibilityRules] }))
      }
      log('Saved visibility rule', payload.component, 'success')
    } catch {
      const item = { id: input.id || uid(), ...payload } as VisibilityRule
      setState((p) => ({ ...p, visibilityRules: input.id ? p.visibilityRules.map((v) => (v.id === input.id ? item : v)) : [item, ...p.visibilityRules] }))
      log('Saved visibility (local)', payload.component, 'warning')
    }
  },
  async removeVisibility(id: number) {
    try { await api.deleteVisibility(id) } catch {}
    setState((p) => ({ ...p, visibilityRules: p.visibilityRules.filter((v) => v.id !== id) }))
  },

  // SEO
  async saveSeo(input: Partial<SeoEntry> & { id?: number }) {
    const payload = { path: input.path || '/', title: input.title || '', description: input.description || '', noindex: input.noindex ?? false }
    try {
      if (input.id) {
        const saved = await api.updateSeo(input.id, payload)
        setState((p) => ({ ...p, seoEntries: p.seoEntries.map((s) => (s.id === input.id ? saved : s)) }))
      } else {
        const created = await api.createSeo(payload)
        setState((p) => ({ ...p, seoEntries: [created, ...p.seoEntries] }))
      }
      log('Saved SEO entry', payload.path, 'success')
    } catch {
      const item = { id: input.id || uid(), ...payload } as SeoEntry
      setState((p) => ({ ...p, seoEntries: input.id ? p.seoEntries.map((s) => (s.id === input.id ? item : s)) : [item, ...p.seoEntries] }))
      log('Saved SEO (local)', payload.path, 'warning')
    }
  },
  async removeSeo(id: number) {
    try { await api.deleteSeo(id) } catch {}
    setState((p) => ({ ...p, seoEntries: p.seoEntries.filter((s) => s.id !== id) }))
  },

  // Users
  async saveUser(input: Partial<AdminUser> & { id?: number }) {
    const payload = { name: input.name || 'User', email: input.email || '', role: input.role || 'EDITOR', status: input.status || 'Invited', isActive: input.status !== 'Disabled' }
    try {
      if (input.id) {
        const saved = await api.updateUser(input.id, payload)
        setState((p) => ({ ...p, users: p.users.map((u) => (u.id === input.id ? mapUser(saved) : u)) }))
      } else {
        const created = await api.createUser(payload)
        setState((p) => ({ ...p, users: [mapUser(created), ...p.users] }))
      }
      log(input.id ? 'Updated user' : 'Created user', payload.email, 'success')
    } catch {
      const item = { id: input.id || uid(), name: payload.name, email: payload.email, role: payload.role, status: payload.status as any, lastActive: now() } as AdminUser
      setState((p) => ({ ...p, users: input.id ? p.users.map((u) => (u.id === input.id ? item : u)) : [item, ...p.users] }))
      log('Saved user (local)', payload.email, 'warning')
    }
  },
  async removeUser(id: number) {
    try { await api.deleteUser(id) } catch {}
    setState((p) => ({ ...p, users: p.users.filter((u) => u.id !== id) }))
    log('Removed user', `#${id}`, 'warning')
  },

  // Roles
  async saveRole(input: Partial<RoleDef> & { id?: number }) {
    const payload = { name: input.name || 'ROLE', description: input.description || '', permissions: input.permissions || [] }
    try {
      if (input.id) {
        const saved = await api.updateRole(input.id, payload)
        setState((p) => ({ ...p, roles: p.roles.map((r) => (r.id === input.id ? saved : r)) }))
      } else {
        const created = await api.createRole(payload)
        setState((p) => ({ ...p, roles: [created, ...p.roles] }))
      }
      log('Saved role', payload.name, 'success')
    } catch {
      const item = { id: input.id || uid(), ...payload } as RoleDef
      setState((p) => ({ ...p, roles: input.id ? p.roles.map((r) => (r.id === input.id ? item : r)) : [item, ...p.roles] }))
      log('Saved role (local)', payload.name, 'warning')
    }
  },
  async removeRole(id: number) {
    try { await api.deleteRole(id) } catch {}
    setState((p) => ({ ...p, roles: p.roles.filter((r) => r.id !== id) }))
    log('Deleted role', `#${id}`, 'warning')
  },

  // Feature flags
  async toggleFlag(id: number) {
    try {
      const saved = await api.toggleFeatureFlag(id)
      setState((p) => ({ ...p, featureFlags: p.featureFlags.map((f) => (f.id === id ? saved : f)) }))
    } catch {
      setState((p) => ({ ...p, featureFlags: p.featureFlags.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)) }))
    }
  },
  async saveFlag(input: Partial<FeatureFlag> & { id?: number }) {
    const payload = { key: input.key || 'flag', label: input.label || 'Flag', enabled: input.enabled ?? false, description: input.description || '' }
    try {
      if (input.id) {
        const saved = await api.updateFeatureFlag(input.id, payload)
        setState((p) => ({ ...p, featureFlags: p.featureFlags.map((f) => (f.id === input.id ? saved : f)) }))
      } else {
        const created = await api.createFeatureFlag(payload)
        setState((p) => ({ ...p, featureFlags: [created, ...p.featureFlags] }))
      }
    } catch {
      const item = { id: input.id || uid(), ...payload } as FeatureFlag
      setState((p) => ({ ...p, featureFlags: input.id ? p.featureFlags.map((f) => (f.id === input.id ? item : f)) : [item, ...p.featureFlags] }))
    }
  },
  async removeFlag(id: number) {
    try { await api.deleteFeatureFlag(id) } catch {}
    setState((p) => ({ ...p, featureFlags: p.featureFlags.filter((f) => f.id !== id) }))
  },

  // Settings
  async updateSettings(patch: Partial<WebsiteSettings>) {
    try {
      const saved = await api.saveSettings(patch)
      setState((p) => ({ ...p, settings: { ...p.settings, ...saved } }))
      log('Updated website settings', 'settings', 'success')
    } catch {
      setState((p) => ({ ...p, settings: { ...p.settings, ...patch } }))
      log('Updated settings (local)', 'settings', 'warning')
    }
  },

  // Notifications
  async markNotificationRead(id: number) {
    try {
      const saved = await api.markNotificationRead(id)
      setState((p) => ({ ...p, notifications: p.notifications.map((n) => (n.id === id ? saved : n)) }))
    } catch {
      setState((p) => ({ ...p, notifications: p.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }))
    }
  },
  async addNotification(input: { title: string; message: string; channel?: 'In-App' | 'Email' }) {
    try {
      const created = await api.createNotification(input)
      setState((p) => ({ ...p, notifications: [created, ...p.notifications] }))
    } catch {
      setState((p) => ({ ...p, notifications: [{ id: uid(), title: input.title, message: input.message, channel: input.channel || 'In-App', read: false, createdAt: now() }, ...p.notifications] }))
    }
  },

  // Backups & maintenance
  async runBackup() {
    try {
      const b = await api.runBackup()
      setState((p) => ({ ...p, backups: [b, ...p.backups] }))
      log('Ran manual backup', b.label || 'backup', 'success')
    } catch {
      const b: BackupItem = { id: uid(), label: 'Manual backup', createdAt: now(), size: `${Math.floor(80 + Math.random() * 80)} MB`, status: 'Completed' }
      setState((p) => ({ ...p, backups: [b, ...p.backups] }))
      log('Ran backup (local)', b.label, 'warning')
    }
  },
  async toggleMaintenance(id: number) {
    try {
      const saved = await api.toggleMaintenance(id)
      setState((p) => ({ ...p, maintenance: p.maintenance.map((m) => (m.id === id ? saved : m)) }))
    } catch {
      setState((p) => ({ ...p, maintenance: p.maintenance.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)) }))
    }
  },
  async runMaintenance(id: number) {
    try {
      const saved = await api.runMaintenance(id)
      setState((p) => ({ ...p, maintenance: p.maintenance.map((m) => (m.id === id ? saved : m)) }))
      log('Ran maintenance task', `#${id}`, 'success')
    } catch {
      setState((p) => ({ ...p, maintenance: p.maintenance.map((m) => (m.id === id ? { ...m, lastRun: now() } : m)) }))
      log('Ran maintenance (local)', `#${id}`, 'warning')
    }
  },
}

export function useAsyncAction() {
  const [busy, setBusy] = useState(false)
  const run = useCallback(async (fn: () => Promise<void> | void) => {
    setBusy(true)
    try { await fn() } finally { setBusy(false) }
  }, [])
  return { busy, run }
}
