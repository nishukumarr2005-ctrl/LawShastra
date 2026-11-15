import React, { createContext, useContext, useState } from 'react'
import { cn } from '@/utils/cn'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (val: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

export interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (val: string) => void
  children: React.ReactNode
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}) => {
  const [internalTab, setInternalTab] = useState(defaultValue)
  const activeTab = value !== undefined ? value : internalTab

  const handleTabChange = (val: string) => {
    if (value === undefined) {
      setInternalTab(val)
    }
    onValueChange?.(val)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export const TabList: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    role="tablist"
    className={cn(
      'inline-flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800/80',
      className
    )}
  >
    {children}
  </div>
)

export interface TabTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export const TabTrigger: React.FC<TabTriggerProps> = ({
  value,
  children,
  className,
  icon,
  disabled = false,
}) => {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabTrigger must be used inside Tabs')

  const isActive = ctx.activeTab === value

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => ctx.setActiveTab(value)}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all outline-none',
        isActive
          ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {icon && <span className="h-4 w-4">{icon}</span>}
      {children}
    </button>
  )
}

export const TabContent: React.FC<{
  value: string
  children: React.ReactNode
  className?: string
}> = ({ value, children, className }) => {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabContent must be used inside Tabs')

  if (ctx.activeTab !== value) return null

  return (
    <div role="tabpanel" className={cn('mt-4 animate-in fade-in duration-150', className)}>
      {children}
    </div>
  )
}
