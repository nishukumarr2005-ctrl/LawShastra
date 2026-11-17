import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  ExternalLink,
  Menu,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
  RefreshCw,
} from 'lucide-react'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import { cn } from '@/utils/cn'
import { adminActions, useAdminStore } from '@/features/admin/shared/adminStore'
import { useAuth } from '@/features/admin/auth/AuthContext'

export interface AdminHeaderProps {
  onMenuClick?: () => void
  user?: {
    name: string
    email: string
    role: string
  }
  className?: string
}

const FALLBACK_USER = {
  name: 'Administrator',
  email: 'lexsquora@gmail.com',
  role: 'SUPER_ADMIN',
}

const prettyRole = (role?: string) =>
  (role || 'USER')
    .toLowerCase()
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onMenuClick,
  user,
  className,
}) => {
  const navigate = useNavigate()
  const { user: authUser, logout } = useAuth()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [unreadCount] = useState(3)
  const { hydrating, syncError } = useAdminStore((s) => ({ hydrating: s.hydrating, syncError: s.syncError }))

  const currentUser = user || (authUser ? { name: authUser.name, email: authUser.email, role: authUser.role } : FALLBACK_USER)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const profileMenuItems = [
    {
      label: (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</span>
          <span className="text-[10px] text-slate-400">{currentUser.email}</span>
          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">{prettyRole(currentUser.role)}</span>
        </div>
      ),
      disabled: true,
    },
    { divider: true, label: '' },
    {
      label: 'Users & Admins',
      icon: <User className="h-4 w-4" />,
      onClick: () => navigate('/admin/users'),
    },
    {
      label: 'Website Settings',
      icon: <Settings className="h-4 w-4" />,
      onClick: () => navigate('/admin/settings'),
    },
    { divider: true, label: '' },
    {
      label: 'Sign out',
      icon: <LogOut className="h-4 w-4" />,
      isDestructive: true,
      onClick: () => {
        logout()
        navigate('/admin/login')
      },
    },
  ]

  const notificationItems = [
    {
      label: 'New Bare Act "BNS 2023" published',
      onClick: () => navigate('/admin/laws'),
    },
    {
      label: 'Draft review requested: "Transfer of Property"',
      onClick: () => navigate('/admin/articles'),
    },
    {
      label: 'System backup completed successfully',
      onClick: () => navigate('/admin/backups'),
    },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-18 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-6',
        className
      )}
    >
      {/* Left: Mobile Sidebar Trigger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search legal content, settings, statutes... (⌘K)"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-2 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-amber-500/15 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sync status / refresh */}
        <button
          type="button"
          onClick={() => void adminActions.hydrate()}
          title={syncError ? `Sync issue: ${syncError}. Click to retry.` : 'Refresh admin data'}
          aria-label="Refresh admin data"
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl border transition-colors',
            syncError
              ? 'border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400'
              : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
          )}
        >
          <RefreshCw className={cn('h-4 w-4', hydrating && 'animate-spin')} />
        </button>

        {/* View Public Website */}
        <Link
          to="/categories"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <span>View Website</span>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
        </Link>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label="Toggle theme mode"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <DropdownMenu
          trigger={
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          }
          items={notificationItems}
        />

        {/* User Profile Menu */}
        <DropdownMenu
          trigger={
            <button
              type="button"
              aria-label="User profile menu"
              className="flex items-center gap-2 rounded-2xl border border-slate-200 p-1.5 pr-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-xs shadow-xs">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mt-0.5">
                  {prettyRole(currentUser.role)}
                </span>
              </div>
            </button>
          }
          items={profileMenuItems}
        />
      </div>
    </header>
  )
}
