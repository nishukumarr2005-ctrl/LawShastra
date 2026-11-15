import React, { useState } from 'react'
import { Flag, Plus } from 'lucide-react'
import { adminActions, useAdminStore, type FeatureFlag } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, SimpleTable, ActionButton, Field, TextInput, TextArea } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'

export const FeatureFlagsPage: React.FC = () => {
  const flags = useAdminStore((s) => s.featureFlags)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<FeatureFlag> | null>(null)
  const rows = flags.map((f) => [<div key="k"><div className="font-semibold">{f.label}</div><div className="text-xs font-mono text-slate-400">{f.key}</div></div>, f.description, <Switch key="s" checked={f.enabled} onCheckedChange={() => adminActions.toggleFlag(f.id)} aria-label={f.label} />, <div key="a" className="flex gap-1"><ActionButton onClick={() => { setEditing(f); setOpen(true) }}>Edit</ActionButton><ActionButton tone="danger" onClick={() => { void adminActions.removeFlag(f.id) }}>Delete</ActionButton></div>])
  const save = async () => { if (!editing) return; await adminActions.saveFlag(editing); setOpen(false); setEditing(null) }
  return (
    <PageShell title="Feature Flags" subtitle="Toggle and manage feature rollouts across the platform." icon={<Flag className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { setEditing({ key: '', label: '', enabled: false, description: '' }); setOpen(true) }}><Plus className="h-4 w-4 mr-2" />Add Flag</Button>}>
      <SectionCard title="Flags"><SimpleTable headers={['Flag', 'Description', 'Enabled', 'Actions']} rows={rows} /></SectionCard>
      <Dialog isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Flag' : 'Add Flag'} footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { void save() }}>Save</Button></>}>
        {editing && <div className="grid gap-4"><Field label="Label"><TextInput value={editing.label || ''} onChange={(e) => setEditing({ ...editing, label: e.target.value })} /></Field><Field label="Key"><TextInput value={editing.key || ''} onChange={(e) => setEditing({ ...editing, key: e.target.value.replace(/\s+/g, '-').toLowerCase() })} /></Field><Field label="Description"><TextArea rows={2} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field></div>}
      </Dialog>
    </PageShell>
  )
}
