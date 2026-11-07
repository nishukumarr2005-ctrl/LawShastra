import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as pdfjsLib from 'pdfjs-dist'
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
  subcategories: string[]
  chapters: ChapterRecord[]
  jurisdiction: string
  status: 'Published' | 'Review' | 'Draft'
  summary: string
  pdfUrl: string
  pdfExtractedText: string
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

const initialLaws: LawRecord[] = [
  {
    id: 1,
    title: 'Code of Civil Procedure, 1908',
    category: 'Civil Law',
    subcategory: 'Procedural Law',
    subcategories: ['Procedural Law', 'Civil Remedies', 'Evidence'],
    chapters: [
      { id: 1, title: 'Jurisdiction', content: 'Rules governing a court’s power to hear and decide a civil matter.' },
      { id: 2, title: 'Pleadings', content: 'Framework for stating claims, defences and issues in civil litigation.' },
    ],
    jurisdiction: 'India',
    status: 'Published',
    summary:
      'The Code of Civil Procedure governs procedural rules for civil litigation in India, covering suits, appeals, execution and jurisdictional principles.',
    pdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/....pdf',
    pdfExtractedText:
      'Chapter 1: Jurisdiction. The code defines the court’s authority to adjudicate civil disputes. Chapter 2: Pleadings. Parties must set out facts and legal claims clearly.',
  },
  {
    id: 2,
    title: 'Indian Contract Act, 1872',
    category: 'Commercial Law',
    subcategory: 'Contractual Rights',
    subcategories: ['Contractual Rights', 'Remedies'],
    chapters: [
      { id: 1, title: 'Formation of Contract', content: 'Offer, acceptance, consideration and legal capacity.' },
      { id: 2, title: 'Discharge', content: 'Modes of discharge of contractual obligations.' },
    ],
    jurisdiction: 'India',
    status: 'Review',
    summary: 'Rules for contracts, void agreements, consideration, performance and remedies in commercial matters.',
    pdfUrl: 'https://www.indiacode.nic.in/handle/123456789/....pdf',
    pdfExtractedText: 'Formation of contract includes offer, acceptance and consideration. Remedies include damages, specific performance and rescission.',
  },
  {
    id: 3,
    title: 'Negotiable Instruments Act, 1881',
    category: 'Banking Law',
    subcategory: 'Financial Instruments',
    subcategories: ['Financial Instruments', 'Commercial Banking'],
    chapters: [
      { id: 1, title: 'Promissory Notes', content: 'Rules relating to promissory notes and their legal enforceability.' },
      { id: 2, title: 'Cheques', content: 'Presentation, dishonour and notice requirements for cheques.' },
    ],
    jurisdiction: 'India',
    status: 'Published',
    summary: 'Legislation governing promissory notes, bills of exchange, cheques and negotiable instruments.',
    pdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/....pdf',
    pdfExtractedText: 'Promissory notes and bills of exchange must satisfy formal requirements under the legislation. Dishonour of cheques attracts statutory consequences.',
  },
  {
    id: 4,
    title: 'Prevention of Corruption Act, 1988',
    category: 'Criminal Law',
    subcategory: 'Anti-Corruption',
    subcategories: ['Anti-Corruption', 'Investigative Powers'],
    chapters: [
      { id: 1, title: 'Offences', content: 'Offences related to bribery, undue influence and abuse of office.' },
      { id: 2, title: 'Prosecution', content: 'Procedure for investigating and prosecuting corruption offences.' },
    ],
    jurisdiction: 'India',
    status: 'Draft',
    summary: 'Framework for investigation and prosecution of offences relating to bribery and corruption.',
    pdfUrl: 'https://www.indiacode.nic.in/handle/123456789/....pdf',
    pdfExtractedText: 'The act defines offences and the statutory procedures for investigation and prosecution of corruption matters.',
  },
]

const initialCategories: CategoryRecord[] = [
  { id: 1, name: 'Civil Law', slug: 'civil-law', count: 18, status: 'Live' },
  { id: 2, name: 'Criminal Law', slug: 'criminal-law', count: 14, status: 'Live' },
  { id: 3, name: 'Banking Law', slug: 'banking-law', count: 11, status: 'Live' },
  { id: 4, name: 'Commercial Law', slug: 'commercial-law', count: 9, status: 'Draft' },
]

const initialCourses: CourseRecord[] = [
  { id: 1, title: 'Civil Procedure Essentials', category: 'Civil Law', level: 'Beginner', duration: '4 weeks', status: 'Published' },
  { id: 2, title: 'Contract Drafting and Remedies', category: 'Commercial Law', level: 'Intermediate', duration: '6 weeks', status: 'Published' },
  { id: 3, title: 'Banking Recovery Framework', category: 'Banking Law', level: 'Advanced', duration: '5 weeks', status: 'Draft' },
]

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

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<NavKey>('overview')
  const [laws, setLaws] = useState<LawRecord[]>(initialLaws)
  const [categories, setCategories] = useState<CategoryRecord[]>(initialCategories)
  const [courses, setCourses] = useState<CourseRecord[]>(initialCourses)
  const [selectedLawId, setSelectedLawId] = useState<number>(initialLaws[0].id)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(initialCategories[0].id)
  const [selectedCourseId, setSelectedCourseId] = useState<number>(initialCourses[0].id)
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

  const selectedLaw = useMemo(
    () => laws.find((law) => law.id === selectedLawId) ?? laws[0],
    [laws, selectedLawId]
  )

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) ?? categories[0],
    [categories, selectedCategoryId]
  )

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) ?? courses[0],
    [courses, selectedCourseId]
  )

  const [lawForm, setLawForm] = useState<LawRecord>(selectedLaw)
  const [categoryForm, setCategoryForm] = useState<CategoryRecord>(selectedCategory)
  const [courseForm, setCourseForm] = useState<CourseRecord>(selectedCourse)

  useEffect(() => {
    setLawForm(selectedLaw)
  }, [selectedLaw])

  useEffect(() => {
    setCategoryForm(selectedCategory)
  }, [selectedCategory])

  useEffect(() => {
    setCourseForm(selectedCourse)
  }, [selectedCourse])

  const handleSaveLaw = () => {
    setLaws((current) =>
      current.map((law) => (law.id === selectedLawId ? { ...lawForm, subcategory: lawForm.subcategories[0] ?? '' } : law))
    )
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

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setIsExtractingPdf(true)

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

        if (pageText.trim()) {
          extractedText.push(pageText.trim())
        }
      }

      const text = extractedText.join('\n\n')

      setLawForm((current) => ({
        ...current,
        pdfUrl: file.name,
        pdfExtractedText: text || 'No text could be extracted from this PDF.',
      }))
    } finally {
      setIsExtractingPdf(false)
      event.target.value = ''
    }
  }

  const handleAddLaw = () => {
    const newId = Date.now()
    const newLaw: LawRecord = {
      id: newId,
      title: 'New Legal Act',
      category: 'Civil Law',
      subcategory: 'General',
      subcategories: ['General'],
      chapters: [{ id: Date.now(), title: 'Introduction', content: 'New chapter details go here.' }],
      jurisdiction: 'India',
      status: 'Draft',
      summary: 'Add a short description of the act and its legal importance.',
      pdfUrl: 'https://example.com/new-act.pdf',
      pdfExtractedText: 'Uploaded PDF content will appear here after extraction.',
    }

    setLaws((current) => [newLaw, ...current])
    setSelectedLawId(newId)
    setActiveTab('laws')
  }

  const handleSaveCategory = () => {
    setCategories((current) =>
      current.map((category) => (category.id === selectedCategoryId ? { ...categoryForm } : category))
    )
  }

  const handleAddCategory = () => {
    const newCategory: CategoryRecord = {
      id: Date.now(),
      name: 'New Category',
      slug: 'new-category',
      count: 0,
      status: 'Draft',
    }

    setCategories((current) => [newCategory, ...current])
    setSelectedCategoryId(newCategory.id)
    setActiveTab('categories')
  }

  const handleSaveCourse = () => {
    setCourses((current) =>
      current.map((course) => (course.id === selectedCourseId ? { ...courseForm } : course))
    )
  }

  const handleAddCourse = () => {
    const newCourse: CourseRecord = {
      id: Date.now(),
      title: 'New Course',
      category: 'Civil Law',
      level: 'Beginner',
      duration: '3 weeks',
      status: 'Draft',
    }

    setCourses((current) => [newCourse, ...current])
    setSelectedCourseId(newCourse.id)
    setActiveTab('courses')
  }

  const lawMeta = useMemo(
    () => [
      { label: 'Chapters', value: '8' },
      { label: 'Sections', value: '158' },
      { label: 'Parts', value: '6' },
      { label: 'Last Sync', value: '1h ago' },
    ],
    []
  )

  const stats = [
    { label: 'Active Laws', value: String(laws.filter((law) => law.status === 'Published').length), icon: BookText, tone: 'bg-[#FFF4CC] text-[#A87800]' },
    { label: 'Categories', value: String(categories.length), icon: FolderKanban, tone: 'bg-[#F0EBFF] text-[#5F42D9]' },
    { label: 'Courses', value: String(courses.length), icon: GraduationCap, tone: 'bg-[#EAF7E8] text-[#2F8742]' },
    { label: 'Drafts', value: String(laws.filter((law) => law.status === 'Draft').length), icon: FileText, tone: 'bg-[#FFF1E8] text-[#D16D2F]' },
  ]

  const renderOverview = () => (
    <>
      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-[#EFE7DA] bg-[#FFFDF9] p-4">
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
                className="flex w-full flex-col gap-3 rounded-2xl border border-[#F0EADD] bg-white p-3 text-left md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="text-base font-bold text-[#171936]">{law.title}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[#7A7784]">{law.category}</div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <span
                    className={[
                      'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]',
                      law.status === 'Published' ? 'bg-[#EAF7E8] text-[#2F8742]' : law.status === 'Review' ? 'bg-[#FFF4CC] text-[#A87800]' : 'bg-[#F3EEFC] text-[#5F42D9]',
                    ].join(' ')}
                  >
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

        <div className="space-y-3">
          {laws.map((law) => (
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
                <span
                  className={[
                    'rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em]',
                    law.status === 'Published' ? 'bg-[#EAF7E8] text-[#2F8742]' : law.status === 'Review' ? 'bg-[#FFF4CC] text-[#A87800]' : 'bg-[#F3EEFC] text-[#5F42D9]',
                  ].join(' ')}
                >
                  {law.status}
                </span>
              </div>
              <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#7A7784]">{law.category}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] border border-[#EFE7DA] bg-white p-4 md:p-5">
        <div className="flex items-center justify-between gap-3 pb-4">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Content form</div>
            <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#171936]">Law metadata editor</h2>
          </div>
          <Button variant="primary" size="sm" onClick={handleSaveLaw}>
            Save changes
          </Button>
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
              <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#A87800]">Extracted content</div>
              <div className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap text-sm leading-7 text-[#403E4B]">
                {lawForm.pdfExtractedText || 'No PDF has been uploaded yet.'}
              </div>
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

        <div className="space-y-3">
          {categories.map((category) => (
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
                <span className="rounded-full bg-[#F3EEFC] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#5F42D9]">
                  {category.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-[#5E5B6B]">{category.count} law records</div>
            </button>
          ))}
        </div>
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

        <div className="space-y-3">
          {courses.map((course) => (
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
                <span className="rounded-full bg-[#F3EEFC] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#5F42D9]">
                  {course.status}
                </span>
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#7A7784]">{course.category} • {course.level}</div>
            </button>
          ))}
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
  )
}
