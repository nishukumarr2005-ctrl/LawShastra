import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react'

import { Container } from '@/components/ui/Container'
import { CourseList } from '../components/CourseList'
import { CourseSearch } from '../components/CourseSearch'
import { CourseFilters, type FilterState } from '../components/CourseFilters'
import { courses } from '@/data/courses'
import { cn } from '@/utils/cn'

export function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // URL state extraction
  const query = searchParams.get('query') || ''
  const category = searchParams.get('category') || 'all'
  const level = searchParams.get('level') || 'all'
  const sortBy = searchParams.get('sortBy') || 'popular'

  // Update URL params helper
  const updateFilter = (key: keyof FilterState | 'query', value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value === 'all' || !value) {
      newParams.delete(key)
    } else {
      newParams.set(key, value)
    }
    setSearchParams(newParams, { replace: true })
  }

  const resetFilters = () => {
    setSearchParams({}, { replace: true })
  }

  // Filter & Sort calculation
  const filteredCourses = useMemo(() => {
    let result = [...courses]

    // 1. Text Search
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    // 2. Category Filter
    if (category !== 'all') {
      result = result.filter((c) => c.categorySlug === category)
    }

    // 3. Level Filter
    if (level !== 'all') {
      result = result.filter((c) => c.level.toLowerCase() === level.toLowerCase())
    }

    // 4. Sorting
    if (sortBy === 'popular') {
      result.sort((a, b) => b.totalStudents - a.totalStudents)
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [query, category, level, sortBy])

  return (
    <div className="py-10 lg:py-14 bg-[#FFFDF8] min-h-[calc(100vh-80px)]">
      <Container>
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <span className="text-xs font-bold text-[#FF8A45] uppercase tracking-wider mb-2 block">
            Complete Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#25232B] tracking-tight">
            Explore All Online Courses
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#77747F] max-w-2xl">
            Filter by technology stack, experience level, or rating to discover your next career milestone.
          </p>
        </div>

        {/* Top Control Bar: Search Input, Mobile Filter Toggle, View Layout Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="w-full sm:max-w-md">
            <CourseSearch
              value={query}
              onChange={(val) => updateFilter('query', val)}
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EFEBE1] rounded-2xl text-xs font-bold text-[#25232B] hover:bg-[#F8F5EE]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#FF8A45]" />
              <span>Filters ({filteredCourses.length})</span>
            </button>

            {/* Layout Toggle (Grid / List) */}
            <div className="flex items-center gap-1 p-1 bg-white border border-[#EFEBE1] rounded-2xl shadow-2xs">
              <button
                type="button"
                onClick={() => setLayout('grid')}
                className={cn(
                  'p-2 rounded-xl transition-all cursor-pointer',
                  layout === 'grid'
                    ? 'bg-[#25232B] text-white shadow-xs'
                    : 'text-[#77747F] hover:text-[#25232B]'
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLayout('list')}
                className={cn(
                  'p-2 rounded-xl transition-all cursor-pointer',
                  layout === 'list'
                    ? 'bg-[#25232B] text-white shadow-xs'
                    : 'text-[#77747F] hover:text-[#25232B]'
                )}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Course Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <CourseFilters
              filters={{ category, level, sortBy }}
              onFilterChange={updateFilter}
              onReset={resetFilters}
              totalResults={filteredCourses.length}
            />
          </div>

          {/* Mobile Filter Dropdown */}
          {mobileFilterOpen && (
            <div className="lg:hidden col-span-1 mb-4">
              <CourseFilters
                filters={{ category, level, sortBy }}
                onFilterChange={updateFilter}
                onReset={resetFilters}
                totalResults={filteredCourses.length}
              />
            </div>
          )}

          {/* Course List / Grid Area */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between text-xs text-[#77747F] mb-4 px-1">
              <span>
                Showing <strong className="text-[#25232B]">{filteredCourses.length}</strong> of{' '}
                {courses.length} courses
              </span>
              {category !== 'all' && (
                <span className="font-semibold text-[#FF8A45]">
                  Filtered by topic: {category}
                </span>
              )}
            </div>

            <CourseList
              courses={filteredCourses}
              layout={layout}
              onResetFilters={resetFilters}
            />
          </div>
        </div>
      </Container>
    </div>
  )
}
