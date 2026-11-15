import React, { useState } from 'react'
import { LayoutTemplate, Plus } from 'lucide-react'
import { adminActions, useAdminStore, type HomepageBlock } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, SimpleTable, Pill, ActionButton, Field, TextInput, SelectInput } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'

export const HomepageBuilderPage: React.FC = () => {
  const blocks = useAdminStore((s) => [...s.homepageBlocks].sort((a, b) => a.order - b.order))
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<HomepageBlock> | null>(null)
  const rows = blocks.map((b) => [String(b.order), <span key="t" className="font-semibold">{b.title}</span>, b.type, b.enabled ? <Pill tone="green">Enabled</Pill> : <Pill>Hidden</Pill>, <div key="a" className="flex gap-1"><ActionButton onClick={() => { void adminActions.saveHomepageBlock({ ...b, enabled: !b.enabled }) }}>{b.enabled ? 'Disable' : 'Enable'}</ActionButton><ActionButton onClick={() => { setEditing(b); setOpen(true) }}>Edit</ActionButton><ActionButton tone="danger" onClick={() => { void adminActions.removeHomepageBlock(b.id) }}>Delete</ActionButton></div>])
  const save = async () => { if (!editing) return; await adminActions.saveHomepageBlock({ ...editing, order: Number(editing.order || 1) }); setOpen(false); setEditing(null) }
  return (
    <PageShell title="Homepage Builder" subtitle="Compose and order homepage sections without code changes." icon={<LayoutTemplate className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { setEditing({ title: '', type: 'Custom', enabled: true, order: blocks.length + 1 }); setOpen(true) }}><Plus className="h-4 w-4 mr-2" />Add Block</Button>}>
      <SectionCard title="Homepage Blocks" description="Control visibility and ordering of homepage components">
        <SimpleTable headers={['Order', 'Block', 'Type', 'Status', 'Actions']} rows={rows} />
      </SectionCard>
      <Dialog isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Block' : 'Add Block'} footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { void save() }}>Save</Button></>}>
        {editing && <div className="grid gap-4">
          <Field label="Title"><TextInput value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
          <Field label="Type"><SelectInput value={editing.type || 'Custom'} onChange={(e) => setEditing({ ...editing, type: e.target.value })}><option>Hero</option><option>Collection</option><option>Testimonials</option><option>CTA</option><option>Custom</option></SelectInput></Field>
          <Field label="Order"><TextInput type="number" min={1} value={editing.order ?? 1} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800"><span className="text-sm font-medium">Enabled</span><Switch checked={!!editing.enabled} onCheckedChange={(v) => setEditing({ ...editing, enabled: v })} /></div>
        </div>}
      </Dialog>
    </PageShell>
  )
}
