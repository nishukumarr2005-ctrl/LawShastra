import React, { useMemo, useState } from 'react'
import { FolderTree, Plus, Pencil, Trash2, Layers } from 'lucide-react'
import { adminActions, useAdminStore, type AdminCategory, type AdminSubcategory } from '@/features/admin/shared/adminStore'
import { PageShell, SectionCard, Toolbar, TextInput, SelectInput, SimpleTable, Pill, ActionButton, Field, TextArea } from '@/features/admin/shared/AdminPrimitives'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'

const emptyCategory = (): Partial<AdminCategory> => ({
  name: '',
  slug: '',
  description: '',
  parentId: null,
  count: 0,
  status: 'Live',
  featured: false,
  showOnWebsite: true,
})

const emptySubcategory = (categoryId?: number): Partial<AdminSubcategory> => ({
  name: '',
  slug: '',
  categoryId: categoryId || 0,
  status: 'Draft',
})

export const AdminCategoriesPage: React.FC = () => {
  const { categories, subcategories } = useAdminStore((s) => ({ categories: s.categories, subcategories: s.subcategories }))
  const [q, setQ] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<Partial<AdminCategory> | null>(null)
  const [editingSub, setEditingSub] = useState<Partial<AdminSubcategory> | null>(null)

  const filteredCategories = useMemo(
    () => categories.filter((c) => `${c.name} ${c.slug} ${c.description || ''}`.toLowerCase().includes(q.toLowerCase())),
    [categories, q]
  )

  const categoryRows = filteredCategories.map((c) => {
    const subs = subcategories.filter((s) => s.categoryId === c.id)
    return [
      <div key="name">
        <div className="font-semibold text-slate-900 dark:text-slate-100">{c.name}</div>
        <div className="text-xs text-slate-400 font-mono">/{c.slug}</div>
      </div>,
      <div key="status" className="flex flex-wrap gap-1.5">
        {c.status === 'Live' ? <Pill tone="green">Live</Pill> : <Pill>Draft</Pill>}
        {c.featured && <Pill tone="amber">Featured</Pill>}
        {!c.showOnWebsite && <Pill tone="rose">Hidden</Pill>}
      </div>,
      <span key="subs" className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300"><Layers className="h-3.5 w-3.5" /> {subs.length} subcategories</span>,
      <span key="count" className="tabular-nums">{c.count}</span>,
      <div key="actions" className="flex flex-wrap gap-1">
        <ActionButton onClick={() => { setEditingSub(emptySubcategory(c.id)); setSubOpen(true) }}>Add Subcategory</ActionButton>
        <ActionButton onClick={() => { setEditingCat(c); setCatOpen(true) }}><Pencil className="h-3.5 w-3.5" /></ActionButton>
        <ActionButton tone="danger" onClick={() => { void adminActions.removeCategory(c.id) }}><Trash2 className="h-3.5 w-3.5" /></ActionButton>
      </div>,
    ]
  })

  const subRows = subcategories
    .filter((s) => `${s.name} ${s.slug}`.toLowerCase().includes(q.toLowerCase()) || categories.find((c) => c.id === s.categoryId)?.name.toLowerCase().includes(q.toLowerCase()))
    .map((s) => [
      <div key="name"><div className="font-semibold">{s.name}</div><div className="text-xs text-slate-400 font-mono">/{s.slug}</div></div>,
      categories.find((c) => c.id === s.categoryId)?.name || '—',
      s.status === 'Published' ? <Pill tone="green">Published</Pill> : <Pill>Draft</Pill>,
      <div key="actions" className="flex gap-1">
        <ActionButton onClick={() => { setEditingSub(s); setSubOpen(true) }}><Pencil className="h-3.5 w-3.5" /></ActionButton>
        <ActionButton tone="danger" onClick={() => { void adminActions.removeSubcategory(s.id) }}><Trash2 className="h-3.5 w-3.5" /></ActionButton>
      </div>,
    ])

  const saveCategory = async () => {
    if (!editingCat) return
    await adminActions.saveCategory({
      ...editingCat,
      parentId: editingCat.parentId ? Number(editingCat.parentId) : null,
      count: Number(editingCat.count || 0),
    })
    setCatOpen(false)
    setEditingCat(null)
  }

  const saveSubcategory = () => {
    if (!editingSub) return
    adminActions.saveSubcategory({ ...editingSub, categoryId: Number(editingSub.categoryId) })
    setSubOpen(false)
    setEditingSub(null)
  }

  return (
    <PageShell
      title="Categories & Subcategories"
      subtitle="Create, organize, and manage law categories and their subcategories."
      icon={<FolderTree className="h-5 w-5 text-amber-500" />}
      actions={
        <>
          <Button variant="ghost" onClick={() => { setEditingSub(emptySubcategory(categories[0]?.id)); setSubOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />Add Subcategory
          </Button>
          <Button aria-label="Add Category" onClick={() => { setEditingCat(emptyCategory()); setCatOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />Add Category
          </Button>
        </>
      }
    >
      <SectionCard title="Category Management" description={`${filteredCategories.length} categories, ${subcategories.length} subcategories`}>
        <Toolbar
          left={<TextInput placeholder="Search categories..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" aria-label="Search categories" />}
        />
        <div className="mt-4">
          <SimpleTable headers={['Category', 'Status', 'Structure', 'Items', 'Actions']} rows={categoryRows} />
        </div>
      </SectionCard>

      <SectionCard title="Subcategories" description="Manage child categories linked to parent categories">
        <SimpleTable headers={['Subcategory', 'Parent Category', 'Status', 'Actions']} rows={subRows} />
      </SectionCard>

      <Dialog
        isOpen={catOpen}
        onClose={() => { setCatOpen(false); setEditingCat(null) }}
        title={editingCat?.id ? 'Edit Category' : 'Create New Category'}
        description="Add or update a law category. Changes can sync to backend when available."
        maxWidth="2xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setCatOpen(false); setEditingCat(null) }}>Cancel</Button>
            <Button onClick={() => { void saveCategory() }}>{editingCat?.id ? 'Save Changes' : 'Create Category'}</Button>
          </>
        }
      >
        {editingCat && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category Name" className="sm:col-span-2">
              <TextInput aria-label="Category Name" value={editingCat.name || ''} onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })} placeholder="e.g. Constitutional Law" />
            </Field>
            <Field label="Custom Slug">
              <TextInput aria-label="Custom Slug" value={editingCat.slug || ''} onChange={(e) => setEditingCat({ ...editingCat, slug: e.target.value })} placeholder="auto if empty" />
            </Field>
            <Field label="Display Count">
              <TextInput type="number" min={0} value={editingCat.count ?? 0} onChange={(e) => setEditingCat({ ...editingCat, count: Number(e.target.value) })} />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <TextArea rows={3} value={editingCat.description || ''} onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })} />
            </Field>
            <Field label="Status">
              <SelectInput value={editingCat.status || 'Live'} onChange={(e) => setEditingCat({ ...editingCat, status: e.target.value as any })}>
                <option value="Live">Live</option>
                <option value="Draft">Draft</option>
              </SelectInput>
            </Field>
            <Field label="Parent Category">
              <SelectInput value={editingCat.parentId ?? ''} onChange={(e) => setEditingCat({ ...editingCat, parentId: e.target.value ? Number(e.target.value) : null })}>
                <option value="">— None (Top-level) —</option>
                {categories.filter((c) => c.id !== editingCat.id).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </SelectInput>
            </Field>
            <div className="sm:col-span-2 grid gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between"><span className="text-sm">Show on Website</span><Switch checked={!!editingCat.showOnWebsite} onCheckedChange={(v) => setEditingCat({ ...editingCat, showOnWebsite: v })} aria-label="Show on Website" /></div>
              <div className="flex items-center justify-between"><span className="text-sm">Featured Category</span><Switch checked={!!editingCat.featured} onCheckedChange={(v) => setEditingCat({ ...editingCat, featured: v })} aria-label="Featured Category" /></div>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        isOpen={subOpen}
        onClose={() => { setSubOpen(false); setEditingSub(null) }}
        title={editingSub?.id ? 'Edit Subcategory' : 'Add Subcategory'}
        maxWidth="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setSubOpen(false); setEditingSub(null) }}>Cancel</Button>
            <Button onClick={() => { void saveSubcategory() }}>Save Subcategory</Button>
          </>
        }
      >
        {editingSub && (
          <div className="grid gap-4">
            <Field label="Subcategory Name">
              <TextInput value={editingSub.name || ''} onChange={(e) => setEditingSub({ ...editingSub, name: e.target.value })} />
            </Field>
            <Field label="Slug">
              <TextInput value={editingSub.slug || ''} onChange={(e) => setEditingSub({ ...editingSub, slug: e.target.value })} placeholder="auto if empty" />
            </Field>
            <Field label="Parent Category">
              <SelectInput value={editingSub.categoryId || ''} onChange={(e) => setEditingSub({ ...editingSub, categoryId: Number(e.target.value) })}>
                <option value="" disabled>Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </SelectInput>
            </Field>
            <Field label="Status">
              <SelectInput value={editingSub.status || 'Draft'} onChange={(e) => setEditingSub({ ...editingSub, status: e.target.value as any })}>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </SelectInput>
            </Field>
          </div>
        )}
      </Dialog>
    </PageShell>
  )
}

export default AdminCategoriesPage
