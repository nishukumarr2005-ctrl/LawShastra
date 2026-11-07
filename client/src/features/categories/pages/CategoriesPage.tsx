import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type LawMenuItem = {
  label: string
  slug: string
}

const lawSections: Array<{
  name: string
  icon: string
  description: string
  hint: string
  submenu: LawMenuItem[]
  accent: string
}> = [
  {
    name: 'Civil Law',
    icon: '🏛',
    description: 'Private rights, civil disputes, property, contracts and remedies.',
    hint: 'Explore civil law subjects',
    submenu: [
      { label: 'CPC', slug: 'cpc' },
      { label: 'Contract Act', slug: 'contract-act' },
      { label: 'Transfer of Property Act', slug: 'transfer-of-property-act' },
      { label: 'Specific Relief Act', slug: 'specific-relief-act' },
      { label: 'Limitation Act', slug: 'limitation-act' },
      { label: 'Family Laws', slug: 'family-laws' },
    ],
    accent: 'bg-[#F1ECFF] text-[#5F42D9]',
  },
  {
    name: 'Criminal Law',
    icon: '🛡',
    description: 'Offences, criminal procedure, evidence and the justice system.',
    hint: 'Hover to view sub-laws',
    submenu: [
      { label: 'IPC / BNS', slug: 'ipc-bns' },
      { label: 'CrPC / BNSS', slug: 'crpc-bnss' },
      { label: 'IEA / BSA', slug: 'iea-bsa' },
      { label: 'POCSO Act', slug: 'pocso-act' },
      { label: 'NDPS Act', slug: 'ndps-act' },
      { label: 'Prevention of Corruption Act', slug: 'prevention-of-corruption-act' },
    ],
    accent: 'bg-[#F5F3F9] text-[#544B6E]',
  },
  {
    name: 'Banking Law',
    icon: '🏦',
    description: 'Banking regulation, recovery, secured assets and financial institutions.',
    hint: 'Hover to view sub-laws',
    submenu: [
      { label: 'Banking Regulation Act', slug: 'banking-regulation-act' },
      { label: 'SARFAESI Act', slug: 'sarfaesi-act' },
      { label: 'RBI Act', slug: 'rbi-act' },
      { label: 'Recovery of Debts Act', slug: 'recovery-of-debts-act' },
      { label: 'Negotiable Instruments Act', slug: 'negotiable-instruments-act' },
      { label: 'Insolvency & Bankruptcy Code', slug: 'insolvency-and-bankruptcy-code' },
    ],
    accent: 'bg-[#FFF1E8] text-[#DE7D4C]',
  },
  {
    name: 'Other Laws',
    icon: '📑',
    description: 'Special statutes and important legislation across legal practice areas.',
    hint: 'Hover to view sub-laws',
    submenu: [
      { label: 'Companies Act', slug: 'companies-act' },
      { label: 'SEBI Act & Regulations', slug: 'sebi-act-and-regulations' },
      { label: 'Arbitration Act', slug: 'arbitration-act' },
      { label: 'IT Act', slug: 'it-act' },
      { label: 'Consumer Protection Act', slug: 'consumer-protection-act' },
      { label: 'Environment Laws', slug: 'environment-laws' },
    ],
    accent: 'bg-[#EAF8EF] text-[#3E8E62]',
  },
]

export function CategoriesPage() {
  const navigate = useNavigate()
  const [openCard, setOpenCard] = useState<number | null>(null)

  const handleCardToggle = (index: number) => {
    if (window.innerWidth <= 640) {
      setOpenCard((current) => (current === index ? null : index))
    }
  }

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCardToggle(index)
    }
  }

  const handleSubmenuClick = (slug: string) => {
    navigate(`/categories/${slug}`)
  }

  return (
    <div className="bg-[#FFF9F1] text-[#171936]">
      <main className="mx-auto max-w-[1240px] px-4 py-10 md:px-7 lg:py-14">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#F5D77C] bg-[#FFFDF7] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#A87800]">
          ⚖ LAW LIBRARY
        </span>

        <div className="mt-4 mb-7">
          <h1 className="text-3xl font-black tracking-[-0.05em] text-[#171936] md:text-5xl">Explore Laws by Category</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6E6A7D] md:text-base">
            Choose a legal domain to explore its principal Acts, legislation, study material, case laws,
            MCQs and previous-year questions.
          </p>
        </div>

        <div className="grid gap-7 xl:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="rounded-[24px] border border-[#EEE4D9] bg-white p-5 shadow-[0_12px_35px_rgba(87,64,26,0.04)] md:p-6 xl:sticky xl:top-[96px] xl:h-fit">
            <div className="flex items-center gap-3 border-b border-[#EEE4D9] pb-4 text-[20px] font-bold text-[#171936]">
              <div className="grid h-[46px] w-[46px] place-items-center rounded-[16px] bg-[#FFF3CA] text-[23px]">📚</div>
              Base Acts
            </div>

            <div className="mt-4 space-y-1">
              {['Constitution of India', 'BNS', 'BNSS', 'BSA'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="flex items-center justify-between rounded-xl px-2 py-3 text-[15px] font-semibold text-[#25233D] transition-colors hover:text-[#5F42D9]"
                >
                  <span>{item}</span>
                  <small className="text-lg text-[#A09AA9]">›</small>
                </a>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#FFF8E7] to-white p-4 text-[12px] leading-6 text-[#7F7A8D]">
              Build your foundation with essential bare acts. Select an Act to access its sections, notes and practice questions.
            </div>
          </aside>

          <section id="laws" className="rounded-[24px] border border-[#EEE4D9] bg-white p-4 shadow-[0_12px_35px_rgba(87,64,26,0.04)] md:p-6">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex-1 border-b border-[#E8DFD4]" />
              <div className="inline-flex items-center gap-2 rounded-full border border-[#F4CA48] bg-gradient-to-b from-[#FFF9E8] to-[#FFF1C6] px-5 py-2 text-[20px] font-extrabold text-[#171936] md:text-[22px]">
                ⚖ Laws
              </div>
              <div className="flex-1 border-b border-[#E8DFD4]" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {lawSections.map((section, index) => {
                const isOpen = openCard === index

                return (
                  <article
                    key={section.name}
                    tabIndex={0}
                    onMouseEnter={() => setOpenCard(index)}
                    onMouseLeave={() => setOpenCard((current) => (current === index ? null : current))}
                    onClick={() => handleCardToggle(index)}
                    onKeyDown={(event) => handleCardKeyDown(event, index)}
                    className={[
                      'group relative z-10 overflow-visible rounded-[22px] border border-[#EEE4D9] bg-white p-5 transition-all duration-200 ease-out cursor-pointer outline-none',
                      'hover:border-[#D8CBFF] hover:z-20 hover:shadow-[0_18px_35px_rgba(108,74,221,0.08)]',
                      isOpen ? 'z-20 border-[#D8CBFF] shadow-[0_18px_35px_rgba(108,74,221,0.08)]' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`grid h-[46px] w-[46px] place-items-center rounded-[16px] text-[22px] ${section.accent}`}>
                        {section.icon}
                      </div>
                      <div className="text-[22px] font-extrabold tracking-[-0.04em] text-[#171936] md:text-[24px]">
                        {section.name}
                      </div>
                    </div>

                    <p className="mt-4 pl-[62px] text-sm leading-7 text-[#6E6A7D]">{section.description}</p>
                    <div className="mt-3 pl-[62px] text-[11px] font-medium text-[#A09AA9]">{section.hint}</div>

                    <div
                      className={[
                        'absolute left-4 right-4 top-[calc(100%+10px)] z-50 grid gap-2 rounded-[18px] border border-[#E9DFFE] bg-[#FAF7FF] p-2.5 shadow-[0_18px_40px_rgba(41,32,68,0.14)] transition-all duration-200',
                        'sm:grid-cols-2',
                        'pointer-events-none opacity-0 translate-y-[-8px]',
                        isOpen ? 'pointer-events-auto opacity-100 translate-y-0' : '',
                        'group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0',
                      ].join(' ')}
                    >
                      {section.submenu.map((item) => (
                        <button
                          key={item.slug}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleSubmenuClick(item.slug)
                          }}
                          className="flex items-center justify-between rounded-xl bg-[#FAF7FF] px-3 py-2.5 text-left text-[12px] font-bold text-[#34314C] transition-colors hover:bg-[#F2EBFF] hover:text-[#5F42D9]"
                        >
                          <span>{item.label}</span>
                          <span className="text-[#A69ABF]">›</span>
                        </button>
                      ))}
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-[18px] border border-dashed border-[#E8D9C7] bg-[#FFFDF9] p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <strong className="text-base font-extrabold text-[#171936]">Find a specific Act?</strong>
                <p className="mt-1 text-xs text-[#77758B]">Use the search to quickly locate legislation, sections or topics.</p>
              </div>
              <a href="#" className="text-sm font-extrabold text-[#5D35D8] transition-opacity hover:opacity-80">
                Browse all Acts →
              </a>
            </div>

            <div className="mt-4 text-center text-[12px] text-[#8E8998] md:text-sm">
              Move your cursor over a law category to reveal its sub-laws. On mobile, tap a category.
            </div>
            <div className="mt-2 block text-center text-[11px] text-[#9B94A5] md:hidden">
              Tip: Tap a category card to expand its sub-laws.
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
