import React from 'react'
import { Link } from 'react-router-dom'
import {
  FolderOpen,
  BookOpen,
  FileText,
  Users,
  TrendingUp,
  Eye,
  ArrowRight,
  Activity,
  LayoutDashboard,
  Image as ImageIcon,
  Bell,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAdminStore } from '@/features/admin/shared/adminStore'

const MetricCard: React.FC<{
  label: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  color: string
  note: string
}> = ({ label, value, icon: Icon, color, note }) => (
  <Card className="hover:shadow-md transition-shadow duration-200">
    <CardContent className="pt-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-100">{value}</p>
          <p className="mt-1 text-xs font-medium text-slate-400">{note}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
)

const QuickAction: React.FC<{
  to: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  external?: boolean
}> = ({ to, label, description, icon: Icon, external }) => {
  const cls =
    'group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-amber-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-700'
  const inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-amber-50 dark:bg-slate-800 dark:group-hover:bg-amber-900/30 transition-colors">
        <Icon className="h-5 w-5 text-slate-600 group-hover:text-amber-600 dark:text-slate-400 dark:group-hover:text-amber-400 transition-colors" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
    </>
  )
  return external ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <Link to={to} className={cls}>{inner}</Link>
  )
}

export const AdminOverviewPage: React.FC = () => {
  const { categories, legalResources, articles, users, activityLogs, notifications, syncError } = useAdminStore((s) => ({
    categories: s.categories,
    legalResources: s.legalResources,
    articles: s.articles,
    users: s.users,
    activityLogs: s.activityLogs,
    notifications: s.notifications,
    syncError: s.syncError,
  }))

  const published = legalResources.filter((r) => r.status === 'Published').length
  const unread = notifications.filter((n) => !n.read).length

  const cards = [
    { label: 'Total Categories', value: categories.length, icon: FolderOpen, color: 'bg-blue-500', note: 'Active taxonomy' },
    { label: 'Total Bare Acts', value: legalResources.length, icon: BookOpen, color: 'bg-violet-500', note: 'Legal resources' },
    { label: 'Published Statutes', value: published, icon: FileText, color: 'bg-emerald-500', note: 'Live resources' },
    { label: 'Admin Users', value: users.length, icon: Users, color: 'bg-amber-500', note: 'Team members' },
  ]

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard className="h-5 w-5 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Admin Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage and monitor all LawShastra content from one place.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={syncError ? 'orange' : 'emerald'} className="text-xs">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current inline-block" />
            {syncError ? 'Local Mode' : 'System Online'}
          </Badge>
          {unread > 0 && (
            <Link to="/admin/notifications" className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              <Bell className="h-3.5 w-3.5" /> {unread} unread
            </Link>
          )}
        </div>
      </div>

      {syncError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          Backend sync unavailable ({syncError}). Showing local/admin store data; edits still work in this session.
        </div>
      )}

      <section aria-label="Metrics">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => <MetricCard key={c.label} {...c} />)}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section aria-label="Quick actions" className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump to common management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuickAction to="/admin/categories" label="Categories & Subcategories" description="Organise legal taxonomy" icon={FolderOpen} />
              <QuickAction to="/admin/articles" label="Articles / Posts" description="Create and publish content" icon={FileText} />
              <QuickAction to="/admin/laws" label="Legal Resources" description="Manage bare acts and statutes" icon={BookOpen} />
              <QuickAction to="/admin/media" label="Media Library" description="Upload images and documents" icon={ImageIcon} />
              <QuickAction to="/admin/seo" label="SEO Management" description="Configure metadata and indexing" icon={TrendingUp} />
              <QuickAction to="/categories" label="View Website" description="Open public LawShastra website" icon={Eye} external />
            </CardContent>
          </Card>
        </section>

        <section aria-label="Recent activity" className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest admin actions across modules</CardDescription>
            </CardHeader>
            <CardContent>
              {activityLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity className="h-10 w-10 text-slate-200 dark:text-slate-700 mb-3" />
                  <p className="text-sm font-medium text-slate-500">No recent activity</p>
                  <p className="text-xs text-slate-400 mt-1">Actions will appear here as you manage content.</p>
                </div>
              ) : (
                activityLogs.slice(0, 8).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/30">
                      <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{item.action}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.target}</p>
                    </div>
                    <time className="shrink-0 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</time>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Content Snapshot</CardTitle>
              <CardDescription>Current publishing state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3 text-sm">
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"><p className="text-slate-500">Articles</p><p className="text-xl font-bold">{articles.length}</p></div>
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"><p className="text-slate-500">Published Resources</p><p className="text-xl font-bold">{published}</p></div>
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"><p className="text-slate-500">Live Categories</p><p className="text-xl font-bold">{categories.filter((c) => c.status === 'Live').length}</p></div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default AdminOverviewPage
