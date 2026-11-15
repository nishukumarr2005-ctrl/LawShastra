import React, { useMemo, useState } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { adminActions, useAdminStore, type AdminLegalResource } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, Toolbar, TextInput, SelectInput, SimpleTable, Pill, ActionButton, Field, TextArea } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

const empty = (): Partial<AdminLegalResource> => ({ title: '', category: 'Civil Law', jurisdiction: 'India', status: 'Draft', summary: '' })

export const LegalResourcesPage: React.FC = () => {
  const resources = useAdminStore((s) => s.legalResources)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<AdminLegalResource> | null>(null)

  const filtered = useMemo(() => resources.filter((r) => `${r.title} ${r.category} ${r.jurisdiction}`.toLowerCase().includes(q.toLowerCase())), [resources, q])
  const rows = filtered.map((r) => [
    <div key="t"><div className="font-semibold">{r.title}</div><div className="text-xs text-slate-400">{r.jurisdiction}</div></div>,
    r.category,
    r.status === 'Published' ? <Pill tone="green">Published</Pill> : r.status === 'Review' ? <Pill tone="amber">Review</Pill> : <Pill>Draft</Pill>,
    <div key="a" className="flex gap-1"><ActionButton onClick={() => { setEditing(r); setOpen(true) }}>Edit</ActionButton><ActionButton tone="danger" onClick={() => { void adminActions.removeLegalResource(r.id) }}>Delete</ActionButton></div>,
  ])

  const save = async () => { if (!editing) return; await adminActions.saveLegalResource(editing); setOpen(false); setEditing(null) }

  return (
    <PageShell title="Legal Resources" subtitle="Manage bare acts, statutes, and legal reference materials." icon={<BookOpen className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { setEditing(empty()); setOpen(true) }}><Plus className="h-4 w-4 mr-2" />Add Resource</Button>}>
      <SectionCard title="Resources Library" description={`${filtered.length} resources`}>
        <Toolbar left={<TextInput placeholder="Search resources..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />} />
        <div className="mt-4"><SimpleTable headers={['Title', 'Category', 'Status', 'Actions']} rows={rows} /></div>
      </SectionCard>
      <Dialog isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Legal Resource' : 'Add Legal Resource'} maxWidth="2xl" footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { void save() }}>Save</Button></>}>
        {editing && <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" className="sm:col-span-2"><TextInput value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
          <Field label="Category"><SelectInput value={editing.category || 'Civil Law'} onChange={(e) => setEditing({ ...editing, category: e.target.value })}><option>Civil Law</option><option>Criminal Law</option><option>Constitutional Law</option><option>Banking Law</option><option>Commercial Law</option><option>Other Laws</option></SelectInput></Field>
          <Field label="Jurisdiction"><TextInput value={editing.jurisdiction || ''} onChange={(e) => setEditing({ ...editing, jurisdiction: e.target.value })} /></Field>
          <Field label="Status"><SelectInput value={editing.status || 'Draft'} onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}><option>Draft</option><option>Review</option><option>Published</option></SelectInput></Field>
          <Field label="Summary" className="sm:col-span-2"><TextArea rows={4} value={editing.summary || ''} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></Field>
        </div>}
      </Dialog>
    </PageShell>
  )
}
