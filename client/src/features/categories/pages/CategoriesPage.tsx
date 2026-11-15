import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPublicCatalog, type PublicCatalog } from '@/services/lawService'

type ActItem = { label: string; slug: string; kind: 'act' | 'subcategory' }

type Section = {
  id: number
  name: string
  slug: string
  icon: string
  description: string
  count: number
  subcategories: Array<{ id: number; name: string; slug: string }>
  acts: ActItem[]
  accent: string
}

const accents = [
  'bg-[#F1ECFF] text-[#5F42D9]',
  'bg-[#FFF1E8] text-[#DE7D4C]',
  'bg-[#EAF8EF] text-[#3E8E62]',
  'bg-[#F4F9FF] text-[#4867C7]',
]
const icons = ['⚖️', '🏛️', '📜', '🛡️']

const slugify = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export function CategoriesPage() {
  const navigate = useNavigate()
  const [catalog, setCatalog] = useState<PublicCatalog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [openCard, setOpenCard] = useState<number | null>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (!t?.closest('[data-category-card]')) setOpenCard(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await getPublicCatalog()
        if (alive) {
          setCatalog(data)
          setError(null)
        }
      } catch (e: any) {
        if (alive) setError(e?.message || 'Failed to load catalog')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  const sections: Section[] = useMemo(() => {
    const cats = catalog?.categories || []
    const subs = catalog?.subcategories || []
    const laws = catalog?.laws || []
    return cats.map((c, i) => {
      const catId = Number(c.id)
      const catSubs = subs.filter((s) => Number(s.categoryId) === catId)
      const catActs = laws.filter((l) => l.category === c.name || slugify(l.category || '') === slugify(c.name || ''))
      return {
        id: catId,
        name: c.name,
        slug: c.slug || slugify(c.name),
        icon: c.icon || icons[i % icons.length],
        description: c.description || `Explore ${c.name} resources, acts, and subcategories.`,
        count: c.count ?? catActs.length,
        subcategories: catSubs.map((s) => ({ id: s.id, name: s.name, slug: s.slug || slugify(s.name) })),
        acts: catActs.map((l) => ({ label: l.title, slug: l.slug || slugify(l.title), kind: 'act' as const })),
        accent: accents[i % accents.length],
      }
    })
  }, [catalog])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sections
    return sections.filter((s) => {
      if (s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) return true
      if (s.subcategories.some((x) => x.name.toLowerCase().includes(q))) return true
      if (s.acts.some((x) => x.label.toLowerCase().includes(q))) return true
      return false
    })
  }, [sections, query])

  const baseActs = useMemo(() => {
    const laws = catalog?.laws || []
    return laws.slice(0, 10).map((l) => ({ label: l.title, slug: l.slug || slugify(l.title) }))
  }, [catalog])

  const goLaw = (slug: string) => navigate(`/categories/${slug}`)

  return (
    <div className="min-h-screen bg-[#FFF9F1] text-[#171936]">
      <main className="mx-auto max-w-[1240px] px-4 py-10 md:px-7 lg:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#F5D77C] bg-[#FFFDF7] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#A87800]">
              ⚖ Law Library
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#171936] md:text-5xl">Explore Laws by Category</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6E6A7D] md:text-base">
              Browse admin-managed categories, published subcategories, and bare acts. Select a category to view its structure and resources.
            </p>
          </div>
          <div className="w-full md:w-[360px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories, subcategories, acts..."
              className="w-full rounded-xl border border-[#E6DCCB] bg-white px-4 py-3 text-sm text-[#171936] shadow-sm outline-none placeholder:text-[#A39DB2] focus:border-[#C9B7FA] focus:ring-2 focus:ring-[#E9DEFF]"
              aria-label="Search catalog"
            />
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Unable to load live catalog ({error}). Showing available data once loaded.
          </div>
        )}

        <div className="mt-8 grid gap-7 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[24px] border border-[#EEE4D9] bg-white p-5 shadow-[0_12px_35px_rgba(87,64,26,0.04)] md:p-6 xl:sticky xl:top-[96px]">
            <div className="flex items-center gap-3 border-b border-[#EEE4D9] pb-4">
              <div className="grid h-[46px] w-[46px] place-items-center rounded-[16px] bg-[#FFF3CA] text-[23px]">📚</div>
              <div>
                <div className="text-[18px] font-bold text-[#171936]">Base Acts</div>
                <div className="text-xs text-[#7F7A8D]">Published resources</div>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              {loading && baseActs.length === 0 ? (
                <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-10 animate-pulse rounded-xl bg-[#F3EFE8]" />)}</div>
              ) : baseActs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#E8D9C7] bg-[#FFFDF9] p-3 text-xs text-[#7F7A8D]">No published acts yet.</div>
              ) : (
                baseActs.map((item) => (
                  <button key={item.slug} type="button" onClick={() => goLaw(item.slug)} className="flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-left text-[14px] font-semibold text-[#25233D] transition-colors hover:bg-[#F7F3FF] hover:text-[#5F42D9]">
                    <span className="line-clamp-1">{item.label}</span>
                    <span className="text-[#A09AA9]">›</span>
                  </button>
                ))
              )}
            </div>
            <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#FFF8E7] to-white p-4 text-[12px] leading-6 text-[#7F7A8D]">
              Categories and subcategories shown here are managed from the Admin Dashboard and reflect published catalog data.
            </div>
          </aside>

          <section className="rounded-[24px] border border-[#EEE4D9] bg-white p-4 shadow-[0_12px_35px_rgba(87,64,26,0.04)] md:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-[#171936] md:text-2xl">Categories</h2>
                <p className="mt-1 text-xs text-[#6E6A7D]">{filtered.length} of {sections.length} categories</p>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1,2,3,4].map(i => <div key={i} className="h-56 animate-pulse rounded-[22px] border border-[#EEE4D9] bg-[#FAF7F2]" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-[#E8D9C7] bg-[#FFFDF9] p-10 text-center">
                <div className="text-3xl">🔎</div>
                <h3 className="mt-3 text-lg font-bold text-[#171936]">No matching categories</h3>
                <p className="mt-1 text-sm text-[#6E6A7D]">Try a different search, or add/publish categories and subcategories from the admin dashboard.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((section) => {
                  const isOpen = openCard === section.id
                  const visibleSubs = section.subcategories
                  const visibleActs = section.acts.slice(0, 8)
                  return (
                    <article
                      key={section.id}
                      data-category-card
                      className={[
                        'group relative rounded-[22px] border border-[#EEE4D9] bg-white p-5 transition-all duration-200',
                        'hover:border-[#D8CBFF] hover:shadow-[0_18px_35px_rgba(108,74,221,0.08)]',
                        isOpen ? 'z-20 border-[#D8CBFF] shadow-[0_18px_35px_rgba(108,74,221,0.08)]' : 'z-10',
                      ].join(' ')}
                    >
                      <button type="button" onClick={() => setOpenCard(isOpen ? null : section.id)} className="w-full text-left">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-4">
                            <div className={`grid h-[48px] w-[48px] place-items-center rounded-[16px] text-[22px] ${section.accent}`}>{section.icon}</div>
                            <div>
                              <h3 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#171936]">{section.name}</h3>
                              <div className="mt-1 flex flex-wrap gap-2 text-[11px] font-semibold text-[#6E6A7D]">
                                <span className="rounded-full bg-[#F6F2FF] px-2 py-0.5 text-[#5F42D9]">{section.acts.length} acts</span>
                                <span className="rounded-full bg-[#FFF6E8] px-2 py-0.5 text-[#9A6A00]">{visibleSubs.length} subcategories</span>
                              </div>
                            </div>
                          </div>
                          <span className="mt-1 text-lg text-[#A09AA9]">{isOpen ? '−' : '+'}</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-[#6E6A7D]">{section.description}</p>
                      </button>

                      <div className={`mt-4 grid gap-3 ${isOpen ? 'grid' : 'hidden md:grid'}`}>
                        <div className="rounded-[16px] border border-[#EEE6FF] bg-[#FBFAFF] p-3">
                          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#7A6F8B]">Subcategories</div>
                          {visibleSubs.length === 0 ? (
                            <div className="text-xs text-[#8A8596]">No published subcategories yet. Add them in Admin → Categories/Subcategories and set status to Published.</div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {visibleSubs.map((sub) => (
                                <span key={sub.id} className="inline-flex items-center rounded-full border border-[#E6DCFF] bg-white px-2.5 py-1 text-xs font-semibold text-[#4B3F72]">
                                  {sub.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="rounded-[16px] border border-[#F0EAE3] bg-[#FFFCF8] p-3">
                          <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#7A6F8B]">Acts & Resources</div>
                          {visibleActs.length === 0 ? (
                            <div className="text-xs text-[#8A8596]">No published acts/resources in this category yet.</div>
                          ) : (
                            <div className="grid gap-2 sm:grid-cols-2">
                              {visibleActs.map((act) => (
                                <button key={act.slug} type="button" onClick={() => goLaw(act.slug)} className="flex items-center justify-between rounded-xl border border-[#EEE6FF] bg-white px-3 py-2.5 text-left text-[12px] font-bold text-[#34314C] transition-all hover:border-[#D8C7FF] hover:bg-[#F2EBFF] hover:text-[#5F42D9]">
                                  <span className="line-clamp-1">{act.label}</span>
                                  <span className="text-[#A69ABF]">›</span>
                                </button>
                              ))}
                            </div>
                          )}
                          {section.acts.length > 8 && (
                            <div className="mt-2 text-[11px] text-[#7F7A8D]">+{section.acts.length - 8} more in this category</div>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
