import React, { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { adminActions, useAdminStore, type SeoEntry } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, SimpleTable, Pill, ActionButton, Field, TextInput, TextArea } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'

export const SeoPage: React.FC = () => {
  const entries = useAdminStore((s) => s.seoEntries)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<SeoEntry> | null>(null)
  const rows = entries.map((e) => [<span key="p" className="font-mono text-xs">{e.path}</span>, <div key="t"><div className="font-semibold">{e.title}</div><div className="text-xs text-slate-400 line-clamp-1">{e.description}</div></div>, e.noindex ? <Pill tone="rose">Noindex</Pill> : <Pill tone="green">Index</Pill>, <div key="a" className="flex gap-1"><ActionButton onClick={() => { setEditing(e); setOpen(true) }}>Edit</ActionButton><ActionButton tone="danger" onClick={() => { void adminActions.removeSeo(e.id) }}>Delete</ActionButton></div>])
  const save = async () => { if (!editing) return; await adminActions.saveSeo(editing); setOpen(false); setEditing(null) }
  return (
    <PageShell title="SEO Management" subtitle="Configure metadata, indexing rules, and page-level SEO." icon={<Search className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { setEditing({ path: '/', title: '', description: '', noindex: false }); setOpen(true) }}><Plus className="h-4 w-4 mr-2" />Add Entry</Button>}>
      <SectionCard title="SEO Entries"><SimpleTable headers={['Path', 'Meta', 'Indexing', 'Actions']} rows={rows} /></SectionCard>
      <Dialog isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit SEO Entry' : 'Add SEO Entry'} maxWidth="xl" footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { void save() }}>Save</Button></>}>
        {editing && <div className="grid gap-4"><Field label="Path"><TextInput value={editing.path || ''} onChange={(e) => setEditing({ ...editing, path: e.target.value })} placeholder="/example" /></Field><Field label="Meta Title"><TextInput value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field><Field label="Meta Description"><TextArea rows={3} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field><div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800"><span className="text-sm font-medium">Noindex</span><Switch checked={!!editing.noindex} onCheckedChange={(v) => setEditing({ ...editing, noindex: v })} /></div></div>}
      </Dialog>
    </PageShell>
  )
}
