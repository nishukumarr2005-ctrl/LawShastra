const canPersist = () => false

const uid = () => Date.now() + Math.floor(Math.random() * 1000)
const now = () => new Date().toISOString()
const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const seed = () => ({
  subcategories: [
    { id: 101, name: 'Fundamental Rights', slug: 'fundamental-rights', categoryId: 1, status: 'Published' },
    { id: 102, name: 'Directive Principles', slug: 'directive-principles', categoryId: 1, status: 'Published' },
    { id: 103, name: 'IPC Offences', slug: 'ipc-offences', categoryId: 2, status: 'Draft' },
  ],
  articles: [
    { id: 201, title: 'Understanding Article 21', slug: 'understanding-article-21', categoryId: 1, excerpt: 'Scope and interpretation of right to life.', content: '', status: 'Published', author: 'Editorial Team', tags: ['constitution', 'rights'], updatedAt: now() },
    { id: 202, title: 'Bail Provisions Overview', slug: 'bail-provisions-overview', categoryId: 2, excerpt: 'Key principles governing bail in India.', content: '', status: 'Review', author: 'Legal Desk', tags: ['criminal', 'procedure'], updatedAt: now() },
  ],
  pages: [
    { id: 401, title: 'About LawShastra', slug: 'about', status: 'Published', template: 'Standard', content: '', updatedAt: now() },
    { id: 402, title: 'Contact', slug: 'contact', status: 'Published', template: 'Contact', content: '', updatedAt: now() },
    { id: 403, title: 'Privacy Policy', slug: 'privacy-policy', status: 'Draft', template: 'Legal', content: '', updatedAt: now() },
  ],
  media: [
    { id: 501, name: 'hero-banner.jpg', type: 'Image', url: '/uploads/hero-banner.jpg', size: '420 KB', updatedAt: now() },
    { id: 502, name: 'constitution-guide.pdf', type: 'Document', url: '/uploads/constitution-guide.pdf', size: '2.1 MB', updatedAt: now() },
  ],
  tags: [
    { id: 601, name: 'constitution', slug: 'constitution', usage: 14 },
    { id: 602, name: 'bail', slug: 'bail', usage: 6 },
    { id: 603, name: 'property', slug: 'property', usage: 9 },
  ],
  homepageBlocks: [
    { id: 701, title: 'Hero Section', type: 'Hero', enabled: true, order: 1 },
    { id: 702, title: 'Featured Bare Acts', type: 'Collection', enabled: true, order: 2 },
    { id: 703, title: 'Testimonials', type: 'Testimonials', enabled: false, order: 3 },
  ],
  banners: [
    { id: 801, title: 'New BNS Explainers', location: 'Homepage Top', status: 'Active', link: '/categories/criminal-law', image: '' },
    { id: 802, title: 'Exam Prep Series', location: 'Sidebar', status: 'Scheduled', link: '/courses', image: '' },
  ],
  menus: [
    { id: 901, label: 'Home', path: '/', location: 'Header', visible: true, order: 1 },
    { id: 902, label: 'Categories', path: '/categories', location: 'Header', visible: true, order: 2 },
    { id: 903, label: 'Courses', path: '/courses', location: 'Header', visible: true, order: 3 },
    { id: 904, label: 'Privacy', path: '/privacy-policy', location: 'Footer', visible: true, order: 1 },
  ],
  visibilityRules: [
    { id: 1001, component: 'Homepage Hero', desktop: true, tablet: true, mobile: true, note: 'Primary entry point' },
    { id: 1002, component: 'Sidebar Promo', desktop: true, tablet: false, mobile: false, note: 'Desktop only' },
    { id: 1003, component: 'Sticky CTA', desktop: false, tablet: true, mobile: true, note: 'Touch devices' },
  ],
  seoEntries: [
    { id: 1101, path: '/', title: 'LawShastra - Legal Knowledge Platform', description: 'Browse bare acts, categories and legal resources.', noindex: false },
    { id: 1102, path: '/categories', title: 'Law Categories | LawShastra', description: 'Explore organized legal categories and subcategories.', noindex: false },
  ],
  roles: [
    { id: 1301, name: 'SUPER_ADMIN', description: 'Full system access', permissions: ['*'] },
    { id: 1302, name: 'ADMIN', description: 'Administrative access', permissions: ['categories.read','categories.create','categories.update','categories.delete','articles.read','articles.create','articles.update','articles.publish','articles.delete','media.upload','media.delete','users.read','settings.manage','features.manage','audit.read'] },
    { id: 1303, name: 'EDITOR', description: 'Manage content and media', permissions: ['categories.read','categories.create','categories.update','articles.read','articles.create','articles.update','media.upload'] },
    { id: 1304, name: 'VIEWER', description: 'Read-only access', permissions: ['categories.read','articles.read','audit.read'] },
  ],
  featureFlags: [
    { id: 1401, key: 'new-homepage', label: 'New Homepage', enabled: true, description: 'Enable redesigned homepage layout' },
    { id: 1402, key: 'ai-summaries', label: 'AI Summaries', enabled: false, description: 'Show AI-generated act summaries' },
  ],
  settings: {
    siteName: 'LawShastra',
    tagline: 'Structured legal knowledge for India',
    supportEmail: 'support@lawshastra.in',
    contactPhone: '+91-00000-00000',
    maintenanceMode: false,
    defaultTheme: 'Light',
  },
  activityLogs: [
    { id: 1501, actor: 'System', action: 'Seeded', target: 'CMS store', createdAt: now(), level: 'info' },
  ],
  notifications: [
    { id: 1601, title: 'Review pending', message: 'Bharatiya Nyaya Sanhita, 2023 is awaiting review.', channel: 'In-App', read: false, createdAt: now() },
    { id: 1602, title: 'Backup completed', message: 'Nightly backup completed successfully.', channel: 'In-App', read: true, createdAt: now() },
  ],
  backups: [
    { id: 1701, label: 'Nightly full backup', createdAt: now(), size: '128 MB', status: 'Completed' },
  ],
  maintenance: [
    { id: 1801, name: 'Database vacuum', schedule: 'Daily 02:00', lastRun: now(), enabled: true },
    { id: 1802, name: 'Search reindex', schedule: 'Weekly Sun 03:00', lastRun: now(), enabled: false },
  ],
})

let store = null

function load() {
  if (store) return store
  store = seed()
  return store
}

function save() {
  // in-memory only (Workers-safe)
}

export function logActivity(actor, action, target, level = 'info') {
  const s = load()
  s.activityLogs.unshift({ id: uid(), actor: actor || 'Admin', action, target, createdAt: now(), level })
  s.activityLogs = s.activityLogs.slice(0, 500)
  save()
  return s.activityLogs[0]
}

function list(key) { return load()[key] || [] }
function getById(key, id) { return list(key).find((i) => i.id === Number(id)) || null }

function create(key, data) {
  const s = load()
  const item = { id: uid(), ...data }
  s[key].unshift(item)
  save()
  return item
}

function update(key, id, data) {
  const s = load()
  const idx = s[key].findIndex((i) => i.id === Number(id))
  if (idx === -1) return null
  s[key][idx] = { ...s[key][idx], ...data, id: s[key][idx].id }
  save()
  return s[key][idx]
}

function remove(key, id) {
  const s = load()
  const before = s[key].length
  s[key] = s[key].filter((i) => i.id !== Number(id))
  save()
  return s[key].length !== before
}

export const cms = {
  slugify,
  load,
  list,
  getById,
  create,
  update,
  remove,
  logActivity,
  // bootstrap
  getAll() { return load() },
  // settings
  getSettings() { return load().settings },
  updateSettings(patch) { const s = load(); s.settings = { ...s.settings, ...(patch || {}) }; save(); return s.settings },
  // notifications
  markNotificationRead(id) { return update('notifications', id, { read: true }) },
  // backups
  runBackup() {
    const b = create('backups', { label: 'Manual backup', createdAt: now(), size: `${Math.floor(80 + Math.random() * 80)} MB`, status: 'Completed' })
    logActivity('Admin', 'Ran backup', b.label, 'success')
    return b
  },
  // maintenance
  toggleMaintenance(id) {
    const item = getById('maintenance', id); if (!item) return null
    return update('maintenance', id, { enabled: !item.enabled })
  },
  runMaintenance(id) {
    const item = getById('maintenance', id); if (!item) return null
    logActivity('Admin', 'Ran maintenance', item.name, 'success')
    return update('maintenance', id, { lastRun: now() })
  },
  // feature flags
  toggleFlag(id) {
    const item = getById('featureFlags', id); if (!item) return null
    return update('featureFlags', id, { enabled: !item.enabled })
  },
}
