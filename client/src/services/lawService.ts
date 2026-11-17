import { apiRequest } from './apiClient'

export type LawChapterItem = { id?: number; title: string; content: string }

export type LawApiItem = {
  id: number
  title: string
  shortTitle?: string
  category: string
  subcategory: string
  subcategoryShortName?: string
  subcategories: string[]
  chapters: LawChapterItem[]
  jurisdiction: string
  status: 'Published' | 'Review' | 'Draft'
  summary: string
  sourceUrl?: string
  sourceLabel?: string
  pdfUrl: string
  pdfExtractedText: string
  slug?: string
}

export type CategoryApiItem = {
  id: number
  name: string
  slug: string
  count: number
  status: 'Live' | 'Draft'
}

export type CourseApiItem = {
  id: number
  title: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  status: 'Published' | 'Draft'
}

export type CreateLawPayload = {
  title: string
  shortTitle?: string
  slug?: string
  category?: string
  subcategory?: string
  subcategoryShortName?: string
  subcategories?: string[]
  chapters?: Array<{ title: string; content: string }>
  jurisdiction?: string
  status?: 'Published' | 'Review' | 'Draft'
  summary?: string
  sourceUrl?: string
  sourceLabel?: string
  pdfUrl?: string
  pdfExtractedText?: string
}

export type PublicSubcategory = {
  id: number
  name: string
  slug: string
  categoryId: number
  status?: string
}

export type PublicCatalog = {
  categories: Array<CategoryApiItem & { description?: string; icon?: string }>
  subcategories: PublicSubcategory[]
  laws: Array<LawApiItem & { slug?: string }>
}

export type PublicMenu = {
  id: number
  label: string
  path: string
  location: string
  visible: boolean
  order: number
}

export type PublicCms = {
  settings?: Record<string, unknown>
  homepageBlocks?: unknown[]
  banners?: unknown[]
  menus?: PublicMenu[]
  pages?: unknown[]
  articles?: unknown[]
  seoEntries?: unknown[]
}

export async function getLaws(): Promise<LawApiItem[]> {
  return apiRequest<LawApiItem[]>('/laws')
}

export async function getLawBySlug(slug: string): Promise<LawApiItem> {
  return apiRequest<LawApiItem>(`/laws/slug/${encodeURIComponent(slug)}`)
}

export async function getCategories(): Promise<CategoryApiItem[]> {
  return apiRequest<CategoryApiItem[]>('/categories')
}

export async function getCourses(): Promise<CourseApiItem[]> {
  return apiRequest<CourseApiItem[]>('/courses')
}

export async function getPublicCatalog(): Promise<PublicCatalog> {
  return apiRequest<PublicCatalog>('/public/catalog')
}

export async function getPublicCms(): Promise<PublicCms> {
  return apiRequest<PublicCms>('/public/cms')
}

export async function createLaw(payload: CreateLawPayload): Promise<LawApiItem> {
  return apiRequest<LawApiItem>('/laws', { method: 'POST', body: payload })
}

export async function updateLaw(id: number, payload: Partial<CreateLawPayload>): Promise<LawApiItem> {
  return apiRequest<LawApiItem>(`/laws/${id}`, { method: 'PUT', body: payload })
}

export async function deleteLaw(id: number): Promise<{ id: number }> {
  return apiRequest<{ id: number }>(`/laws/${id}`, { method: 'DELETE' })
}

export async function createCategory(payload: { name: string; slug?: string; count?: number; status?: 'Live' | 'Draft' }): Promise<CategoryApiItem> {
  return apiRequest<CategoryApiItem>('/categories', { method: 'POST', body: payload })
}

export async function updateCategory(id: number, payload: Partial<{ name: string; slug: string; count: number; status: 'Live' | 'Draft' }>): Promise<CategoryApiItem> {
  return apiRequest<CategoryApiItem>(`/categories/${id}`, { method: 'PUT', body: payload })
}

export async function createCourse(payload: { title: string; category?: string; level?: 'Beginner' | 'Intermediate' | 'Advanced'; duration?: string; status?: 'Published' | 'Draft' }): Promise<CourseApiItem> {
  return apiRequest<CourseApiItem>('/courses', { method: 'POST', body: payload })
}

export async function updateCourse(id: number, payload: Partial<{ title: string; category: string; level: 'Beginner' | 'Intermediate' | 'Advanced'; duration: string; status: 'Published' | 'Draft' }>): Promise<CourseApiItem> {
  return apiRequest<CourseApiItem>(`/courses/${id}`, { method: 'PUT', body: payload })
}
