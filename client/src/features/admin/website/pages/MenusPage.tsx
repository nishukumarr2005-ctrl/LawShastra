import React, { useState } from 'react'
import { Compass, Plus } from 'lucide-react'
import { adminActions, useAdminStore, type MenuItem } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, SimpleTable, Pill, ActionButton, Field, TextInput, SelectInput } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'

export const MenusPage: React.FC = () => {
  const menus = useAdminStore((s) => [...s.menus].sort((a, b) => a.order - b.order))
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<MenuItem> | null>(null)
  const rows = menus.map((m) => [String(m.order), <span key="l" className="font-semibold">{m.label}</span>, m.path, m.location, m.visible ? <Pill tone="green">Visible</Pill> : <Pill>Hidden</Pill>, <div key="a" className="flex gap-1"><ActionButton onClick={() => { setEditing(m); setOpen(true) }}>Edit</ActionButton><ActionButton tone="danger" onClick={() => { void adminActions.removeMenu(m.id) }}>Delete</ActionButton></div>])
  const save = async () => { if (!editing) return; await adminActions.saveMenu({ ...editing, order: Number(editing.order || 1) }); setOpen(false); setEditing(null) }
  return (
    <PageShell title="Navigation Menus" subtitle="Configure header, footer, and sidebar navigation items." icon={<Compass className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { setEditing({ label: '', path: '/', location: 'Header', visible: true, order: menus.length + 1 }); setOpen(true) }}><Plus className="h-4 w-4 mr-2" />Add Item</Button>}>
      <SectionCard title="Menu Items"><SimpleTable headers={['Order', 'Label', 'Path', 'Location', 'Visibility', 'Actions']} rows={rows} /></SectionCard>
      <Dialog isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Menu Item' : 'Add Menu Item'} footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { void save() }}>Save</Button></>}>
        {editing && <div className="grid gap-4 sm:grid-cols-2"><Field label="Label"><TextInput value={editing.label || ''} onChange={(e) => setEditing({ ...editing, label: e.target.value })} /></Field><Field label="Path"><TextInput value={editing.path || ''} onChange={(e) => setEditing({ ...editing, path: e.target.value })} /></Field><Field label="Location"><SelectInput value={editing.location || 'Header'} onChange={(e) => setEditing({ ...editing, location: e.target.value as any })}><option>Header</option><option>Footer</option><option>Sidebar</option></SelectInput></Field><Field label="Order"><TextInput type="number" min={1} value={editing.order ?? 1} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field><div className="sm:col-span-2 flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800"><span className="text-sm font-medium">Visible</span><Switch checked={!!editing.visible} onCheckedChange={(v) => setEditing({ ...editing, visible: v })} /></div></div>}
      </Dialog>
    </PageShell>
  )
}
