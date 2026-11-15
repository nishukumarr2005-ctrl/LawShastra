import { sendSuccess } from '../../utils/response.js'
import { getAllCategories } from '../../services/category.service.js'
import { getAllLaws } from '../../services/law.service.js'
import { cms } from '../../services/admin/cms.service.js'

const toSlug = (v = '') =>
  String(v)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const getPublicCatalog = async (req, res, next) => {
  try {
    const [categoriesRaw, lawsRaw] = await Promise.all([getAllCategories(), getAllLaws()])
    const cmsData = cms.getAll()

    const categories = (categoriesRaw || [])
      .filter((c) => c.status === 'Live' || c.status === 'LIVE')
      .map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug || toSlug(c.name),
        description: c.description || '',
        icon: c.icon || '??',
        count: c.count ?? c._count?.laws ?? 0,
        status: 'Live',
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    const subcategories = (cmsData.subcategories || [])
      .filter((s) => String(s.status || '').toLowerCase() === 'published')
      .map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug || toSlug(s.name),
        categoryId: Number(s.categoryId) || 0,
        status: s.status,
      }))

    const laws = (lawsRaw || [])
      .filter((l) => (l.status || '').toLowerCase() === 'published')
      .map((l) => ({
        id: l.id,
        title: l.title,
        slug: l.slug || toSlug(l.title),
        category: l.category || '',
        subcategories: Array.isArray(l.subcategories) ? l.subcategories : [],
        jurisdiction: l.jurisdiction || 'India',
        summary: l.summary || '',
        status: l.status,
      }))

    return sendSuccess(res, 'Public catalog fetched', { categories, subcategories, laws })
  } catch (error) {
    return next(error)
  }
}

export const getPublicCms = async (req, res, next) => {
  try {
    const data = cms.getAll()
    const isPublished = (v) => String(v || '').toLowerCase() === 'published'
    const isActive = (v) => String(v || '').toLowerCase() === 'active'

    const publicData = {
      settings: data.settings || {},
      homepageBlocks: (data.homepageBlocks || []).filter((b) => b.enabled !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      banners: (data.banners || []).filter((b) => isActive(b.status) || isPublished(b.status)),
      menus: (data.menus || []).filter((m) => m.visible !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      pages: (data.pages || []).filter((p) => isPublished(p.status)),
      articles: (data.articles || []).filter((a) => isPublished(a.status)),
      seoEntries: data.seoEntries || [],
    }

    return sendSuccess(res, 'Public CMS fetched', publicData)
  } catch (error) {
    return next(error)
  }
}