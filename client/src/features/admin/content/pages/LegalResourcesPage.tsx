import React, { useMemo, useState } from 'react'
import { BookOpen, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { adminActions, useAdminStore, type AdminLegalResource, type AdminLawChapter } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, Toolbar, TextInput, SelectInput, SimpleTable, Pill, ActionButton, Field, TextArea } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { RichTextEditor } from '@/components/ui/RichTextEditor'

const emptyChapter = (): AdminLawChapter => ({ title: '', content: '' })

const empty = (): Partial<AdminLegalResource> => ({
  title: '',
  shortTitle: '',
  slug: '',
  category: 'Civil Law',
  jurisdiction: 'India',
  status: 'Draft',
  summary: '',
  sourceUrl: '',
  sourceLabel: '',
  pdfUrl: '',
  pdfExtractedText: '',
  subcategories: [],
  chapters: [],
})

const parseSubcategories = (value: string) =>
  value.split(',').map((s) => s.trim()).filter(Boolean)

export const LegalResourcesPage: React.FC = () => {
  const resources = useAdminStore((s) => s.legalResources)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<AdminLegalResource> | null>(null)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true })

  const filtered = useMemo(
    () => resources.filter((r) => `${r.title} ${r.category} ${r.jurisdiction} ${r.slug || ''}`.toLowerCase().includes(q.toLowerCase())),
    [resources, q],
  )

  const openCreate = () => { setEditing(empty()); setExpanded({ 0: true }); setOpen(true) }
  const openEdit = (r: AdminLegalResource) => {
    setEditing({
      ...r,
      subcategories: Array.isArray(r.subcategories) ? [...r.subcategories] : [],
      chapters: Array.isArray(r.chapters) ? r.chapters.map((c) => ({ ...c })) : [],
    })
    setExpanded({ 0: true })
    setOpen(true)
  }

  const setField = <K extends keyof AdminLegalResource>(key: K, value: AdminLegalResource[K]) => {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const chapters = editing?.chapters || []
  const setChapters = (next: AdminLawChapter[]) => setField('chapters', next)

  const addChapter = () => {
    const next = [...chapters, emptyChapter()]
    setChapters(next)
    setExpanded((e) => ({ ...e, [next.length - 1]: true }))
  }
  const removeChapter = (i: number) => setChapters(chapters.filter((_, idx) => idx !== i))
  const updateChapter = (i: number, patch: Partial<AdminLawChapter>) =>
    setChapters(chapters.map((c, idx) => (idx === i ? { ...c, ...patch } : c)))

  const save = async () => {
    if (!editing) return
    await adminActions.saveLegalResource(editing)
    setOpen(false)
    setEditing(null)
  }

  const rows = filtered.map((r) => [
    <div key="t">
      <div className="font-semibold">{r.title}</div>
      <div className="text-xs text-slate-400">{r.slug || 'no-slug'} · {r.jurisdiction} · {Array.isArray(r.chapters) ? r.chapters.length : 0} chapters</div>
    </div>,
    r.category,
    r.status === 'Published' ? <Pill tone="green">Published</Pill> : r.status === 'Review' ? <Pill tone="amber">Review</Pill> : <Pill>Draft</Pill>,
    <div key="a" className="flex gap-1">
      <ActionButton onClick={() => openEdit(r)}>Edit</ActionButton>
      <ActionButton tone="danger" onClick={() => { void adminActions.removeLegalResource(r.id) }}>Delete</ActionButton>
    </div>,
  ])

  return (
    <PageShell
      title="Legal Resources"
      subtitle="Manage bare acts, statutes, chapters and content shown on the public portal."
      icon={<BookOpen className="h-5 w-5 text-amber-500" />}
      actions={<Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Resource</Button>}
    >
      <SectionCard title="Resources Library" description={`${filtered.length} resources`}>
        <Toolbar left={<TextInput placeholder="Search resources..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />} />
        <div className="mt-4"><SimpleTable headers={['Title', 'Category', 'Status', 'Actions']} rows={rows} /></div>
      </SectionCard>

      <Dialog
        isOpen={open}
        onClose={() => { setOpen(false); setEditing(null) }}
        title={editing?.id ? 'Edit Legal Resource' : 'Add Legal Resource'}
        maxWidth="4xl"
        footer={<><Button variant="ghost" onClick={() => { setOpen(false); setEditing(null) }}>Cancel</Button><Button onClick={() => { void save() }}>Save</Button></>}
      >
        {editing && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" className="sm:col-span-2"><TextInput value={editing.title || ''} onChange={(e) => setField('title', e.target.value)} placeholder="e.g. Code of Civil Procedure, 1908" /></Field>
              <Field label="Short Title"><TextInput value={editing.shortTitle || ''} onChange={(e) => setField('shortTitle', e.target.value)} placeholder="e.g. CPC" /></Field>
              <Field label="Slug"><TextInput value={editing.slug || ''} onChange={(e) => setField('slug', e.target.value)} placeholder="auto if blank (e.g. code-of-civil-procedure-1908)" /></Field>
              <Field label="Category"><SelectInput value={editing.category || 'Civil Law'} onChange={(e) => setField('category', e.target.value)}><option>Civil Law</option><option>Criminal Law</option><option>Constitutional Law</option><option>Banking Law</option><option>Commercial Law</option><option>Other Laws</option></SelectInput></Field>
              <Field label="Jurisdiction"><TextInput value={editing.jurisdiction || ''} onChange={(e) => setField('jurisdiction', e.target.value)} placeholder="India" /></Field>
              <Field label="Status"><SelectInput value={editing.status || 'Draft'} onChange={(e) => setField('status', e.target.value as any)}><option>Draft</option><option>Review</option><option>Published</option></SelectInput></Field>
              <Field label="Subcategories (comma separated)" className="sm:col-span-2"><TextInput value={(editing.subcategories || []).join(', ')} onChange={(e) => setField('subcategories', parseSubcategories(e.target.value))} placeholder="Procedural Law, Civil Remedies, Evidence" /></Field>
              <Field label="Summary" className="sm:col-span-2"><TextArea rows={3} value={editing.summary || ''} onChange={(e) => setField('summary', e.target.value)} /></Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Source URL"><TextInput value={editing.sourceUrl || ''} onChange={(e) => setField('sourceUrl', e.target.value)} placeholder="https://www.indiacode.nic.in/..." /></Field>
              <Field label="Source Label"><TextInput value={editing.sourceLabel || ''} onChange={(e) => setField('sourceLabel', e.target.value)} placeholder="India Code" /></Field>
              <Field label="PDF URL" className="sm:col-span-2"><TextInput value={editing.pdfUrl || ''} onChange={(e) => setField('pdfUrl', e.target.value)} placeholder="https://...bare-act.pdf" /></Field>
              <Field label="PDF Extracted Text (optional)" className="sm:col-span-2"><TextArea rows={3} value={editing.pdfExtractedText || ''} onChange={(e) => setField('pdfExtractedText', e.target.value)} /></Field>
            </div>

            <div className="rounded-xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-slate-800">Chapters / Content</div>
                  <div className="text-xs text-slate-500">Add chapters in order. Each chapter title and content is shown on the public “Bare Act Search” view.</div>
                </div>
                <Button variant="ghost" onClick={addChapter}><Plus className="mr-1 h-4 w-4" />Add Chapter</Button>
              </div>

              {chapters.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">No chapters yet. Click “Add Chapter” to create chapter-wise content.</div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {chapters.map((ch, i) => {
                    const isOpen = expanded[i] !== false
                    return (
                      <div key={i} className="bg-white">
                        <div className="flex items-center gap-2 px-4 py-2">
                          <button type="button" className="flex flex-1 items-center gap-2 text-left" onClick={() => setExpanded((e) => ({ ...e, [i]: !isOpen }))}>
                            {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">Ch. {i + 1}</span>
                            <span className="truncate text-sm font-medium text-slate-800">{ch.title || 'Untitled chapter'}</span>
                          </button>
                          <button type="button" className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" onClick={() => removeChapter(i)} title="Remove chapter">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {isOpen && (
                          <div className="grid gap-3 px-4 pb-4">
                            <Field label={`Chapter ${i + 1} Title`}>
                              <TextInput value={ch.title} onChange={(e) => updateChapter(i, { title: e.target.value })} placeholder="e.g. Jurisdiction" />
                            </Field>
                            <div>
                              <div className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Content</div>
                              <RichTextEditor
                                value={ch.content || ''}
                                onChange={(html) => updateChapter(i, { content: html })}
                                placeholder="Chapter content / sections text..."
                                minHeight={260}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </PageShell>
  )
}
