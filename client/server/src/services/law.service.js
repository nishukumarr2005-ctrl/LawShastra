import { prisma } from '../config/database.js'

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'law'

const toDisplayStatus = (status) => {
  if (status === 'PUBLISHED') return 'Published'
  if (status === 'REVIEW') return 'Review'
  return 'Draft'
}

const toDbStatus = (status) => {
  if (status === 'Published') return 'PUBLISHED'
  if (status === 'Review') return 'REVIEW'
  return 'DRAFT'
}

const ensureCategory = async (categoryName) => {
  const cleanName = (categoryName || 'Civil Law').trim()
  const existing = await prisma.category.findFirst({ where: { name: cleanName } })

  if (existing) {
    return existing
  }

  return prisma.category.create({
    data: {
      name: cleanName,
      slug: slugify(cleanName),
      description: `${cleanName} legal resources`,
      status: 'LIVE',
    },
  })
}

const normalizeLaw = (law) => ({
  ...law,
  category: law.category.name,
  subcategory: law.subcategories?.[0]?.name || '',
  subcategoryShortName: law.subcategoryShortName || '',
  subcategories: law.subcategories.map((subcategory) => subcategory.name),
  chapters: law.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    content: chapter.content,
  })),
  status: toDisplayStatus(law.status),
})

export const getAllLaws = async () => {
  const laws = await prisma.law.findMany({
    orderBy: { id: 'asc' },
    include: {
      category: true,
      subcategories: { orderBy: { id: 'asc' } },
      chapters: { orderBy: { id: 'asc' } },
    },
  })

  return laws.map(normalizeLaw)
}

export const getLawById = async (id) => {
  const law = await prisma.law.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      subcategories: { orderBy: { id: 'asc' } },
      chapters: { orderBy: { id: 'asc' } },
    },
  })

  if (!law) {
    return null
  }

  return normalizeLaw(law)
}

export const getLawBySlug = async (slug) => {
  const law = await prisma.law.findUnique({
    where: { slug },
    include: {
      category: true,
      subcategories: { orderBy: { id: 'asc' } },
      chapters: { orderBy: { id: 'asc' } },
    },
  })

  if (!law) {
    return null
  }

  return normalizeLaw(law)
}

export const createLaw = async (payload = {}) => {
  const title = payload.title || 'New Legal Act'
  const categoryName = payload.category || 'Civil Law'
  const category = await ensureCategory(categoryName)

  const legalSubcategories = Array.isArray(payload.subcategories) ? payload.subcategories : payload.subcategory ? [payload.subcategory] : []
  const chapters = Array.isArray(payload.chapters) ? payload.chapters : []

  const law = await prisma.law.create({
    data: {
      title,
      slug: slugify(payload.slug || title),
      categoryId: category.id,
      subcategoryShortName: payload.subcategoryShortName || payload.subcategory || '',
      jurisdiction: payload.jurisdiction || 'India',
      summary: payload.summary || '',
      status: toDbStatus(payload.status || 'Draft'),
      pdfUrl: payload.pdfUrl || null,
      pdfExtractedText: payload.pdfExtractedText || null,
      subcategories: {
        create: legalSubcategories.map((name) => ({ name })),
      },
      chapters: {
        create: chapters.map((chapter) => ({
          title: chapter.title || 'Untitled chapter',
          content: chapter.content || '',
        })),
      },
    },
    include: {
      category: true,
      subcategories: true,
      chapters: true,
    },
  })

  return normalizeLaw(law)
}

export const updateLaw = async (id, payload = {}) => {
  const existing = await prisma.law.findUnique({ where: { id: Number(id) } })

  if (!existing) {
    throw new Error('Law not found')
  }

  const categoryName = payload.category || (await prisma.category.findUnique({ where: { id: existing.categoryId } }))?.name || 'Civil Law'
  const category = await ensureCategory(categoryName)

  const updated = await prisma.law.update({
    where: { id: Number(id) },
    data: {
      title: payload.title || existing.title,
      slug: payload.slug ? slugify(payload.slug) : existing.slug,
      categoryId: category ? category.id : existing.categoryId,
      subcategoryShortName: payload.subcategoryShortName ?? payload.subcategory ?? existing.subcategoryShortName ?? '',
      jurisdiction: payload.jurisdiction || existing.jurisdiction,
      summary: payload.summary || existing.summary,
      status: payload.status ? toDbStatus(payload.status) : existing.status,
      pdfUrl: payload.pdfUrl ?? existing.pdfUrl,
      pdfExtractedText: payload.pdfExtractedText ?? existing.pdfExtractedText,
    },
    include: {
      category: true,
      subcategories: true,
      chapters: true,
    },
  })

  const legalSubcategories = Array.isArray(payload.subcategories) ? payload.subcategories : payload.subcategory ? [payload.subcategory] : updated.subcategories.map((item) => item.name)

  if (legalSubcategories.length) {
    await prisma.subcategory.deleteMany({ where: { lawId: updated.id } })
    await prisma.subcategory.createMany({
      data: legalSubcategories.map((name) => ({ lawId: updated.id, name })),
    })
  }

  if (Array.isArray(payload.chapters)) {
    await prisma.chapter.deleteMany({ where: { lawId: updated.id } })
    await prisma.chapter.createMany({
      data: payload.chapters.map((chapter) => ({
        lawId: updated.id,
        title: chapter.title || 'Untitled chapter',
        content: chapter.content || '',
      })),
    })
  }

  return getLawById(updated.id)
}

export const deleteLaw = async (id) => {
  await prisma.law.delete({ where: { id: Number(id) } })
  return true
}
