import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface AdminBreadcrumbProps {
  className?: string
}

export const AdminBreadcrumb: React.FC<AdminBreadcrumbProps> = ({ className }) => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  const formatSegment = (str: string) => {
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1.5 text-xs font-semibold text-slate-500', className)}
    >
      <Link
        to="/admin"
        className="flex items-center gap-1 text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {pathnames.map((segment, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1

        return (
          <React.Fragment key={to}>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                {formatSegment(segment)}
              </span>
            ) : (
              <Link
                to={to}
                className="text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors truncate"
              >
                {formatSegment(segment)}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
