import React, { useMemo, useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import { adminActions, useAdminStore, type AdminArticle } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, Toolbar, TextInput, SelectInput, SimpleTable, Pill, ActionButton, Field, TextArea } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

const empty = (): Partial<AdminArticle> => ({ title: '', slug: '', excerpt: '', status: 'Draft', author: 'Admin', tags: [], categoryId: null })

export const ArticlesPage: React.FC = () => {
  const { articles, categories } = useAdminStore((s) => ({ articles: s.articles, categories: s.categories }))
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<AdminArticle> | null>(null)
  const [tagText, setTagText] = useState('')

  const filtered = useMemo(() => articles.filter((a) => `${a.title} ${a.slug} ${a.status}`.toLowerCase().includes(q.toLowerCase())), [articles, q])
  const rows = filtered.map((a) => [
    <div key="t"><div className="font-semibold text-slate-900 dark:text-slate-100">{a.title}</div><div className="text-xs text-slate-400">/{a.slug}</div></div>,
    a.status === 'Published' ? <Pill tone="green">Published</Pill> : a.status === 'Review' ? <Pill tone="amber">Review</Pill> : <Pill>Draft</Pill>,
    categories.find((c) => c.id === a.categoryId)?.name || '—',
    a.author,
    <div key="act" className="flex gap-1">
      <ActionButton onClick={() => { setEditing(a); setTagText(a.tags.join(', ')); setOpen(true) }}>Edit</ActionButton>
      <ActionButton tone="danger" onClick={() => { void adminActions.removeArticle(a.id) }}>Delete</ActionButton>
    </div>,
  ])

  const save = () => {
    if (!editing) return
    const tags = tagText.split(',').map((t) => t.trim()).filter(Boolean)
    adminActions.saveArticle({ ...editing, tags, categoryId: editing.categoryId ? Number(editing.categoryId) : null })
    setOpen(false); setEditing(null); setTagText('')
  }

  return (
    <PageShell title="Articles / Posts" subtitle="Create and manage editorial content and blog posts." icon={<FileText className="h-5 w-5 text-amber-500" />} actions={<Button onClick={() => { setEditing(empty()); setTagText(''); setOpen(true) }}><Plus className="h-4 w-4 mr-2" />New Article</Button>}>
      <SectionCard title="All Articles" description={`${filtered.length} of ${articles.length} articles`}>
        <Toolbar left={<TextInput placeholder="Search articles..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />} />
        <div className="mt-4"><SimpleTable headers={['Title', 'Status', 'Category', 'Author', 'Actions']} rows={rows} /></div>
      </SectionCard>

      <Dialog isOpen={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Article' : 'New Article'} maxWidth="2xl"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { void save() }}>Save Article</Button></>}>
        {editing && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" className="sm:col-span-2"><TextInput value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
            <Field label="Slug"><TextInput value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto from title if empty" /></Field>
            <Field label="Status"><SelectInput value={editing.status || 'Draft'} onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}><option>Draft</option><option>Review</option><option>Published</option></SelectInput></Field>
            <Field label="Category"><SelectInput value={editing.categoryId ?? ''} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value ? Number(e.target.value) : null })}><option value="">— None —</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</SelectInput></Field>
            <Field label="Author"><TextInput value={editing.author || ''} onChange={(e) => setEditing({ ...editing, author: e.target.value })} /></Field>
            <Field label="Tags" hint="Comma separated" className="sm:col-span-2"><TextInput value={tagText} onChange={(e) => setTagText(e.target.value)} /></Field>
            <Field label="Excerpt" className="sm:col-span-2"><TextArea rows={4} value={editing.excerpt || ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></Field>
          </div>
        )}
      </Dialog>
    </PageShell>
  )
}
