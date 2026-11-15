import React, { useState } from 'react'
import { Tag, Plus } from 'lucide-react'
import { adminActions, useAdminStore, type AdminTag } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, SimpleTable, ActionButton, Field, TextInput } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

export const TagsPage: React.FC = () => {
  const tags = useAdminStore((s) => s.tags)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<AdminTag> | null>(null)
  const rows = tags.map((t) => [<span key="n" className="font-semibold">{t.name}</span>, t.slug, String(t.usage), <div key="a" className="flex gap-1"><ActionButton onClick={() => { setEditing(t); setOpen(true) }}>Edit</ActionButton><ActionButton tone="danger" onClick={() => { void adminActions.removeTag(t.id) }}>Delete</ActionButton></div>])
  const save = async () => { if (!editing) return; await adminActions.saveTag(editing); setOpen(false); setEditing(null) }

  return (
    <PageShell title="Tags & Keywords" subtitle="Manage taxonomy used for articles and legal resources." icon={<Tag className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { setEditing({ name: '', slug: '', usage: 0 }); setOpen(true) }}><Plus className="h-4 w-4 mr-2" />Add Tag</Button>}>
      <SectionCard title="Tag Library"><SimpleTable headers={['Name', 'Slug', 'Usage', 'Actions']} rows={rows} /></SectionCard>
      <Dialog isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Tag' : 'Add Tag'} footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { void save() }}>Save</Button></>}>
        {editing && <div className="grid gap-4"><Field label="Name"><TextInput value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field><Field label="Slug"><TextInput value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field></div>}
      </Dialog>
    </PageShell>
  )
}
