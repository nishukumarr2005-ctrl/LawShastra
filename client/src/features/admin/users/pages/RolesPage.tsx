import React, { useState } from 'react'
import { ShieldCheck, Plus } from 'lucide-react'
import { adminActions, useAdminStore, type RoleDef } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, SimpleTable, Pill, ActionButton, Field, TextInput, TextArea } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

export const RolesPage: React.FC = () => {
  const roles = useAdminStore((s) => s.roles)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<RoleDef> | null>(null)
  const [permText, setPermText] = useState('')
  const rows = roles.map((r) => [<span key="n" className="font-semibold">{r.name}</span>, r.description || '—', <div key="p" className="flex flex-wrap gap-1">{r.permissions.slice(0, 4).map((p) => <Pill key={p} tone={p === '*' ? 'amber' : 'blue'}>{p}</Pill>)}{r.permissions.length > 4 && <Pill>+{r.permissions.length - 4}</Pill>}</div>, <div key="a" className="flex gap-1"><ActionButton onClick={() => { setEditing(r); setPermText(r.permissions.join(', ')); setOpen(true) }}>Edit</ActionButton><ActionButton tone="danger" onClick={() => { void adminActions.removeRole(r.id) }} disabled={r.name === 'SUPER_ADMIN'}>Delete</ActionButton></div>])
  const save = async () => { if (!editing) return; await adminActions.saveRole({ ...editing, permissions: permText.split(',').map((p) => p.trim()).filter(Boolean) }); setOpen(false); setEditing(null) }
  return (
    <PageShell title="Roles & Permissions" subtitle="Define role-based access control for the admin CMS." icon={<ShieldCheck className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { setEditing({ name: '', description: '', permissions: [] }); setPermText(''); setOpen(true) }}><Plus className="h-4 w-4 mr-2" />Add Role</Button>}>
      <SectionCard title="Roles"><SimpleTable headers={['Role', 'Description', 'Permissions', 'Actions']} rows={rows} /></SectionCard>
      <Dialog isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Role' : 'Add Role'} maxWidth="xl" footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { void save() }}>Save</Button></>}>
        {editing && <div className="grid gap-4"><Field label="Role Name"><TextInput value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value.toUpperCase().replace(/\s+/g, '_') })} /></Field><Field label="Description"><TextArea rows={2} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field><Field label="Permissions" hint="Comma separated, use * for full access (e.g. content.read, content.write, users.manage)"><TextArea rows={3} value={permText} onChange={(e) => setPermText(e.target.value)} /></Field></div>}
      </Dialog>
    </PageShell>
  )
}
