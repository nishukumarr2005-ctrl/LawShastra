import type { Course } from '@/types'
import { CourseCard } from './CourseCard'
import { BookOpen, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface CourseListProps {
  courses: Course[]
  layout?: 'grid' | 'list'
  onResetFilters?: () => void
}

export function CourseList({ courses, layout = 'grid', onResetFilters }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="bg-white border border-[#EFEBE1] rounded-3xl p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-[#FFF9E5] text-[#9A7300] border border-[#FFE885] flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#25232B] mb-2">No matching courses found</h3>
        <p className="text-sm text-[#77747F] mb-6">
          We couldn't find any courses matching your specific search filters. Try selecting a different topic or resetting filters.
        </p>
        {onResetFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onResetFilters}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Reset All Filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      className={
        layout === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'
          : 'flex flex-col gap-6'
      }
    >
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} layout={layout} />
      ))}
    </div>
  )
}
