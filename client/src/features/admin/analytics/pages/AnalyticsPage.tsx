import React from 'react'
import { BarChart3, TrendingUp, Eye, Clock } from 'lucide-react'
import { useAdminStore } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, StatGrid, SimpleTable, Pill } from '@/features/admin/shared/AdminPrimitives'

export const AnalyticsPage: React.FC = () => {
  const { categories, articles, legalResources, activityLogs } = useAdminStore((s) => ({
    categories: s.categories,
    articles: s.articles,
    legalResources: s.legalResources,
    activityLogs: s.activityLogs,
  }))

  const published = articles.filter((a) => a.status === 'Published').length
  const liveResources = legalResources.filter((r) => r.status === 'Published').length

  const topCategories = [...categories]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((c) => [c.name, String(c.count), c.status === 'Live' ? <Pill tone="green">Live</Pill> : <Pill>Draft</Pill>, c.featured ? <Pill tone="amber">Featured</Pill> : '—'])

  return (
    <PageShell
      title="Analytics"
      subtitle="Content performance, publishing health, and usage overview."
      icon={<BarChart3 className="h-5 w-5 text-amber-500" />}
    >
      <StatGrid
        items={[
          { label: 'Total Categories', value: categories.length },
          { label: 'Published Articles', value: published },
          { label: 'Live Legal Resources', value: liveResources },
          { label: 'Recent Events', value: activityLogs.length },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Top Categories" description="By linked content volume" className="lg:col-span-2">
          <SimpleTable headers={['Category', 'Items', 'Status', 'Highlight']} rows={topCategories} empty="No categories yet." />
        </SectionCard>

        <SectionCard title="Health Snapshot" description="Quick operational indicators">
          <ul className="space-y-4 text-sm">
            <li className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><TrendingUp className="h-4 w-4 text-emerald-500" />Publish rate</span><strong>{articles.length ? Math.round((published / articles.length) * 100) : 0}%</strong></li>
            <li className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Eye className="h-4 w-4 text-blue-500" />Visible categories</span><strong>{categories.filter((c) => c.status === 'Live').length}</strong></li>
            <li className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Clock className="h-4 w-4 text-amber-500" />In review</span><strong>{articles.filter((a) => a.status === 'Review').length + legalResources.filter((r) => r.status === 'Review').length}</strong></li>
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Engagement Notes" description="Derived from current admin data (connect analytics provider for live traffic)">
        <div className="grid gap-4 sm:grid-cols-3 text-sm">
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs uppercase tracking-wider text-slate-500">Content Coverage</p>
            <p className="mt-2 text-2xl font-bold">{categories.length + legalResources.length}</p>
            <p className="mt-1 text-slate-500">Total managed entities</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs uppercase tracking-wider text-slate-500">Draft Backlog</p>
            <p className="mt-2 text-2xl font-bold">{articles.filter((a) => a.status === 'Draft').length + legalResources.filter((r) => r.status === 'Draft').length}</p>
            <p className="mt-1 text-slate-500">Items awaiting publish</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs uppercase tracking-wider text-slate-500">Audit Trail</p>
            <p className="mt-2 text-2xl font-bold">{Math.min(activityLogs.length, 200)}</p>
            <p className="mt-1 text-slate-500">Recorded admin actions</p>
          </div>
        </div>
      </SectionCard>
    </PageShell>
  )
}
