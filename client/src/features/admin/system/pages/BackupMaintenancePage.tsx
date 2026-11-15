import React from 'react'
import { Database, Play } from 'lucide-react'
import { adminActions, useAdminStore } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, SimpleTable, Pill, ActionButton } from '@/features/admin/shared/AdminPrimitives'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'

export const BackupMaintenancePage: React.FC = () => {
  const { backups, maintenance } = useAdminStore((s) => ({ backups: s.backups, maintenance: s.maintenance }))
  const backupRows = backups.map((b) => [b.label, new Date(b.createdAt).toLocaleString(), b.size, b.status === 'Completed' ? <Pill tone="green">Completed</Pill> : b.status === 'Running' ? <Pill tone="amber">Running</Pill> : <Pill tone="rose">Failed</Pill>])
  const maintRows = maintenance.map((m) => [<span key="n" className="font-semibold">{m.name}</span>, m.schedule, new Date(m.lastRun).toLocaleString(), <Switch key="s" checked={m.enabled} onCheckedChange={() => adminActions.toggleMaintenance(m.id)} aria-label={m.name} />, <ActionButton key="a" onClick={() => { void adminActions.runMaintenance(m.id) }}><Play className="h-3.5 w-3.5 inline mr-1" />Run</ActionButton>])
  return (
    <PageShell title="Backup & Maintenance" subtitle="Manage backups, scheduled tasks, and operational maintenance." icon={<Database className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { void adminActions.runBackup() }}><Database className="h-4 w-4 mr-2" />Run Backup</Button>}>
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Backups" description="Recent backup snapshots"><SimpleTable headers={['Label', 'Created', 'Size', 'Status']} rows={backupRows} /></SectionCard>
        <SectionCard title="Maintenance Tasks" description="Scheduled and on-demand tasks"><SimpleTable headers={['Task', 'Schedule', 'Last Run', 'Enabled', 'Actions']} rows={maintRows} /></SectionCard>
      </div>
    </PageShell>
  )
}
