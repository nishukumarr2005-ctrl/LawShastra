import React, { useState } from 'react'
import { Users, Plus } from 'lucide-react'
import { adminActions, useAdminStore, type AdminUser } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, SimpleTable, Pill, ActionButton, Field, TextInput, SelectInput } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

export const UsersPage: React.FC = () => {
  const { users, roles } = useAdminStore((s) => ({ users: s.users, roles: s.roles }))
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<AdminUser> | null>(null)
  const rows = users.map((u) => [<div key="n"><div className="font-semibold">{u.name}</div><div className="text-xs text-slate-400">{u.email}</div></div>, u.role, u.status === 'Active' ? <Pill tone="green">Active</Pill> : u.status === 'Invited' ? <Pill tone="amber">Invited</Pill> : <Pill tone="rose">Disabled</Pill>, new Date(u.lastActive).toLocaleString(), <div key="a" className="flex gap-1"><ActionButton onClick={() => { setEditing(u); setOpen(true) }}>Edit</ActionButton><ActionButton tone="danger" onClick={() => { void adminActions.removeUser(u.id) }}>Remove</ActionButton></div>])
  const save = async () => { if (!editing) return; await adminActions.saveUser(editing); setOpen(false); setEditing(null) }
  return (
    <PageShell title="Users & Admins" subtitle="Manage administrative users and access status." icon={<Users className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { setEditing({ name: '', email: '', role: roles[0]?.name || 'VIEWER', status: 'Invited', lastActive: new Date().toISOString() }); setOpen(true) }}><Plus className="h-4 w-4 mr-2" />Add User</Button>}>
      <SectionCard title="Team Members"><SimpleTable headers={['User', 'Role', 'Status', 'Last Active', 'Actions']} rows={rows} /></SectionCard>
      <Dialog isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit User' : 'Add User'} footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { void save() }}>Save</Button></>}>
        {editing && <div className="grid gap-4"><Field label="Name"><TextInput value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field><Field label="Email"><TextInput type="email" value={editing.email || ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></Field><Field label="Role"><SelectInput value={editing.role || ''} onChange={(e) => setEditing({ ...editing, role: e.target.value })}>{roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}</SelectInput></Field><Field label="Status"><SelectInput value={editing.status || 'Invited'} onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}><option>Active</option><option>Invited</option><option>Disabled</option></SelectInput></Field></div>}
      </Dialog>
    </PageShell>
  )
}
