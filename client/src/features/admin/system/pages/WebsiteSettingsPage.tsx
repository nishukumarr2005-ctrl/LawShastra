import React, { useState } from 'react'
import { Settings } from 'lucide-react'
import { adminActions, useAdminStore } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, Field, TextInput, SelectInput } from '@/features/admin/shared/AdminPrimitives'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'

export const WebsiteSettingsPage: React.FC = () => {
  const settings = useAdminStore((s) => s.settings)
  const [draft, setDraft] = useState(settings)
  const [saved, setSaved] = useState(false)
  const save = async () => { await adminActions.updateSettings(draft); setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <PageShell title="Website Settings" subtitle="Configure global site identity and behavior." icon={<Settings className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { void save() }}>{saved ? 'Saved' : 'Save Settings'}</Button>}>
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Identity" description="Public-facing site information">
          <div className="grid gap-4">
            <Field label="Site Name"><TextInput value={draft.siteName} onChange={(e) => setDraft({ ...draft, siteName: e.target.value })} /></Field>
            <Field label="Tagline"><TextInput value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} /></Field>
            <Field label="Support Email"><TextInput type="email" value={draft.supportEmail} onChange={(e) => setDraft({ ...draft, supportEmail: e.target.value })} /></Field>
            <Field label="Contact Phone"><TextInput value={draft.contactPhone} onChange={(e) => setDraft({ ...draft, contactPhone: e.target.value })} /></Field>
          </div>
        </SectionCard>
        <SectionCard title="Behavior" description="Runtime and display preferences">
          <div className="grid gap-4">
            <Field label="Default Theme"><SelectInput value={draft.defaultTheme} onChange={(e) => setDraft({ ...draft, defaultTheme: e.target.value })}><option>Light</option><option>Dark</option><option>System</option></SelectInput></Field>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <div><p className="text-sm font-semibold">Maintenance Mode</p><p className="text-xs text-slate-500">Temporarily disable public access</p></div>
              <Switch checked={draft.maintenanceMode} onCheckedChange={(v) => setDraft({ ...draft, maintenanceMode: v })} />
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">Changes are stored locally and applied to admin configuration. Connect backend settings API for production persistence.</div>
          </div>
        </SectionCard>
      </div>
    </PageShell>
  )
}
