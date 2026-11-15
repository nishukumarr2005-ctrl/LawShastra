import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLawBySlug, getLaws, type LawApiItem } from '@/services/lawService'

type ApiChapter = { id?: number; title: string; content: string }

export function LawDetailPage() {
  const { lawSlug } = useParams<{ lawSlug: string }>()
  const [law, setLaw] = useState<LawApiItem | null>(null)
  const [sidebarLaws, setSidebarLaws] = useState<LawApiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openChapter, setOpenChapter] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const all = await getLaws()
        if (alive) setSidebarLaws(all.filter((l) => (l.status || '').toLowerCase() === 'published'))
      } catch {
        // ignore sidebar errors
      }
    })()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    let alive = true
    if (!lawSlug) {
      setError('Missing law')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    setLaw(null)
    setOpenChapter(null)
    ;(async () => {
      try {
        const data = await getLawBySlug(lawSlug)
        if (!alive) return
        setLaw(data)
      } catch (e: any) {
        if (alive) setError(e?.message || 'Failed to load law')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [lawSlug])

  const chapters: ApiChapter[] = useMemo(() => {
    const list = Array.isArray(law?.chapters) ? law!.chapters : []
    return list
  }, [law])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return chapters
    return chapters.filter((c, i) => {
      const hay = `${i + 1} ${c.title} ${c.content}`.toLowerCase()
      return hay.includes(q)
    })
  }, [chapters, search])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FFF9F2] px-4">
        <div className="text-sm font-semibold text-[#6E6A7D]">Loading bare act...</div>
      </div>
    )
  }

  if (error || !law) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FFF9F2] px-4">
        <div className="max-w-md rounded-[24px] border border-[#EEDFCB] bg-white p-8 text-center shadow-[0_16px_35px_rgba(88,62,24,0.06)]">
          <div className="mb-4 text-4xl">⚖️</div>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#171936]">Act not found</h2>
          <p className="mt-2 text-sm leading-6 text-[#6E6A7D]">{error || 'The legal topic you requested is not available in the current library.'}</p>
          <Link to="/categories" className="mt-6 inline-flex rounded-full bg-[#171936] px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90">
            Back to Categories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFAF2] text-[#171936]" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <main className="mx-auto max-w-[1440px] px-4 pb-16 pt-[30px] md:px-7">
        <div className="mb-[18px] text-[12px] text-[#77758B]">
          <Link to="/" className="text-inherit no-underline hover:text-[#171936]">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/categories" className="text-inherit no-underline hover:text-[#171936]">{law.category || 'Categories'}</Link>
          <span className="mx-2">›</span>
          <strong className="text-[#171936]">{law.title}</strong>
        </div>

        <section className="mb-[24px] flex flex-col gap-[22px] md:flex-row md:items-start md:justify-between">
          <div>
            <span className="inline-flex items-center gap-[7px] rounded-[30px] border border-[#F2D47B] bg-[#FFFDF6] px-[10px] py-[6px] text-[10px] font-extrabold uppercase tracking-[0.65px] text-[#9A7000]">
              ⚖ &nbsp; {(law.category || 'Law').toUpperCase()}
            </span>
            <h1 className="mt-[12px] text-[clamp(26px,3vw,36px)] font-black tracking-[-1.2px] text-[#171936]">{law.title}</h1>
            {law.summary ? <p className="mt-[6px] max-w-[720px] text-[14px] leading-[1.6] text-[#77758B]">{law.summary}</p> : null}
          </div>
          {law.pdfUrl ? (
            <div className="flex flex-wrap gap-[9px]">
              <a href={law.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-[8px] rounded-[12px] border border-[#171936] bg-[#171936] px-[14px] py-[10px] text-[12px] font-bold text-white no-underline shadow-[0_12px_34px_rgba(48,35,18,0.055)] transition-transform hover:-translate-y-[1px]">
                ↗ Official Bare Act PDF
              </a>
            </div>
          ) : null}
        </section>

        <section className="mb-[22px] grid gap-[12px] md:grid-cols-4">
          {[
            { label: 'Chapters', value: String(chapters.length) },
            { label: 'Jurisdiction', value: law.jurisdiction || 'India' },
            { label: 'Status', value: law.status || '—' },
            { label: 'Subcategories', value: String((law.subcategories || []).length) },
          ].map((item) => (
            <div key={item.label} className="rounded-[16px] border border-[#EEE6DC] bg-white p-[15px_17px] shadow-[0_12px_34px_rgba(48,35,18,0.055)]">
              <strong className="block text-[19px] font-bold tracking-[-0.5px] text-[#171936]">{item.value}</strong>
              <span className="mt-[2px] block text-[11px] text-[#77758B]">{item.label}</span>
            </div>
          ))}
        </section>

        <div className="grid gap-[20px] xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[20px] border border-[#EEE6DC] bg-[#F7F2EA] p-[18px] shadow-[0_10px_24px_rgba(48,35,18,0.03)] xl:sticky xl:top-[94px] xl:h-fit">
            <div className="rounded-[16px] border border-[#E9DECA] bg-[#F8F3E9] p-[12px]">
              <div className="flex items-center gap-[10px] pb-[10px] text-[15px] font-extrabold text-[#171936]">
                <div className="grid h-[36px] w-[36px] place-items-center rounded-[11px] bg-[#F6D98E] text-[18px] shadow-inner shadow-white/60">📚</div>
                <span>Base Acts</span>
              </div>
              <div className="space-y-2">
                {sidebarLaws.map((item) => (
                  <Link
                    key={item.id}
                    to={`/categories/${item.slug || item.id}`}
                    className={[
                      'flex items-center justify-between gap-3 rounded-[12px] border px-[10px] py-[8px] text-left text-[14px] font-bold transition-colors',
                      (item.slug || '') === (law.slug || '') ? 'border-[#D9C7FF] bg-[#EAE3FF] text-[#171936]' : 'border-[#F0E8DC] bg-white text-[#171936] hover:text-[#5F42D9]',
                    ].join(' ')}
                  >
                    <span className="line-clamp-2">{item.title}</span>
                    <span className="text-[18px] text-[#A59AAE]">›</span>
                  </Link>
                ))}
                {sidebarLaws.length === 0 && <div className="text-xs text-[#6E6A7D]">No published acts.</div>}
              </div>
            </div>
          </aside>

          <div className="grid min-w-0 gap-[16px]">
            <section className="rounded-[20px] border border-[#EEE6DC] bg-white p-[20px] shadow-[0_12px_34px_rgba(48,35,18,0.055)]">
              <div className="mb-[16px] flex items-start justify-between gap-[15px]">
                <div>
                  <h2 className="text-[18px] font-black tracking-[-0.4px] text-[#171936]">Bare Act Search</h2>
                  <div className="mt-[6px] text-[12px] leading-[1.5] text-[#77758B]">Browse chapters and content for this act.</div>
                </div>
                <span className="inline-flex items-center gap-[7px] rounded-[30px] border border-[#F2D47B] bg-[#FFFDF6] px-[10px] py-[6px] text-[10px] font-extrabold uppercase tracking-[0.65px] text-[#9A7000]">Bare Act</span>
              </div>

              <div className="mb-4">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search chapter title or content..."
                  className="w-full rounded-[12px] border border-[#E6DCCB] bg-white px-4 py-2.5 text-[13px] text-[#171936] outline-none placeholder:text-[#A39DB2] focus:border-[#C9B7FA] focus:ring-2 focus:ring-[#E9DEFF]"
                />
              </div>

              {filtered.length === 0 ? (
                <div className="rounded-[13px] border border-dashed border-[#E8D9C7] bg-[#FFFDF9] p-[30px_12px] text-center text-[13px] text-[#77758B]">
                  {chapters.length === 0 ? 'No chapters available for this act yet. Add chapters from Admin → Legal Resources.' : 'No chapters match your search.'}
                </div>
              ) : (
                <div className="grid gap-0 overflow-hidden rounded-[18px] border border-[#E7E2DB] bg-[#F5F1EE]">
                  {filtered.map((ch, idx) => {
                    const displayIndex = chapters.findIndex((c) => c === ch)
                    const labelNo = displayIndex >= 0 ? displayIndex + 1 : idx + 1
                    const isOpen = openChapter === (ch.id ?? idx)
                    return (
                      <div key={ch.id ?? idx} className="border-b border-[#E7E2DB] last:border-b-0">
                        <button
                          type="button"
                          onClick={() => setOpenChapter(isOpen ? null : (ch.id ?? idx))}
                          className="flex w-full items-center justify-between bg-[#F2F0EE] px-[18px] py-[18px] text-left transition-colors hover:bg-[#EFEAE7]"
                        >
                          <div className="min-w-0 pr-4">
                            <div className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#7A6F8B]">Chapter {labelNo}</div>
                            <div className="mt-[2px] text-[16px] font-black leading-[1.3] tracking-[-0.04em] text-[#171936] md:text-[18px]">{ch.title || 'Untitled chapter'}</div>
                          </div>
                          <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[#E2D9CF] bg-white text-[18px] text-[#171936]">
                            {isOpen ? '−' : '›'}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="border-t border-[#E7E2DB] bg-[#FFFCF8] px-[18px] py-[16px]">
                            {ch.content ? (
                              /<\/?[a-z][\s\S]*>/i.test(ch.content) ? (
                                <div className="law-rich text-[14px] leading-[1.8] text-[#3F3B48]" dangerouslySetInnerHTML={{ __html: ch.content }} />
                              ) : (
                                <div className="whitespace-pre-wrap text-[14px] leading-[1.8] text-[#3F3B48]">{ch.content}</div>
                              )
                            ) : (
                              <div className="text-[13px] text-[#77758B]">No content added for this chapter yet.</div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <style>{`
        .law-rich p { margin: 0.6em 0; }
        .law-rich h1 { font-size: 1.5em; font-weight: 700; margin: 0.8em 0 0.4em; }
        .law-rich h2 { font-size: 1.3em; font-weight: 700; margin: 0.7em 0 0.35em; }
        .law-rich h3 { font-size: 1.15em; font-weight: 700; margin: 0.6em 0 0.3em; }
        .law-rich h4,.law-rich h5,.law-rich h6 { font-weight: 700; margin: 0.5em 0 0.25em; }
        .law-rich ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .law-rich ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .law-rich blockquote { border-left: 3px solid #D8CBB8; padding-left: 0.9em; color: #5B586A; margin: 0.6em 0; }
        .law-rich pre { background: #171936; color: #f8f5ee; border-radius: 0.5rem; padding: 0.75em 1em; overflow-x: auto; margin: 0.6em 0; }
        .law-rich code { background: #EFE8DD; border-radius: 0.25rem; padding: 0.1em 0.35em; font-size: 0.9em; }
        .law-rich pre code { background: transparent; padding: 0; }
        .law-rich hr { border: 0; border-top: 1px solid #E7E2DB; margin: 1em 0; }
        .law-rich a { color: #5F42D9; text-decoration: underline; }
        .law-rich img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 0.5em 0; }
        .law-rich mark { background: #fde68a; padding: 0.05em 0.15em; border-radius: 0.15rem; }
        .law-rich table { border-collapse: collapse; width: 100%; margin: 0.6em 0; }
        .law-rich th, .law-rich td { border: 1px solid #E7E2DB; padding: 0.4em 0.6em; vertical-align: top; }
        .law-rich th { background: #F7F2EA; font-weight: 600; text-align: left; }
      `}</style>
    </div>
  )
}
