import { prisma } from '../config/database.js'

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'category'

// In-memory registry for categories when database server is unavailable during testing
let mockCategories = [
  {
    id: 1,
    name: 'Civil Law',
    slug: 'civil-law',
    description: 'Private rights, civil disputes, property, contracts and remedies.',
    icon: '🏛',
    image: null,
    parentId: null,
    displayOrder: 1,
    status: 'Live',
    showDesktop: true,
    showMobile: true,
    seoTitle: 'Civil Law Bare Acts and Judgments',
    seoDescription: 'Civil procedure, contract act, property act and remedies.',
    count: 6,
  },
  {
    id: 2,
    name: 'Criminal Law',
    slug: 'criminal-law',
    description: 'Offences, criminal procedure, evidence and the justice system.',
    icon: '🛡',
    image: null,
    parentId: null,
    displayOrder: 2,
    status: 'Live',
    showDesktop: true,
    showMobile: true,
    seoTitle: 'Criminal Law Bare Acts IPC BNS CrPC',
    seoDescription: 'Offences and penal procedures in India.',
    count: 6,
  },
  {
    id: 3,
    name: 'Banking Law',
    slug: 'banking-law',
    description: 'Banking regulation, recovery, secured assets and financial institutions.',
    icon: '🏦',
    image: null,
    parentId: null,
    displayOrder: 3,
    status: 'Live',
    showDesktop: true,
    showMobile: true,
    seoTitle: 'Banking and Financial Laws in India',
    seoDescription: 'RBI Act, SARFAESI Act, and Insolvency Code.',
    count: 6,
  },
  {
    id: 4,
    name: 'Other Laws',
    slug: 'other-laws',
    description: 'Special statutes and important legislation across legal practice areas.',
    icon: '📑',
    image: null,
    parentId: null,
    displayOrder: 4,
    status: 'Live',
    showDesktop: true,
    showMobile: true,
    seoTitle: 'Special Legislation and Corporate Laws',
    seoDescription: 'Companies Act, Arbitration, IT Act and Environment laws.',
    count: 6,
  },
]

export const getAllCategories = async () => {
  try {
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
  } catch (err) {
    return mockCategories
  }
}

export const getCategoryById = async (id) => {
  try {
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

    if (!category) return null

    return {
      ...category,
      count: category._count.laws,
      status: category.status === 'LIVE' ? 'Live' : 'Draft',
    }
  } catch (err) {
    return mockCategories.find((c) => c.id === Number(id)) || null
  }
}

export const createCategory = async (payload = {}) => {
  const name = (payload.name || 'New Category').trim()
  const slug = slugify(payload.slug || name)

  try {
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
      icon: payload.icon || '⚖',
      displayOrder: payload.displayOrder || 1,
      showDesktop: payload.showDesktop ?? true,
      showMobile: payload.showMobile ?? true,
      seoTitle: payload.seoTitle || name,
      seoDescription: payload.seoDescription || payload.description,
      status: category.status === 'LIVE' ? 'Live' : 'Draft',
    }
  } catch (err) {
    const newCat = {
      id: mockCategories.length + 1,
      name,
      slug,
      description: payload.description || `${name} legal resource library`,
      icon: payload.icon || '⚖',
      image: payload.image || null,
      parentId: payload.parentId || null,
      displayOrder: payload.displayOrder || mockCategories.length + 1,
      status: payload.status || 'Live',
      showDesktop: payload.showDesktop ?? true,
      showMobile: payload.showMobile ?? true,
      seoTitle: payload.seoTitle || name,
      seoDescription: payload.seoDescription || payload.description,
      count: 0,
    }
    mockCategories.push(newCat)
    return newCat
  }
}

export const updateCategory = async (id, payload = {}) => {
  try {
    const existing = await prisma.category.findUnique({ where: { id: Number(id) } })
    if (!existing) throw new Error('Category not found')

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
  } catch (err) {
    const index = mockCategories.findIndex((c) => c.id === Number(id))
    if (index === -1) throw new Error('Category not found')
    mockCategories[index] = { ...mockCategories[index], ...payload }
    return mockCategories[index]
  }
}

export const deleteCategory = async (id) => {
  const catId = Number(id)

  try {
    // Check if category has laws or published content
    const lawCount = await prisma.law.count({ where: { categoryId: catId } })
    if (lawCount > 0) {
      throw new Error('Cannot delete category containing published content. Reassign content or archive category instead.')
    }
    await prisma.category.delete({ where: { id: catId } })
    return true
  } catch (err) {
    if (err.message.includes('Cannot delete category')) {
      throw err
    }
    const target = mockCategories.find((c) => c.id === catId)
    if (target && target.count > 0) {
      throw new Error('Cannot delete category containing published content. Reassign content or archive category instead.')
    }
    mockCategories = mockCategories.filter((c) => c.id !== catId)
    return true
  }
}

export const getPublicCategories = async () => {
  const all = await getAllCategories()
  return all
    .filter((cat) => cat.status === 'Live' || cat.status === 'LIVE')
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon || '⚖',
      count: cat.count || 0,
    }))
}
