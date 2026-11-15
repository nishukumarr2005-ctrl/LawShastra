import React from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'
import { Pagination } from './Pagination'
import { cn } from '@/utils/cn'

export interface Column<T> {
  key: string
  header: React.ReactNode
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (columnKey: string) => void
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    pageSize?: number
    totalItems?: number
  }
  emptyMessage?: string
  emptyActionLabel?: string
  onEmptyAction?: () => void
  onRowClick?: (row: T) => void
  className?: string
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading = false,
  sortColumn,
  sortDirection,
  onSort,
  pagination,
  emptyMessage = 'No records found',
  emptyActionLabel,
  onEmptyAction,
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 dark:border-slate-800 dark:bg-slate-800/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  onClick={() => col.sortable && onSort?.(col.key)}
                  className={cn(
                    'px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300',
                    col.sortable && 'cursor-pointer select-none hover:text-slate-900 dark:hover:text-white',
                    col.className
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortColumn === col.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`loading-${i}`}>
                  {columns.map((col) => (
                    <td key={`col-${col.key}`} className="px-5 py-4">
                      <Skeleton className="h-4 w-full max-w-[140px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center">
                  <EmptyState
                    title={emptyMessage}
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id ?? `row-${index}`}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={`cell-${col.key}`}
                      className={cn('px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300', col.className)}
                    >
                      {col.render ? col.render(row) : (row as Record<string, any>)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="px-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/60">
          <Pagination {...pagination} />
        </div>
      )}
    </div>
  )
}
