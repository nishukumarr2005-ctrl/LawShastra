import React, { useMemo, useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import { adminActions, useAdminStore, type AdminPage } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, Toolbar, TextInput, SelectInput, SimpleTable, Pill, ActionButton, Field } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

const empty = (): Partial<AdminPage> => ({ title: '', slug: '', status: 'Draft', template: 'Standard' })

export const PagesManagementPage: React.FC = () => {
  const pages = useAdminStore((s) => s.pages)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<AdminPage> | null>(null)
  const filtered = useMemo(() => pages.filter((p) => `${p.title} ${p.slug}`.toLowerCase().includes(q.toLowerCase())), [pages, q])
  const rows = filtered.map((p) => [<div key="t"><div className="font-semibold">{p.title}</div><div className="text-xs text-slate-400">/{p.slug}</div></div>, p.template, p.status === 'Published' ? <Pill tone="green">Published</Pill> : p.status === 'Review' ? <Pill tone="amber">Review</Pill> : <Pill>Draft</Pill>, <div key="a" className="flex gap-1"><ActionButton onClick={() => { setEditing(p); setOpen(true) }}>Edit</ActionButton><ActionButton tone="danger" onClick={() => { void adminActions.removePage(p.id) }}>Delete</ActionButton></div>])
  const save = async () => { if (!editing) return; await adminActions.savePage(editing); setOpen(false); setEditing(null) }

  return (
    <PageShell title="Pages Management" subtitle="Manage static and CMS-driven website pages." icon={<FileText className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { setEditing(empty()); setOpen(true) }}><Plus className="h-4 w-4 mr-2" />New Page</Button>}>
      <SectionCard title="Website Pages">
        <Toolbar left={<TextInput placeholder="Search pages..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />} />
        <div className="mt-4"><SimpleTable headers={['Page', 'Template', 'Status', 'Actions']} rows={rows} /></div>
      </SectionCard>
      <Dialog isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Page' : 'New Page'} footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { void save() }}>Save</Button></>}>
        {editing && <div className="grid gap-4">
          <Field label="Title"><TextInput value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
          <Field label="Slug"><TextInput value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
          <Field label="Template"><SelectInput value={editing.template || 'Standard'} onChange={(e) => setEditing({ ...editing, template: e.target.value })}><option>Standard</option><option>Legal</option><option>Contact</option><option>Landing</option></SelectInput></Field>
          <Field label="Status"><SelectInput value={editing.status || 'Draft'} onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}><option>Draft</option><option>Review</option><option>Published</option></SelectInput></Field>
        </div>}
      </Dialog>
    </PageShell>
  )
}
