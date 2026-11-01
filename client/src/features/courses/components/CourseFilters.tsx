import { categories } from '@/data/categories'
import { Filter, Check, RotateCcw } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface FilterState {
  category: string
  level: string
  sortBy: string
}

export interface CourseFiltersProps {
  filters: FilterState
  onFilterChange: (key: keyof FilterState, value: string) => void
  onReset: () => void
  totalResults: number
}

export function CourseFilters({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}: CourseFiltersProps) {
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']
  const sortOptions = [
    { label: 'Most Popular', value: 'popular' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
  ]

  const hasActiveFilters = filters.category !== 'all' || filters.level !== 'all'

  return (
    <aside className="w-full bg-white border border-[#EFEBE1] rounded-3xl p-6 shadow-2xs">
      <div className="flex items-center justify-between pb-5 border-b border-[#EFEBE1] mb-6">
        <div className="flex items-center gap-2 font-bold text-sm text-[#25232B]">
          <Filter className="w-4 h-4 text-[#FF8A45]" />
          <span>Filters</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFF9E5] text-[#9A7300]">
            {totalResults}
          </span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF8A45] hover:text-[#E06F28] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div className="mb-7">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#25232B] mb-3">
          Topic / Category
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange('category', 'all')}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left',
              filters.category === 'all'
                ? 'bg-[#FFF9E5] text-[#9A7300] font-bold'
                : 'text-[#5C5963] hover:bg-[#F8F5EE] hover:text-[#25232B]'
            )}
          >
            <span>All Categories</span>
            {filters.category === 'all' && <Check className="w-3.5 h-3.5 text-[#9A7300]" />}
          </button>

          {categories.map((cat) => {
            const isSelected = filters.category === cat.slug
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange('category', cat.slug)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left',
                  isSelected
                    ? 'bg-[#FFF9E5] text-[#9A7300] font-bold'
                    : 'text-[#5C5963] hover:bg-[#F8F5EE] hover:text-[#25232B]'
                )}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-[#9A7300]" />
                ) : (
                  <span className="text-[10px] text-[#A19DA8] font-normal">
                    {cat.coursesCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Level Filter */}
      <div className="mb-7">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#25232B] mb-3">
          Experience Level
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {levels.map((lvl) => {
            const isSelected = filters.level.toLowerCase() === lvl.toLowerCase()
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => onFilterChange('level', lvl.toLowerCase())}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                  isSelected
                    ? 'bg-[#25232B] text-white border-[#25232B]'
                    : 'bg-white text-[#5C5963] border-[#EFEBE1] hover:border-[#D5D0C5]'
                )}
              >
                {lvl}
              </button>
            )
          })}
        </div>
      </div>

      {/* Sort By Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#25232B] mb-3">
          Sort Courses
        </h4>
        <div className="space-y-1">
          {sortOptions.map((opt) => {
            const isSelected = filters.sortBy === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange('sortBy', opt.value)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left',
                  isSelected
                    ? 'bg-[#F3EEFC] text-[#5B32BF] font-bold'
                    : 'text-[#5C5963] hover:bg-[#F8F5EE] hover:text-[#25232B]'
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#5B32BF]" />}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
