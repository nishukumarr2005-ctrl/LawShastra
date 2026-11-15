import React, { useMemo, useState } from 'react'
import { ScrollText } from 'lucide-react'
import { useAdminStore } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, SimpleTable, Pill, TextInput } from '@/features/admin/shared/AdminPrimitives'

export const ActivityLogsPage: React.FC = () => {
  const logs = useAdminStore((s) => s.activityLogs)
  const [q, setQ] = useState('')
  const filtered = useMemo(() => logs.filter((l) => `${l.actor} ${l.action} ${l.target}`.toLowerCase().includes(q.toLowerCase())), [logs, q])
  const rows = filtered.map((l) => [new Date(l.createdAt).toLocaleString(), l.actor, l.action, l.target, l.level === 'success' ? <Pill tone="green">Success</Pill> : l.level === 'warning' ? <Pill tone="amber">Warning</Pill> : <Pill tone="blue">Info</Pill>])
  return (
    <PageShell title="Activity Logs" subtitle="Audit trail of administrative actions and system events." icon={<ScrollText className="h-5 w-5 text-amber-500" />}>
      <SectionCard title="Recent Activity" description={`${filtered.length} events`}>
        <TextInput placeholder="Filter logs..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm mb-4" />
        <SimpleTable headers={['Time', 'Actor', 'Action', 'Target', 'Level']} rows={rows} empty="No activity recorded yet." />
      </SectionCard>
    </PageShell>
  )
}
