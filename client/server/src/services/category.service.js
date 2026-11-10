import { prisma } from '../config/database.js'

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'category'

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { id: 'asc' },
    include: {
      _count: {
        select: { laws: true },
      },
    },
  })

  return categories.map((category) => ({
    ...category,
    count: category._count.laws,
    status: category.status === 'LIVE' ? 'Live' : 'Draft',
  }))
}

export const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
    include: {
      _count: { select: { laws: true } },
      laws: {
        include: {
          category: true,
          subcategories: true,
          chapters: true,
        },
      },
    },
  })

  if (!category) {
    return null
  }

  return {
    ...category,
    count: category._count.laws,
    status: category.status === 'LIVE' ? 'Live' : 'Draft',
  }
}

export const createCategory = async (payload = {}) => {
  const name = payload.name || 'New Category'
  const slug = slugify(payload.slug || name)

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description: payload.description || `${name} legal resource library`,
      status: payload.status === 'Draft' ? 'DRAFT' : 'LIVE',
    },
  })

  return {
    ...category,
    count: 0,
    status: category.status === 'LIVE' ? 'Live' : 'Draft',
  }
}

export const updateCategory = async (id, payload = {}) => {
  const existing = await prisma.category.findUnique({ where: { id: Number(id) } })

  if (!existing) {
    throw new Error('Category not found')
  }

  const category = await prisma.category.update({
    where: { id: Number(id) },
    data: {
      name: payload.name || existing.name,
      slug: payload.slug ? slugify(payload.slug) : existing.slug,
      description: payload.description || existing.description,
      status: payload.status === 'Draft' ? 'DRAFT' : 'LIVE',
    },
  })

  return {
    ...category,
    count: await prisma.law.count({ where: { categoryId: category.id } }),
    status: category.status === 'LIVE' ? 'Live' : 'Draft',
  }
}

export const deleteCategory = async (id) => {
  await prisma.category.delete({ where: { id: Number(id) } })
  return true
}
