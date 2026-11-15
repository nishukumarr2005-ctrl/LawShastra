import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/admin/auth/AuthContext'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-amber-500 border-t-transparent" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Verifying Security Session...
          </span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Access Denied (403)</h2>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Your assigned role does not possess the required permission (
          <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-rose-600 dark:bg-slate-800">
            {requiredPermission}
          </code>
          ) to view or manage this administrative resource.
        </p>
        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
