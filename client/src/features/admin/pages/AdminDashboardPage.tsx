import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

import {
  ArrowUpRight,
  Bell,
  BookOpen,
  BookText,
  BriefcaseBusiness,
  ChevronRight,
  FileText,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  createCategory,
  createCourse,
  createLaw,
  deleteLaw,
  getCategories,
  getCourses,
  getLaws,
  updateCategory,
  updateCourse,
  updateLaw,
} from '@/services/lawService'

type NavKey = 'overview' | 'laws' | 'categories' | 'courses' | 'settings'

type ChapterRecord = {
  id: number
  title: string
  content: string
}

type LawRecord = {
  id: number
  title: string
  category: string
  subcategory: string
  subcategoryShortName: string
  subcategories: string[]
  chapters: ChapterRecord[]
  jurisdiction: string
  status: 'Published' | 'Review' | 'Draft'
  summary: string
  pdfUrl: string
  pdfExtractedText: string
  slug?: string
}

type CategoryRecord = {
  id: number
  name: string
  slug: string
  count: number
  status: 'Live' | 'Draft'
}

type CourseRecord = {
  id: number
  title: string
  category: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  status: 'Published' | 'Draft'
}

const createEmptyLaw = (): LawRecord => ({
  id: 0,
  title: '',
  category: '',
  subcategory: '',
  subcategoryShortName: '',
  subcategories: [],
  chapters: [],
  jurisdiction: 'India',
  status: 'Draft',
  summary: '',
  pdfUrl: '',
  pdfExtractedText: '',
})

const createEmptyCategory = (): CategoryRecord => ({
  id: 0,
  name: '',
  slug: '',
  count: 0,
  status: 'Draft',
})

const createEmptyCourse = (): CourseRecord => ({
  id: 0,
  title: '',
  category: '',
  level: 'Beginner',
  duration: '4 weeks',
  status: 'Draft',
})

const navItems: Array<{ key: NavKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'laws', label: 'Laws', icon: BookOpen },
  { key: 'categories', label: 'Categories', icon: BriefcaseBusiness },
  { key: 'courses', label: 'Courses', icon: GraduationCap },
  { key: 'settings', label: 'Settings', icon: Settings },
]

const quickActions = [
  { label: 'New law', key: 'laws' as const, icon: Plus },
  { label: 'Upload PDF', key: 'laws' as const, icon: UploadCloud },
  { label: 'Manage categories', key: 'categories' as const, icon: FolderKanban },
  { label: 'Settings', key: 'settings' as const, icon: Settings },
]

export const extractPdfChapters = (text: string): Array<{ title: string; content: string }> => {
  const compactText = text
    .replace(/\r/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .trim()

  if (!compactText) {
    return [{ title: 'Document overview', content: 'No text extracted from the PDF.' }]
  }

  const chapterHeadingRegex = /(CHAPTER|PART)\s+(?:NO\.?\s*)?([IVXLCDM]+|\d+)(?:\s*[-:–—.]\s*|\s+)?([A-Z0-9][A-Z0-9&/()'.,\-" ]{0,140})?/gi
  const matches = Array.from(compactText.matchAll(chapterHeadingRegex))

  if (matches.length > 0) {
    const sections: Array<{ title: string; content: string }> = []

    matches.forEach((match, index) => {
      const label = (match[1] ?? 'CHAPTER').toUpperCase()
      const number = (match[2] ?? '').trim()
      const titlePart = (match[3] ?? '').replace(/\s+/g, ' ').trim()
      const title = titlePart ? `${label} ${number}: ${titlePart}` : `${label} ${number}`
      const startIndex = (match.index ?? 0) + match[0].length
      const nextIndex = index < matches.length - 1 ? (matches[index + 1].index ?? compactText.length) : compactText.length
      const content = compactText.slice(startIndex, nextIndex).replace(/\s+/g, ' ').trim()

      if (content) {
        sections.push({ title, content })
      }
    })

    if (sections.length > 0) {
      return sections
    }
  }

  const summaryLines = compactText
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  const fallbackSections: Array<{ title: string; content: string }> = []
  let currentTitle = 'Document overview'
  let currentContent: string[] = []

  const flushCurrentSection = () => {
    const content = currentContent.join(' ').replace(/\s+/g, ' ').trim()
    if (content) {
      fallbackSections.push({ title: currentTitle, content })
    }
    currentContent = []
  }

  const headingLineRegex = /^(?:CHAPTER|PART)\s+(?:NO\.?\s*)?([IVXLCDM]+|\d+)(?:\s*[-:–—.]\s*|\s+)?(.*)$/i

  for (const line of summaryLines) {
    const headingMatch = line.match(headingLineRegex)

    if (headingMatch) {
      if (currentContent.length) {
        flushCurrentSection()
      }

      const chapterNumber = headingMatch[1]?.trim() ?? ''
      const headingTitle = (headingMatch[2] ?? '').replace(/\s+/g, ' ').trim()
      currentTitle = headingTitle ? `CHAPTER ${chapterNumber}: ${headingTitle}` : `CHAPTER ${chapterNumber}`
      continue
    }

    currentContent.push(line)
  }

  if (currentContent.length) {
    flushCurrentSection()
  }

  return fallbackSections.length > 0 ? fallbackSections : [{ title: 'Document overview', content: compactText.replace(/\s+/g, ' ').trim() }]
}

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<NavKey>('overview')
  const [laws, setLaws] = useState<LawRecord[]>([])
  const [categories, setCategories] = useState<CategoryRecord[]>([])
  const [courses, setCourses] = useState<CourseRecord[]>([])
  const [selectedLawId, setSelectedLawId] = useState<number | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(null)
  const [settings, setSettings] = useState({
    brandTheme: 'Golden legal',
    autoSync: true,
    requireReview: true,
    publicPreview: true,
  })
  const [subcategoryInput, setSubcategoryInput] = useState('')
  const [chapterTitleInput, setChapterTitleInput] = useState('')
  const [chapterContentInput, setChapterContentInput] = useState('')
  const [isExtractingPdf, setIsExtractingPdf] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPdfChapterIndex, setSelectedPdfChapterIndex] = useState(0)
  const [pdfPreviewChapter, setPdfPreviewChapter] = useState<{ title: string; content: string } | null>(null)
  const [lawFilter, setLawFilter] = useState<'All' | 'Published' | 'Review' | 'Draft'>('All')
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Live' | 'Draft'>('All')
  const [courseFilter, setCourseFilter] = useState<'All' | 'Published' | 'Draft'>('All')

  const normalizeLaw = (law: any): LawRecord => ({
    id: law.id,
    title: law.title,
    category: law.category ?? 'Civil Law',
    subcategory: law.subcategory ?? '',
    subcategoryShortName: law.subcategoryShortName ?? law.shortSubcategory ?? '',
    subcategories: Array.isArray(law.subcategories) ? law.subcategories : [law.subcategory].filter(Boolean),
    chapters: Array.isArray(law.chapters)
      ? law.chapters.map((chapter: any) => ({
          id: chapter.id,
          title: chapter.title,
          content: chapter.content,
        }))
      : [],
    jurisdiction: law.jurisdiction ?? 'India',
    status: law.status ?? 'Draft',
    summary: law.summary ?? '',
    pdfUrl: law.pdfUrl ?? '',
    pdfExtractedText: law.pdfExtractedText ?? '',
  })

  const normalizeCategory = (category: any): CategoryRecord => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    count: category.count ?? 0,
    status: category.status ?? 'Live',
  })

  const normalizeCourse = (course: any): CourseRecord => ({
    id: course.id,
    title: course.title,
    category: course.category ?? 'Civil Law',
    level: course.level ?? 'Beginner',
    duration: course.duration ?? '4 weeks',
    status: course.status ?? 'Draft',
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      setApiError(null)

      try {
        const [serverLaws, serverCategories, serverCourses] = await Promise.all([
          getLaws().catch(() => []),
          getCategories().catch(() => []),
          getCourses().catch(() => []),
        ])

        const normalizedLaws = (serverLaws as any[]).map(normalizeLaw)
        const normalizedCategories = (serverCategories as any[]).map(normalizeCategory)
        const normalizedCourses = (serverCourses as any[]).map(normalizeCourse)

        setLaws(normalizedLaws)
        setCategories(normalizedCategories)
        setCourses(normalizedCourses)

        if (normalizedLaws.length) {
          setSelectedLawId(normalizedLaws[0].id)
        } else {
          setSelectedLawId(null)
        }

        if (normalizedCategories.length) {
          setSelectedCategoryId(normalizedCategories[0].id)
        } else {
          setSelectedCategoryId(null)
        }

        if (normalizedCourses.length) {
          setSelectedCourseId(normalizedCourses[0].id)
        } else {
          setSelectedCourseId(null)
        }
      } catch (error) {
        setLaws([])
        setCategories([])
        setCourses([])
        setSelectedLawId(null)
        setSelectedCategoryId(null)
        setSelectedCourseId(null)
        setApiError(error instanceof Error ? error.message : 'Unable to load data from the backend server')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchDashboardData()
  }, [])

  const selectedLaw = useMemo(
    () => laws.find((law) => law.id === selectedLawId) ?? null,
    [laws, selectedLawId]
  )

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId]
  )

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) ?? null,
    [courses, selectedCourseId]
  )

  const categoryCatalog = useMemo(() => {
    if (!categories.length) {
      return []
    }

    const toSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

    return categories.map((category, index) => ({
      name: category.name,
      icon: ['🏛', '🛡', '🏦', '📑'][index % 4],
      description:
        category.name === 'Civil Law'
          ? 'Private rights, civil disputes, property, contracts and remedies.'
          : category.name === 'Criminal Law'
            ? 'Offences, criminal procedure, evidence and the justice system.'
            : category.name === 'Banking Law'
              ? 'Banking regulation, recovery, secured assets and financial institutions.'
              : 'Special statutes and important legislation across legal practice areas.',
      hint: 'Explore legal subjects',
      submenu: laws
        .filter((law) => law.category === category.name)
        .map((law) => ({
          label: law.title,
          slug: law.slug || toSlug(law.title),
        })),
      accent: ['bg-[#F1ECFF] text-[#5F42D9]', 'bg-[#F5F3F9] text-[#544B6E]', 'bg-[#FFF1E8] text-[#DE7D4C]', 'bg-[#EAF8EF] text-[#3E8E62]'][index % 4],
    }))
  }, [categories, laws])

  const filteredLaws = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return laws.filter((law) => {
      const matchesQuery = !query || [law.title, law.category, law.subcategory, law.subcategoryShortName, law.jurisdiction].join(' ').toLowerCase().includes(query)
      const matchesStatus = lawFilter === 'All' || law.status === lawFilter
      return matchesQuery && matchesStatus
    })
  }, [laws, lawFilter, searchTerm])

  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return categories.filter((category) => {
      const matchesQuery = !query || `${category.name} ${category.slug}`.toLowerCase().includes(query)
      const matchesStatus = categoryFilter === 'All' || category.status === categoryFilter
      return matchesQuery && matchesStatus
    })
  }, [categories, categoryFilter, searchTerm])

  const filteredCourses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return courses.filter((course) => {
      const matchesQuery = !query || `${course.title} ${course.category} ${course.level}`.toLowerCase().includes(query)
      const matchesStatus = courseFilter === 'All' || course.status === courseFilter
      return matchesQuery && matchesStatus
    })
  }, [courses, courseFilter, searchTerm])

  const getStatusTone = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-[#EAF7E8] text-[#2F8742]'
      case 'Review':
        return 'bg-[#FFF4CC] text-[#A87800]'
      case 'Live':
        return 'bg-[#EAF7E8] text-[#2F8742]'
      case 'Draft':
        return 'bg-[#F3EEFC] text-[#5F42D9]'
      default:
        return 'bg-[#EEF3FF] text-[#3B5BDB]'
    }
  }

  const [lawForm, setLawForm] = useState<LawRecord>(createEmptyLaw())
  const [categoryForm, setCategoryForm] = useState<CategoryRecord>(createEmptyCategory())
  const [courseForm, setCourseForm] = useState<CourseRecord>(createEmptyCourse())

  const dashboardBanner = apiError ? (
    <div className="mb-4 rounded-2xl border border-[#F7D0C8] bg-[#FFF4F0] px-4 py-3 text-sm text-[#8C3D2E]">
      Unable to load records from the backend server. Add content from the admin panel to populate this dashboard.
    </div>
  ) : null

  useEffect(() => {
    setLawForm(selectedLaw ?? createEmptyLaw())
  }, [selectedLaw])

  useEffect(() => {
    setCategoryForm(selectedCategory ?? createEmptyCategory())
  }, [selectedCategory])

  useEffect(() => {
    setCourseForm(selectedCourse ?? createEmptyCourse())
  }, [selectedCourse])

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpenCategoryIndex((current) => (current === index ? null : index))
    }
  }

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target?.closest('[data-admin-category-card]')) {
        setOpenCategoryIndex(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const handleCategoryMenuClick = (slug: string) => {
    if (!slug) {
      return
    }

    navigate(`/categories/${slug}`)
  }

  const handleSaveLaw = async () => {
    try {
      const payload = {
        title: lawForm.title.trim() || 'Untitled law',
        category: lawForm.category || 'Civil Law',
        subcategory: lawForm.subcategory || lawForm.subcategories[0] || '',
        subcategoryShortName: lawForm.subcategoryShortName.trim() || lawForm.subcategory.trim().split(/\s+/).map((word) => word[0]?.toUpperCase() ?? '').join('').slice(0, 8) || 'N/A',
        subcategories: lawForm.subcategories.length ? lawForm.subcategories : lawForm.subcategory ? [lawForm.subcategory] : [],
        chapters: lawForm.chapters.map((chapter) => ({
          title: chapter.title || 'Untitled chapter',
          content: chapter.content || '',
        })),
        jurisdiction: lawForm.jurisdiction || 'India',
        status: lawForm.status,
        summary: lawForm.summary,
        pdfUrl: lawForm.pdfUrl,
        pdfExtractedText: lawForm.pdfExtractedText,
      }

      if (selectedLawId) {
        const savedLaw = await updateLaw(selectedLawId, payload)
        const normalized = normalizeLaw(savedLaw)
        setLaws((current) => current.map((law) => (law.id === normalized.id ? normalized : law)))
        setSelectedLawId(normalized.id)
        setLawForm(normalized)
        return
      }

      const createdLaw = await createLaw(payload)
      const normalized = normalizeLaw(createdLaw)
      setLaws((current) => [normalized, ...current])
      setSelectedLawId(normalized.id)
      setLawForm(normalized)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to save law')
    }
  }

  const handleDeleteLaw = async () => {
    if (!selectedLawId) {
      return
    }

    const lawName = lawForm.title.trim() || 'this law'
    const confirmDelete = window.confirm(`Are you sure you want to delete "${lawName}"?`)

    if (!confirmDelete) {
      return
    }

    try {
      await deleteLaw(selectedLawId)
      setLaws((current) => current.filter((law) => law.id !== selectedLawId))
      setSelectedLawId(null)
      setLawForm(createEmptyLaw())
      setActiveTab('laws')
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to delete law')
    }
  }

  const handleAddSubcategory = () => {
    if (!subcategoryInput.trim()) {
      return
    }

    setLawForm((current) => ({
      ...current,
      subcategories: Array.from(new Set([...current.subcategories, subcategoryInput.trim()])),
      subcategory: subcategoryInput.trim(),
    }))
    setSubcategoryInput('')
  }

  const handleRemoveSubcategory = (name: string) => {
    setLawForm((current) => ({
      ...current,
      subcategories: current.subcategories.filter((item) => item !== name),
      subcategory: current.subcategories.filter((item) => item !== name)[0] ?? '',
    }))
  }

  const handleAddChapter = () => {
    if (!chapterTitleInput.trim() || !chapterContentInput.trim()) {
      return
    }

    setLawForm((current) => ({
      ...current,
      chapters: [
        ...current.chapters,
        {
          id: Date.now(),
          title: chapterTitleInput.trim(),
          content: chapterContentInput.trim(),
        },
      ],
    }))
    setChapterTitleInput('')
    setChapterContentInput('')
  }

  const handleRemoveChapter = (chapterId: number) => {
    setLawForm((current) => ({
      ...current,
      chapters: current.chapters.filter((chapter) => chapter.id !== chapterId),
    }))
  }

  const extractedPdfChapters = lawForm.pdfExtractedText && lawForm.pdfExtractedText.trim().length > 0
    ? extractPdfChapters(lawForm.pdfExtractedText)
    : []

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setIsExtractingPdf(true)
    setSelectedPdfChapterIndex(0)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const extractedText: string[] = []

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()

        if (pageText) {
          extractedText.push(pageText)
        }
      }

      const text = extractedText.join('\n\n')
      const extractedChapters = extractPdfChapters(text)

      setSelectedPdfChapterIndex(0)
      setPdfPreviewChapter(extractedChapters[0] ?? null)

      setLawForm((current) => ({
        ...current,
        pdfUrl: file.name,
        pdfExtractedText: text || 'No text could be extracted from this PDF.',
        chapters: extractedChapters.length
          ? extractedChapters.map((chapter, chapterIndex) => ({
              id: Date.now() + chapterIndex,
              title: chapter.title,
              content: chapter.content,
            }))
          : current.chapters.length
            ? current.chapters
            : [
                {
                  id: Date.now(),
                  title: 'Document overview',
                  content: text || 'No text could be extracted from this PDF.',
                },
              ],
      }))
    } catch (error) {
      setLawForm((current) => ({
        ...current,
        pdfUrl: file.name,
        pdfExtractedText: error instanceof Error ? `PDF extraction failed: ${error.message}` : 'PDF extraction failed. Please try another file.',
      }))
    } finally {
      setIsExtractingPdf(false)
      event.target.value = ''
    }
  }

  const handleAddLaw = () => {
    setSelectedLawId(null)
    setLawForm(createEmptyLaw())
    setActiveTab('laws')
  }

  const handleSaveCategory = async () => {
    try {
      const payload = {
        name: categoryForm.name.trim() || 'New category',
        slug: categoryForm.slug.trim() || categoryForm.name.trim() || 'new-category',
        status: categoryForm.status,
      }

      if (selectedCategoryId) {
        const savedCategory = await updateCategory(selectedCategoryId, payload)
        const normalized = normalizeCategory(savedCategory)
        setCategories((current) => current.map((category) => (category.id === normalized.id ? normalized : category)))
        setSelectedCategoryId(normalized.id)
        setCategoryForm(normalized)
        return
      }

      const createdCategory = await createCategory(payload)
      const normalized = normalizeCategory(createdCategory)
      setCategories((current) => [normalized, ...current])
      setSelectedCategoryId(normalized.id)
      setCategoryForm(normalized)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to save category')
    }
  }

  const handleAddCategory = () => {
    setSelectedCategoryId(null)
    setCategoryForm(createEmptyCategory())
    setActiveTab('categories')
  }

  const handleSaveCourse = async () => {
    try {
      const payload = {
        title: courseForm.title.trim() || 'New course',
        category: courseForm.category || 'Civil Law',
        level: courseForm.level,
        duration: courseForm.duration || '4 weeks',
        status: courseForm.status,
      }

      if (selectedCourseId) {
        const savedCourse = await updateCourse(selectedCourseId, payload)
        const normalized = normalizeCourse(savedCourse)
        setCourses((current) => current.map((course) => (course.id === normalized.id ? normalized : course)))
        setSelectedCourseId(normalized.id)
        setCourseForm(normalized)
        return
      }

      const createdCourse = await createCourse(payload)
      const normalized = normalizeCourse(createdCourse)
      setCourses((current) => [normalized, ...current])
      setSelectedCourseId(normalized.id)
      setCourseForm(normalized)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to save course')
    }
  }

  const handleAddCourse = () => {
    setSelectedCourseId(null)
    setCourseForm(createEmptyCourse())
    setActiveTab('courses')
  }

  const stats = [
    { label: 'Active Laws', value: String(laws.filter((law) => law.status === 'Published').length), icon: BookText, tone: 'bg-[#FFF4CC] text-[#A87800]' },
    { label: 'Categories', value: String(categories.length), icon: FolderKanban, tone: 'bg-[#F0EBFF] text-[#5F42D9]' },
    { label: 'Courses', value: String(courses.length), icon: GraduationCap, tone: 'bg-[#EAF7E8] text-[#2F8742]' },
    { label: 'Drafts', value: String(laws.filter((law) => law.status === 'Draft').length), icon: FileText, tone: 'bg-[#FFF1E8] text-[#D16D2F]' },
  ]

  const renderOverview = () => (
    <>
      {dashboardBanner}
      {isLoading && (
        <div className="mb-4 rounded-2xl border border-[#EFE7DA] bg-[#FFFDF9] px-4 py-3 text-sm text-[#5E5B6B]">
          Loading legal records from the database...
        </div>
      )}

      <section className="mt-6 rounded-[28px] border border-[#EFE7DA] bg-gradient-to-br from-[#FFFDF9] via-[#FFF9F4] to-[#F7F4FF] p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Control center</div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#171936] md:text-3xl">Everything legal, in one command center</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setActiveTab('laws')} className="rounded-full bg-[#171936] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-95">Create law</button>
            <button type="button" onClick={() => setActiveTab('categories')} className="rounded-full border border-[#E9D9CF] bg-white px-4 py-2 text-sm font-bold text-[#171936] transition hover:border-[#D8C7FF] hover:text-[#5F42D9]">Add category</button>
            <button type="button" onClick={() => setActiveTab('courses')} className="rounded-full border border-[#E9D9CF] bg-white px-4 py-2 text-sm font-bold text-[#171936] transition hover:border-[#D8C7FF] hover:text-[#5F42D9]">New course</button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-[22px] border border-[#EFE7DA] bg-[#FFFDF9] p-4 shadow-[0_12px_28px_rgba(142,119,87,0.04)] transition hover:-translate-y-0.5 hover:border-[#D8C7FF]">
            <div className="flex items-center justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7C7784]">Live</span>
            </div>
            <div className="mt-5 text-3xl font-black tracking-[-0.05em] text-[#171936]">{value}</div>
            <div className="mt-1 text-sm text-[#5E5B6B]">{label}</div>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-[24px] border border-[#EFE7DA] bg-[#FFFDF9] p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 pb-4">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Recent records</div>
              <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#171936]">Latest law entries</h2>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setActiveTab('laws')}>
              View all
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {laws.slice(0, 4).map((law) => (
              <button
                key={law.id}
                type="button"
                onClick={() => {
                  setSelectedLawId(law.id)
                  setActiveTab('laws')
                }}
                className="flex w-full flex-col gap-3 rounded-2xl border border-[#F0EADD] bg-white p-3 text-left transition hover:border-[#D8C7FF] hover:shadow-[0_12px_20px_rgba(122,91,205,0.06)] md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="text-base font-bold text-[#171936]">{law.title}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[#7A7784]">{law.category}</div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <span className={['rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]', getStatusTone(law.status)].join(' ')}>
                    {law.status}
                  </span>
                  <span className="text-xs text-[#6A6773]">Updated now</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#EFE7DA] bg-[#FFFDF9] p-4 md:p-5">
          <div className="flex items-center justify-between gap-3 pb-4">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Workflow</div>
              <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#171936]">Quick actions</h2>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {quickActions.map(({ label, key, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveTab(key)}
                className="flex items-center justify-between rounded-2xl border border-[#EFE7DA] bg-white p-3 text-left transition hover:border-[#D9C9FF] hover:bg-[#F9F4FF]"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F2EBFF] text-[#5F42D9]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-semibold text-[#171936]">{label}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-[#7A7784]" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  )

  const renderLaws = () => (
    <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[24px] border border-[#EFE7DA] bg-[#FFFDF9] p-4 md:p-5">
        <div className="flex items-center justify-between gap-3 pb-4">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Records</div>
            <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#171936]">Legal acts</h2>
          </div>
          <Button variant="primary" size="sm" onClick={handleAddLaw}>
            New act
          </Button>
        </div>

        <div className="mb-4 rounded-2xl border border-[#EFE7DA] bg-white p-2.5">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by law name, category or jurisdiction"
            className="w-full border-0 bg-transparent text-sm text-[#171936] outline-none placeholder:text-[#8A8595]"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {(['All', 'Published', 'Review', 'Draft'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setLawFilter(filter)}
              className={['rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition', lawFilter === filter ? 'bg-[#171936] text-white' : 'border border-[#E8DFD4] bg-white text-[#5B5868]'].join(' ')}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredLaws.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E7E0D5] bg-[#FFFDF9] p-4 text-sm text-[#5E5B6B]">
              No legal acts match your current search or filter.
            </div>
          ) : (
            filteredLaws.map((law) => (
              <button
                key={law.id}
                type="button"
                onClick={() => setSelectedLawId(law.id)}
                className={[
                  'w-full rounded-2xl border p-3 text-left transition',
                  selectedLawId === law.id ? 'border-[#D8C7FF] bg-[#F9F4FF]' : 'border-[#F0EADD] bg-white hover:border-[#E3D5FF]',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-bold text-[#171936]">{law.title}</div>
                  <span className={['rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em]', getStatusTone(law.status)].join(' ')}>
                    {law.status}
                  </span>
                </div>
                <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#7A7784]">{law.category || 'Unassigned category'}</div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="rounded-[24px] border border-[#EFE7DA] bg-white p-4 md:p-5">
        <div className="flex items-center justify-between gap-3 pb-4">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Content form</div>
            <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#171936]">Law metadata editor</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleDeleteLaw} className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100">
              Delete
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveLaw}>
              Save changes
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-[#373347] md:col-span-2">
            Law title
            <input
              value={lawForm.title}
              onChange={(event) => setLawForm((current) => ({ ...current, title: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            />
          </label>

          <label className="block text-sm font-semibold text-[#373347]">
            Category
            <select
              value={lawForm.category}
              onChange={(event) => setLawForm((current) => ({ ...current, category: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            >
              <option>Civil Law</option>
              <option>Commercial Law</option>
              <option>Criminal Law</option>
              <option>Banking Law</option>
              <option>Other Laws</option>
            </select>
          </label>

          <label className="block text-sm font-semibold text-[#373347]">
            Primary subcategory
            <input
              value={lawForm.subcategory}
              onChange={(event) => setLawForm((current) => ({ ...current, subcategory: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            />
          </label>

          <label className="block text-sm font-semibold text-[#373347]">
            Short name
            <input
              value={lawForm.subcategoryShortName}
              onChange={(event) => setLawForm((current) => ({ ...current, subcategoryShortName: event.target.value }))}
              placeholder="e.g. CPC, IPC, BNS"
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            />
          </label>

          <label className="block text-sm font-semibold text-[#373347]">
            Jurisdiction
            <input
              value={lawForm.jurisdiction}
              onChange={(event) => setLawForm((current) => ({ ...current, jurisdiction: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            />
          </label>

          <label className="block text-sm font-semibold text-[#373347]">
            Publish status
            <select
              value={lawForm.status}
              onChange={(event) => setLawForm((current) => ({ ...current, status: event.target.value as LawRecord['status'] }))}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            >
              <option>Published</option>
              <option>Review</option>
              <option>Draft</option>
            </select>
          </label>

          <label className="block text-sm font-semibold text-[#373347] md:col-span-2">
            PDF source
            <input
              value={lawForm.pdfUrl}
              onChange={(event) => setLawForm((current) => ({ ...current, pdfUrl: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            />
          </label>

          <div className="md:col-span-2 rounded-2xl border border-[#EFE7DA] bg-[#FFFDF9] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Upload PDF</div>
                <div className="mt-2 text-sm font-semibold text-[#171936]">Extract legal text from uploaded document</div>
              </div>
              <label className="inline-flex cursor-pointer rounded-xl border border-[#E7E0D5] bg-white px-3 py-2 text-sm font-semibold text-[#171936] hover:bg-[#F8F5EE]">
                <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                {isExtractingPdf ? 'Extracting...' : 'Choose PDF'}
              </label>
            </div>

            <div className="mt-4 rounded-2xl border border-dashed border-[#E6D7B3] bg-white p-3">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#A87800]">Extracted chapters</div>

              {extractedPdfChapters.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {extractedPdfChapters.map((chapter, index) => (
                    <div
                      key={`${chapter.title}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[#F0EADD] bg-[#FFFDF9] p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">
                          Chapter {index + 1}
                        </div>
                        <div className="mt-1 text-sm font-bold text-[#171936]">{chapter.title}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPdfChapterIndex(index)
                          setPdfPreviewChapter(chapter)
                        }}
                        className="rounded-xl border border-[#E7E0D5] bg-white px-3 py-2 text-xs font-bold text-[#171936] transition hover:border-[#D8C7FF] hover:bg-[#F6F2FF]"
                      >
                        Preview
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-sm leading-7 text-[#403E4B]">No PDF has been uploaded yet.</div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl border border-[#EFE7DA] bg-[#FFFDF9] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Subcategories</div>
                <div className="mt-2 text-sm font-semibold text-[#171936]">Manage legal subtopics</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={subcategoryInput}
                  onChange={(event) => setSubcategoryInput(event.target.value)}
                  placeholder="Add subcategory"
                  className="w-42 rounded-xl border border-[#E7E0D5] bg-white px-3 py-2 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
                />
                <Button variant="secondary" size="sm" onClick={handleAddSubcategory}>Add</Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {lawForm.subcategories.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-[#E8D9FF] bg-[#F9F4FF] px-2.5 py-1.5 text-xs font-semibold text-[#5F42D9]"
                >
                  {item}
                  <button type="button" onClick={() => handleRemoveSubcategory(item)} className="text-[#5F42D9] hover:text-[#33206A]">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl border border-[#EFE7DA] bg-[#FFFDF9] p-4">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Chapters</div>
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1.4fr_auto]">
              <input
                value={chapterTitleInput}
                onChange={(event) => setChapterTitleInput(event.target.value)}
                placeholder="Chapter title"
                className="rounded-xl border border-[#E7E0D5] bg-white px-3 py-2 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
              />
              <textarea
                value={chapterContentInput}
                onChange={(event) => setChapterContentInput(event.target.value)}
                placeholder="Chapter summary"
                rows={2}
                className="rounded-xl border border-[#E7E0D5] bg-white px-3 py-2 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
              />
              <Button variant="primary" size="sm" onClick={handleAddChapter}>Add</Button>
            </div>

            <div className="mt-4 space-y-3">
              {lawForm.chapters.map((chapter) => (
                <div key={chapter.id} className="rounded-2xl border border-[#F0EADD] bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold text-[#171936]">{chapter.title}</div>
                    <button type="button" onClick={() => handleRemoveChapter(chapter.id)} className="text-xs font-semibold text-[#7A7784] hover:text-[#171936]">
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 text-sm leading-7 text-[#4C4957]">{chapter.content}</div>
                </div>
              ))}
            </div>
          </div>

          <label className="block text-sm font-semibold text-[#373347] md:col-span-2">
            Summary
            <textarea
              value={lawForm.summary}
              onChange={(event) => setLawForm((current) => ({ ...current, summary: event.target.value }))}
              rows={5}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            />
          </label>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Button variant="primary" rightIcon={<ArrowUpRight className="h-4 w-4" />} onClick={handleSaveLaw}>
            Publish law
          </Button>
          <Button variant="secondary" onClick={() => setActiveTab('overview')}>
            Back to overview
          </Button>
        </div>
      </div>
    </section>
  )

  const renderCategories = () => (
    <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[24px] border border-[#EFE7DA] bg-[#FFFDF9] p-4 md:p-5">
        <div className="flex items-center justify-between pb-4">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Library</div>
            <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#171936]">Categories</h2>
          </div>
          <Button variant="primary" size="sm" onClick={handleAddCategory}>Add</Button>
        </div>

        <div className="mb-4 rounded-2xl border border-[#EFE7DA] bg-white p-2.5">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search category or slug"
            className="w-full border-0 bg-transparent text-sm text-[#171936] outline-none placeholder:text-[#8A8595]"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {(['All', 'Live', 'Draft'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setCategoryFilter(filter)}
              className={['rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition', categoryFilter === filter ? 'bg-[#171936] text-white' : 'border border-[#E8DFD4] bg-white text-[#5B5868]'].join(' ')}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredCategories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E7E0D5] bg-[#FFFDF9] p-4 text-sm text-[#5E5B6B]">
              No categories match your current search or filter.
            </div>
          ) : (
            filteredCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                className={[
                  'w-full rounded-2xl border p-3 text-left transition',
                  selectedCategoryId === category.id ? 'border-[#D8C7FF] bg-[#F9F4FF]' : 'border-[#F0EADD] bg-white hover:border-[#E3D5FF]',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-[#171936]">{category.name}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#7A7784]">{category.slug}</div>
                  </div>
                  <span className={['rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em]', getStatusTone(category.status)].join(' ')}>
                    {category.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-[#5E5B6B]">{category.count} law records</div>
              </button>
            ))
          )}
        </div>

        {categoryCatalog.length > 0 && (
          <div className="mt-6 border-t border-[#EFE7DA] pt-5">
            <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Live catalogue</div>
            <div className="grid gap-3">
              {categoryCatalog.map((section, index) => {
                const isOpen = openCategoryIndex === index

                return (
                  <article
                    key={section.name}
                    tabIndex={0}
                    data-admin-category-card
                    onClick={() => setOpenCategoryIndex((current) => (current === index ? null : index))}
                    onKeyDown={(event) => handleCardKeyDown(event, index)}
                    className={[
                      'group relative overflow-visible rounded-[20px] border border-[#EFE7DA] bg-white p-3 transition-all duration-200 ease-out outline-none',
                      'hover:border-[#D8CBFF] hover:shadow-[0_12px_28px_rgba(108,74,221,0.08)]',
                      isOpen ? 'border-[#D8CBFF] shadow-[0_12px_28px_rgba(108,74,221,0.08)]' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`grid h-10 w-10 place-items-center rounded-xl text-lg ${section.accent}`}>
                        {section.icon}
                      </div>
                      <div className="flex-1 font-bold text-[#171936]">{section.name}</div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7A7784]">{section.submenu.length} laws</span>
                    </div>

                    <p className="mt-3 pl-[52px] text-sm leading-6 text-[#6E6A7D]">{section.description}</p>

                    <div
                      className={[
                        'mt-3 grid gap-2 rounded-2xl border border-[#E9DFFE] bg-[#FAF7FF] p-2 transition-all duration-200',
                        'pointer-events-none opacity-0 translate-y-[-6px]',
                        isOpen ? 'pointer-events-auto opacity-100 translate-y-0' : '',
                        'group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0',
                      ].join(' ')}
                    >
                      {section.submenu.length > 0 ? (
                        section.submenu.map((item) => (
                          <button
                            key={item.slug}
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleCategoryMenuClick(item.slug)
                            }}
                            className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-left text-[12px] font-bold text-[#34314C] transition-colors hover:bg-[#F2EBFF] hover:text-[#5F42D9]"
                          >
                            <span>{item.label}</span>
                            <span className="text-[#A69ABF]">›</span>
                          </button>
                        ))
                      ) : (
                        <div className="rounded-xl bg-white px-3 py-2 text-[12px] text-[#7A7784]">No laws yet for this category.</div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[24px] border border-[#EFE7DA] bg-white p-4 md:p-5">
        <div className="flex items-center justify-between gap-3 pb-4">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Editor</div>
            <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#171936]">Category details</h2>
          </div>
          <Button variant="primary" size="sm" onClick={handleSaveCategory}>Save</Button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#373347]">
            Category name
            <input
              value={categoryForm.name}
              onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            />
          </label>

          <label className="block text-sm font-semibold text-[#373347]">
            Slug
            <input
              value={categoryForm.slug}
              onChange={(event) => setCategoryForm((current) => ({ ...current, slug: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            />
          </label>

          <label className="block text-sm font-semibold text-[#373347]">
            Record count
            <input
              type="number"
              value={categoryForm.count}
              onChange={(event) =>
                setCategoryForm((current) => ({ ...current, count: Number(event.target.value) || 0 }))
              }
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            />
          </label>

          <label className="block text-sm font-semibold text-[#373347]">
            Status
            <select
              value={categoryForm.status}
              onChange={(event) =>
                setCategoryForm((current) => ({ ...current, status: event.target.value as CategoryRecord['status'] }))
              }
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            >
              <option>Live</option>
              <option>Draft</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  )

  const renderCourses = () => (
    <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[24px] border border-[#EFE7DA] bg-[#FFFDF9] p-4 md:p-5">
        <div className="flex items-center justify-between pb-4">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Learning</div>
            <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#171936]">Courses</h2>
          </div>
          <Button variant="primary" size="sm" onClick={handleAddCourse}>Add</Button>
        </div>

        <div className="mb-4 rounded-2xl border border-[#EFE7DA] bg-white p-2.5">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search course, category or level"
            className="w-full border-0 bg-transparent text-sm text-[#171936] outline-none placeholder:text-[#8A8595]"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {(['All', 'Published', 'Draft'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setCourseFilter(filter)}
              className={['rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition', courseFilter === filter ? 'bg-[#171936] text-white' : 'border border-[#E8DFD4] bg-white text-[#5B5868]'].join(' ')}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E7E0D5] bg-[#FFFDF9] p-4 text-sm text-[#5E5B6B]">
              No courses match your current search or filter.
            </div>
          ) : (
            filteredCourses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => setSelectedCourseId(course.id)}
                className={[
                  'w-full rounded-2xl border p-3 text-left transition',
                  selectedCourseId === course.id ? 'border-[#D8C7FF] bg-[#F9F4FF]' : 'border-[#F0EADD] bg-white hover:border-[#E3D5FF]',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-bold text-[#171936]">{course.title}</div>
                  <span className={['rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em]', getStatusTone(course.status)].join(' ')}>
                    {course.status}
                  </span>
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#7A7784]">{course.category} • {course.level}</div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="rounded-[24px] border border-[#EFE7DA] bg-white p-4 md:p-5">
        <div className="flex items-center justify-between gap-3 pb-4">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Course editor</div>
            <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#171936]">Course details</h2>
          </div>
          <Button variant="primary" size="sm" onClick={handleSaveCourse}>Save</Button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#373347]">
            Course title
            <input
              value={courseForm.title}
              onChange={(event) => setCourseForm((current) => ({ ...current, title: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            />
          </label>

          <label className="block text-sm font-semibold text-[#373347]">
            Category
            <select
              value={courseForm.category}
              onChange={(event) => setCourseForm((current) => ({ ...current, category: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            >
              <option>Civil Law</option>
              <option>Commercial Law</option>
              <option>Criminal Law</option>
              <option>Banking Law</option>
            </select>
          </label>

          <label className="block text-sm font-semibold text-[#373347]">
            Level
            <select
              value={courseForm.level}
              onChange={(event) => setCourseForm((current) => ({ ...current, level: event.target.value as CourseRecord['level'] }))}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>

          <label className="block text-sm font-semibold text-[#373347]">
            Duration
            <input
              value={courseForm.duration}
              onChange={(event) => setCourseForm((current) => ({ ...current, duration: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            />
          </label>

          <label className="block text-sm font-semibold text-[#373347]">
            Status
            <select
              value={courseForm.status}
              onChange={(event) => setCourseForm((current) => ({ ...current, status: event.target.value as CourseRecord['status'] }))}
              className="mt-2 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
            >
              <option>Published</option>
              <option>Draft</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  )

  const renderSettings = () => (
    <section className="mt-6 rounded-[24px] border border-[#EFE7DA] bg-[#FFFDF9] p-4 md:p-6">
      <div className="pb-4">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Preferences</div>
        <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#171936]">Admin settings</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#F0EADD] bg-white p-4">
          <div className="text-sm font-bold text-[#171936]">Brand theme</div>
          <select
            value={settings.brandTheme}
            onChange={(event) => setSettings((current) => ({ ...current, brandTheme: event.target.value }))}
            className="mt-3 w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
          >
            <option>Golden legal</option>
            <option>Professional dark</option>
            <option>Minimal ivory</option>
          </select>
        </div>

        <div className="rounded-2xl border border-[#F0EADD] bg-white p-4">
          <div className="text-sm font-bold text-[#171936]">Content controls</div>
          <div className="mt-3 space-y-3 text-sm text-[#5E5B6B]">
            <label className="flex items-center justify-between gap-3">
              <span>Auto sync</span>
              <input
                type="checkbox"
                checked={settings.autoSync}
                onChange={() => setSettings((current) => ({ ...current, autoSync: !current.autoSync }))}
                className="h-4 w-4 rounded border-[#D8D0C4] text-[#5F42D9]"
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Require review</span>
              <input
                type="checkbox"
                checked={settings.requireReview}
                onChange={() => setSettings((current) => ({ ...current, requireReview: !current.requireReview }))}
                className="h-4 w-4 rounded border-[#D8D0C4] text-[#5F42D9]"
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Public preview</span>
              <input
                type="checkbox"
                checked={settings.publicPreview}
                onChange={() => setSettings((current) => ({ ...current, publicPreview: !current.publicPreview }))}
                className="h-4 w-4 rounded border-[#D8D0C4] text-[#5F42D9]"
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <>
      {pdfPreviewChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171936]/55 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-3xl overflow-hidden rounded-[26px] border border-[#EEE7E0] bg-[#FFFCF8] shadow-[0_22px_70px_rgba(23,25,54,0.22)]">
            <div className="flex items-center justify-between border-b border-[#F0EADD] bg-white px-5 py-4">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">
                  Chapter {selectedPdfChapterIndex + 1}
                </div>
                <h3 className="mt-1 text-2xl font-black tracking-[-0.05em] text-[#171936]">{pdfPreviewChapter.title}</h3>
              </div>

              <button
                type="button"
                onClick={() => setPdfPreviewChapter(null)}
                className="grid h-9 w-9 place-items-center rounded-full border border-[#E7E0D5] bg-[#FFFDF9] text-xl text-[#171936] hover:opacity-80"
                aria-label="Close chapter preview"
              >
                ×
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5">
              <p className="whitespace-pre-wrap text-sm leading-8 text-[#403E4B]">
                {pdfPreviewChapter.content}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#FFFDF8] text-[#25232B]">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-5 lg:px-6">
        <aside className="hidden w-[260px] shrink-0 rounded-[28px] border border-[#EEE4D9] bg-white p-5 shadow-[0_18px_55px_rgba(25,20,40,0.04)] lg:block">
          <div className="flex items-center gap-3 border-b border-[#F0EADD] pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFD84D] text-[#25232B] shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-black tracking-[-0.04em] text-[#171936]">LexQuora</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7B7882]">Admin</div>
            </div>
          </div>

          <nav className="mt-7 space-y-2">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={[
                  'flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition-all',
                  activeTab === key ? 'bg-[#FFF7D9] text-[#171936]' : 'text-[#5C5963] hover:bg-[#F8F5EE] hover:text-[#171936]',
                ].join(' ')}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                {activeTab === key ? <ChevronRight className="h-4 w-4" /> : null}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#FFF4CC] to-[#FFFDF8] p-4">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#A87800]">Quick sync</div>
            <div className="mt-2 text-lg font-black tracking-[-0.04em] text-[#171936]">{laws.length + categories.length + courses.length} records live</div>
            <div className="mt-3 text-xs leading-6 text-[#635F6D]">Your latest legal data refresh is aligned with the current Bare Acts catalogue.</div>
          </div>

          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-[#F0EADD] bg-[#FFFDF9] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#5F42D9]">AD</div>
            <div className="flex-1">
              <div className="text-sm font-bold text-[#171936]">Admin Panel</div>
              <div className="text-xs text-[#7A7784]">Super admin</div>
            </div>
            <Link to="/admin/login" className="text-[#7A7784] hover:text-[#171936]" aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </aside>

        <main className="flex-1 rounded-[28px] border border-[#EEE4D9] bg-white p-4 shadow-[0_18px_55px_rgba(25,20,40,0.04)] md:p-6">
          <header className="flex flex-col gap-4 border-b border-[#F0EADD] pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#7C7784]">
                {activeTab === 'overview' ? 'Dashboard overview' : activeTab === 'laws' ? 'Law management' : activeTab === 'categories' ? 'Category management' : activeTab === 'courses' ? 'Course management' : 'System settings'}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#171936]">
                {activeTab === 'overview' ? 'Content management' : activeTab === 'laws' ? 'Laws' : activeTab === 'categories' ? 'Categories' : activeTab === 'courses' ? 'Courses' : 'Settings'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-2xl border border-[#EDE3D5] bg-[#FFFDF9] px-3 py-2 text-sm text-[#676275] md:flex">
                <Search className="h-4 w-4" />
                Search records
              </div>
              <button type="button" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#EEE4D9] bg-[#FFFDF9] text-[#171936] transition hover:bg-[#F8F5EE]">
                <Bell className="h-4 w-4" />
              </button>
              <Link to="/admin/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5F42D9]">
                Log out <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </header>

          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'laws' && renderLaws()}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'settings' && renderSettings()}
        </main>
      </div>
    </div>
    </>
  )
}
