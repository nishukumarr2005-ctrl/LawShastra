import React, { useState } from 'react'
import { Eye, Plus } from 'lucide-react'
import { adminActions, useAdminStore, type VisibilityRule } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, SimpleTable, Pill, ActionButton, Field, TextInput } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'

export const VisibilityPage: React.FC = () => {
  const rules = useAdminStore((s) => s.visibilityRules)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<VisibilityRule> | null>(null)
  const mark = (v: boolean) => v ? <Pill tone="green">On</Pill> : <Pill>Off</Pill>
  const rows = rules.map((r) => [<span key="c" className="font-semibold">{r.component}</span>, mark(r.desktop), mark(r.tablet), mark(r.mobile), r.note || '—', <div key="a" className="flex gap-1"><ActionButton onClick={() => { setEditing(r); setOpen(true) }}>Edit</ActionButton><ActionButton tone="danger" onClick={() => { void adminActions.removeVisibility(r.id) }}>Delete</ActionButton></div>])
  const save = async () => { if (!editing) return; await adminActions.saveVisibility(editing); setOpen(false); setEditing(null) }
  return (
    <PageShell title="Visibility & Display Controls" subtitle="Control component visibility across desktop, tablet, and mobile." icon={<Eye className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { setEditing({ component: '', desktop: true, tablet: true, mobile: true, note: '' }); setOpen(true) }}><Plus className="h-4 w-4 mr-2" />Add Rule</Button>}>
      <SectionCard title="Display Rules"><SimpleTable headers={['Component', 'Desktop', 'Tablet', 'Mobile', 'Note', 'Actions']} rows={rows} /></SectionCard>
      <Dialog isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Rule' : 'Add Rule'} footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { void save() }}>Save</Button></>}>
        {editing && <div className="grid gap-4"><Field label="Component"><TextInput value={editing.component || ''} onChange={(e) => setEditing({ ...editing, component: e.target.value })} /></Field><Field label="Note"><TextInput value={editing.note || ''} onChange={(e) => setEditing({ ...editing, note: e.target.value })} /></Field>{(['desktop','tablet','mobile'] as const).map((k) => <div key={k} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800"><span className="text-sm font-medium capitalize">{k}</span><Switch checked={!!editing[k]} onCheckedChange={(v) => setEditing({ ...editing, [k]: v })} /></div>)}</div>}
      </Dialog>
    </PageShell>
  )
}
