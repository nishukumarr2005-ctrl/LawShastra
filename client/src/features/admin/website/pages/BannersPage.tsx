import React, { useState } from 'react'
import { ImagePlus, Plus } from 'lucide-react'
import { adminActions, useAdminStore, type BannerItem } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, SimpleTable, Pill, ActionButton, Field, TextInput, SelectInput } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

export const BannersPage: React.FC = () => {
  const banners = useAdminStore((s) => s.banners)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<BannerItem> | null>(null)
  const rows = banners.map((b) => [<span key="t" className="font-semibold">{b.title}</span>, b.location, b.link, b.status === 'Active' ? <Pill tone="green">Active</Pill> : b.status === 'Scheduled' ? <Pill tone="amber">Scheduled</Pill> : <Pill>Hidden</Pill>, <div key="a" className="flex gap-1"><ActionButton onClick={() => { setEditing(b); setOpen(true) }}>Edit</ActionButton><ActionButton tone="danger" onClick={() => { void adminActions.removeBanner(b.id) }}>Delete</ActionButton></div>])
  const save = async () => { if (!editing) return; await adminActions.saveBanner(editing); setOpen(false); setEditing(null) }
  return (
    <PageShell title="Banners & Sliders" subtitle="Manage promotional banners and hero sliders." icon={<ImagePlus className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { setEditing({ title: '', location: 'Homepage Top', status: 'Active', link: '/' }); setOpen(true) }}><Plus className="h-4 w-4 mr-2" />Add Banner</Button>}>
      <SectionCard title="Banners"><SimpleTable headers={['Title', 'Location', 'Link', 'Status', 'Actions']} rows={rows} /></SectionCard>
      <Dialog isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Banner' : 'Add Banner'} footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { void save() }}>Save</Button></>}>
        {editing && <div className="grid gap-4"><Field label="Title"><TextInput value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field><Field label="Location"><TextInput value={editing.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></Field><Field label="Link"><TextInput value={editing.link || ''} onChange={(e) => setEditing({ ...editing, link: e.target.value })} /></Field><Field label="Status"><SelectInput value={editing.status || 'Active'} onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}><option>Active</option><option>Scheduled</option><option>Hidden</option></SelectInput></Field></div>}
      </Dialog>
    </PageShell>
  )
}
