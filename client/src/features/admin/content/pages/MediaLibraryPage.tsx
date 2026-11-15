import React, { useRef, useState } from 'react'
import { ImageIcon, Upload, Trash2 } from 'lucide-react'
import { adminActions, useAdminStore } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, SimpleTable, Pill, ActionButton } from '@/features/admin/shared/AdminPrimitives'
import { Button } from '@/components/ui/Button'

export const MediaLibraryPage: React.FC = () => {
  const media = useAdminStore((s) => s.media)
  const inputRef = useRef<HTMLInputElement>(null)
  const [type, setType] = useState<'Image' | 'Document' | 'Video'>('Image')

  const onFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((f) => adminActions.addMedia({ name: f.name, type, size: `${Math.max(1, Math.round(f.size / 1024))} KB` }))
  }

  const rows = media.map((m) => [<div key="n" className="font-semibold">{m.name}</div>, <Pill tone={m.type === 'Image' ? 'blue' : m.type === 'Document' ? 'amber' : 'green'}>{m.type}</Pill>, m.size, m.url, <ActionButton key="a" tone="danger" onClick={() => { void adminActions.removeMedia(m.id) }}><Trash2 className="h-3.5 w-3.5" /></ActionButton>])

  return (
    <PageShell title="Media Library" subtitle="Upload and manage images, documents, and other assets." icon={<ImageIcon className="h-5 w-5 text-amber-500" />} actions={<><select value={type} onChange={(e) => setType(e.target.value as any)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"><option>Image</option><option>Document</option><option>Video</option></select><Button onClick={() => inputRef.current?.click()}><Upload className="h-4 w-4 mr-2" />Upload</Button><input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} /></>}>
      <SectionCard title="Assets" description={`${media.length} files tracked`}>
        <SimpleTable headers={['Name', 'Type', 'Size', 'Path', 'Actions']} rows={rows} />
      </SectionCard>
    </PageShell>
  )
}
