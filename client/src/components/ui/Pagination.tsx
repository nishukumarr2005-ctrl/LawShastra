import React from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  totalItems?: number
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  className,
}) => {
  if (totalPages <= 1 && !totalItems) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-4 py-3 sm:flex-row',
        className
      )}
    >
      {totalItems !== undefined && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Showing{' '}
          <strong className="text-slate-900 dark:text-slate-100">
            {Math.min((currentPage - 1) * (pageSize || 10) + 1, totalItems)}
          </strong>{' '}
          to{' '}
          <strong className="text-slate-900 dark:text-slate-100">
            {Math.min(currentPage * (pageSize || 10), totalItems)}
          </strong>{' '}
          of <strong className="text-slate-900 dark:text-slate-100">{totalItems}</strong> entries
        </span>
      )}

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                'min-w-[36px] h-9 rounded-xl px-2 text-xs font-bold transition-all',
                currentPage === page
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              {page}
            </button>
          ) : (
            <span key={`ellipsis-${index}`} className="px-2 text-xs text-slate-400">
              ...
            </span>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Next page"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Last page"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
