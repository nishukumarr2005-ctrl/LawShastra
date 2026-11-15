import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Scale,
  LayoutDashboard,
  BarChart3,
  FolderTree,
  FileText,
  BookOpen,
  Image as ImageIcon,
  Tag,
  LayoutTemplate,
  ImagePlus,
  Compass,
  Eye,
  Search,
  Users,
  ShieldCheck,
  Flag,
  Settings,
  ScrollText,
  Bell,
  Database,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/utils/cn'

export interface AdminSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  className?: string
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface NavGroup {
  group: string
  items: NavItem[]
}

export const adminNavigationGroups: NavGroup[] = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    group: 'Content Management',
    items: [
      { label: 'Categories & Subcategories', href: '/admin/categories', icon: FolderTree },
      { label: 'Articles / Posts', href: '/admin/articles', icon: FileText, badge: 'CMS' },
      { label: 'Legal Resources', href: '/admin/laws', icon: BookOpen },
      { label: 'Pages Management', href: '/admin/pages', icon: FileText },
      { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
      { label: 'Tags & Keywords', href: '/admin/tags', icon: Tag },
    ],
  },
  {
    group: 'Website Management',
    items: [
      { label: 'Homepage Builder', href: '/admin/homepage-builder', icon: LayoutTemplate },
      { label: 'Banners & Sliders', href: '/admin/banners', icon: ImagePlus },
      { label: 'Navigation Menus', href: '/admin/menus', icon: Compass },
      { label: 'Visibility & Display Controls', href: '/admin/visibility', icon: Eye, badge: 'Key' },
      { label: 'SEO Management', href: '/admin/seo', icon: Search },
    ],
  },
  {
    group: 'User Management',
    items: [
      { label: 'Users & Admins', href: '/admin/users', icon: Users },
      { label: 'Roles & Permissions', href: '/admin/roles', icon: ShieldCheck },
    ],
  },
  {
    group: 'System',
    items: [
      { label: 'Feature Flags', href: '/admin/feature-flags', icon: Flag },
      { label: 'Website Settings', href: '/admin/settings', icon: Settings },
      { label: 'Activity Logs', href: '/admin/audit-logs', icon: ScrollText },
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
      { label: 'Backup & Maintenance', href: '/admin/backups', icon: Database },
    ],
  },
]

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggle,
  className,
}) => {
  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-slate-800 bg-[#0F172A] text-slate-300 transition-all duration-300 select-none z-30',
        isCollapsed ? 'w-20' : 'w-72',
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-18 items-center justify-between border-b border-slate-800 px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-md shadow-amber-500/20">
            <Scale className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-base font-black tracking-tight text-white">LAW SHASTRA</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Admin CMS
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Group List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {adminNavigationGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            {!isCollapsed ? (
              <h4 className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                {group.group}
              </h4>
            ) : (
              <div className="h-2" />
            )}

            {group.items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/admin'}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-400 border border-amber-500/30'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                    )
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[9px] font-extrabold text-amber-300">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="border-t border-slate-800 p-4">
        {!isCollapsed ? (
          <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-2.5 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-slate-300">CMS Online</span>
            </div>
            <span className="text-[10px] text-slate-500">v2.0</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>
    </aside>
  )
}
