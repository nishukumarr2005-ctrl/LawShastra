import React from 'react'
import { cn } from '@/utils/cn'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const PageShell: React.FC<{
  title: string
  subtitle?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
}> = ({ title, subtitle, icon, actions, children }) => (
  <div className="space-y-6 p-6 lg:p-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Admin Module</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
    {children}
  </div>
)

export const StatGrid: React.FC<{ items: { label: string; value: string | number; tone?: string }[] }> = ({ items }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {items.map((it) => (
      <Card key={it.label} className="hover:shadow-md transition-shadow">
        <CardContent className="pt-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{it.label}</p>
          <p className={cn('mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-100', it.tone)}>{it.value}</p>
        </CardContent>
      </Card>
    ))}
  </div>
)

export const SectionCard: React.FC<{ title: string; description?: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }> = ({
  title,
  description,
  actions,
  children,
  className,
}) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-start justify-between gap-3">
      <div>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>
      {actions}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

export const Field: React.FC<{ label: string; children: React.ReactNode; hint?: string; className?: string }> = ({ label, children, hint, className }) => (
  <label className={cn('block text-sm font-medium text-slate-700 dark:text-slate-300', className)}>
    <span className="mb-1 block">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
  </label>
)

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    className={cn(
      'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
      className
    )}
    {...props}
  />
)

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
  <textarea
    className={cn(
      'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 resize-y',
      className
    )}
    {...props}
  />
)

export const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, children, ...props }) => (
  <select
    className={cn(
      'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
      className
    )}
    {...props}
  >
    {children}
  </select>
)

export const Toolbar: React.FC<{ left?: React.ReactNode; right?: React.ReactNode }> = ({ left, right }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-1 flex-wrap items-center gap-2">{left}</div>
    <div className="flex flex-wrap items-center gap-2">{right}</div>
  </div>
)

export const Pill: React.FC<{ tone?: 'slate' | 'green' | 'amber' | 'blue' | 'rose'; children: React.ReactNode }> = ({ tone = 'slate', children }) => {
  const tones: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  }
  return <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone])}>{children}</span>
}

export const SimpleTable: React.FC<{ headers: string[]; rows: React.ReactNode[][]; empty?: string }> = ({ headers, rows, empty }) => (
  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40">
          {headers.map((h) => (
            <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={headers.length} className="px-4 py-10 text-center text-sm text-slate-500">{empty || 'No records found.'}</td></tr>
        ) : (
          rows.map((cells, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/30">
              {cells.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-middle text-slate-700 dark:text-slate-200">{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)

export const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'default' | 'danger' }> = ({ tone = 'default', className, ...props }) => (
  <button
    className={cn(
      'rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors',
      tone === 'danger'
        ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
      className
    )}
    {...props}
  />
)

export const PrimaryBtn = Button
