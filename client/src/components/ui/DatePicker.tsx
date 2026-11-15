import React from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="date"
            className={cn(
              'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-900 shadow-2xs transition-all outline-none',
              'focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15',
              'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
              error && 'border-rose-400 focus:border-rose-500',
              className
            )}
            {...props}
          />
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
