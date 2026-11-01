import { Search, X } from 'lucide-react'

export interface CourseSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function CourseSearch({
  value,
  onChange,
  placeholder = 'Search courses, skills, or instructors...',
}: CourseSearchProps) {
  return (
    <div className="relative w-full">
      <Search className="w-4 h-4 text-[#A19DA8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-[#EFEBE1] rounded-2xl pl-11 pr-10 py-3 text-sm text-[#25232B] placeholder:text-[#A19DA8] font-medium transition-all focus:outline-none focus:border-[#FF8A45] focus:ring-2 focus:ring-[#FF8A45]/20 shadow-2xs"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#A19DA8] hover:text-[#25232B] rounded-lg transition-colors"
          aria-label="Clear search query"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
