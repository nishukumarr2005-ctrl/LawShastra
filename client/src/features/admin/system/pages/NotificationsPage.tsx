import React, { useState } from 'react'
import { Bell, Plus } from 'lucide-react'
import { adminActions, useAdminStore } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, SimpleTable, Pill, ActionButton, Field, TextInput, TextArea, SelectInput } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

export const NotificationsPage: React.FC = () => {
  const notifications = useAdminStore((s) => s.notifications)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ title: '', message: '', channel: 'In-App' as 'In-App' | 'Email' })
  const rows = notifications.map((n) => [<div key="t"><div className="font-semibold">{n.title}</div><div className="text-xs text-slate-500">{n.message}</div></div>, n.channel, n.read ? <Pill>Read</Pill> : <Pill tone="amber">Unread</Pill>, new Date(n.createdAt).toLocaleString(), <ActionButton key="a" onClick={() => { void adminActions.markNotificationRead(n.id) }} disabled={n.read}>Mark read</ActionButton>])
  const send = async () => { if (!draft.title) return; await adminActions.addNotification(draft); setOpen(false); setDraft({ title: '', message: '', channel: 'In-App' }) }
  return (
    <PageShell title="Notifications" subtitle="System and admin notifications center." icon={<Bell className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />New Notification</Button>}>
      <SectionCard title="Inbox" description={`${notifications.filter((n) => !n.read).length} unread`}>
        <SimpleTable headers={['Notification', 'Channel', 'Status', 'Time', 'Actions']} rows={rows} />
      </SectionCard>
      <Dialog isOpen={open} onClose={() => setOpen(false)} title="Create Notification" footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { void send() }}>Send</Button></>}>
        <div className="grid gap-4"><Field label="Title"><TextInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field><Field label="Message"><TextArea rows={3} value={draft.message} onChange={(e) => setDraft({ ...draft, message: e.target.value })} /></Field><Field label="Channel"><SelectInput value={draft.channel} onChange={(e) => setDraft({ ...draft, channel: e.target.value as any })}><option>In-App</option><option>Email</option></SelectInput></Field></div>
      </Dialog>
    </PageShell>
  )
}
