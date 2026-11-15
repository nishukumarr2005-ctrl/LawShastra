import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminBreadcrumb } from './AdminBreadcrumb'
import { ToastProvider } from '@/components/ui/Toast'
import { cn } from '@/utils/cn'
import { adminActions } from '@/features/admin/shared/adminStore'

export interface AdminLayoutProps {
  children?: React.ReactNode
  className?: string
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, className }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    void adminActions.hydrate()
  }, [])

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <AdminSidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Mobile Sidebar with backdrop */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative z-10 flex">
              <AdminSidebar
                isCollapsed={false}
                onToggle={() => setIsMobileSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0">
          <AdminHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />

          <main className={cn('flex-1 w-full', className)}>
            <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 max-w-7xl mx-auto">
              <AdminBreadcrumb />
            </div>
            {children ?? <Outlet />}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
