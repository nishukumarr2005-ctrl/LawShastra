import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

type LawSection = {
  number: string
  title: string
  group: 'core' | 'execution' | 'appeals' | 'misc' | 'general'
  description: string
}

type LawDetail = {
  slug: string
  category: string
  title: string
  shortTitle: string
  icon: string
  accent: string
  summary: string
  subheading: string
  stats: Array<{ label: string; value: string }>
  quickLinks: string[]
  sections: LawSection[]
}

const lawDetails: LawDetail[] = [
  {
    slug: 'cpc',
    category: 'Civil Law',
    title: 'Code of Civil Procedure',
    shortTitle: 'CPC',
    icon: '⚖️',
    accent: 'bg-[#F1ECFF] text-[#5F42D9]',
    summary:
      'The Code of Civil Procedure governs the procedure for the administration of civil justice in India. It sets out the rules for filing suits, issuing summons, pleading, jurisdiction, interim relief, appeals and execution.',
    subheading: 'Principles, procedure, jurisdiction and execution of civil remedies.',
    stats: [
      { label: 'Sections', value: '158' },
      { label: 'Parts', value: '10' },
    //   { label: 'Case Types', value: 'Civil' },
    //   { label: 'Study Time', value: '8 hrs' },
    ],
    quickLinks: ['Jurisdiction', 'Pleadings', 'Execution', 'Review', 'Appeals', 'Interim Orders'],
    sections: [
      { number: '1', title: 'Short title, commencement and extent', group: 'core', description: 'Provides the short title, commencement and territorial extent of the Code.' },
      { number: '2', title: 'Definitions', group: 'core', description: 'Defines key expressions like decree, judgment, legal representative and mesne profits.' },
      { number: '9', title: 'Courts to try all civil suits unless barred', group: 'core', description: 'Civil courts have jurisdiction to try suits of a civil nature unless specifically barred.' },
      { number: '15', title: 'Court in which suits to be instituted', group: 'core', description: 'Requires suits to be instituted in the court of the lowest grade competent to try them.' },
      { number: '20', title: 'Other suits to be instituted where defendants reside or cause of action arises', group: 'core', description: 'Provides the general place-of-suing rule for suits not otherwise governed by specific provisions.' },
      { number: '24', title: 'General power of transfer and withdrawal', group: 'core', description: 'Confers powers on courts to transfer or withdraw cases in the interest of justice.' },
      { number: '30', title: 'Power to order discovery and the like', group: 'general', description: 'Covers discovery, inspection, admissions and document production to facilitate fair adjudication.' },
      { number: '33', title: 'Judgment and decree', group: 'core', description: 'Provides for the pronouncement of judgment and the drawing up of a decree.' },
      { number: '36', title: 'Application to orders', group: 'execution', description: 'Applies decree execution provisions to orders so far as they are applicable.' },
      { number: '47', title: 'Questions to be determined by the Court executing decree', group: 'execution', description: 'The executing court determines questions relating to execution, discharge and satisfaction.' },
      { number: '51', title: 'Powers of Court to enforce execution', group: 'execution', description: 'Lists modes by which a decree may be enforced by the court.' },
      { number: '80', title: 'Notice', group: 'misc', description: 'Provides for notice before suits against Government or public officers.' },
      { number: '96', title: 'Appeal from original decree', group: 'appeals', description: 'Provides for appellate remedies from original decrees subject to the statutory framework.' },
      { number: '100', title: 'Second appeal', group: 'appeals', description: 'A second appeal lies to the High Court on a substantial question of law.' },
      { number: '113', title: 'Reference to High Court', group: 'appeals', description: 'Outlines reference procedures to the High Court where a question of law arises.' },
      { number: '114', title: 'Review', group: 'appeals', description: 'Allows review of decrees or orders under the circumstances provided by law.' },
      { number: '151', title: 'Saving of inherent powers of Court', group: 'misc', description: 'Preserves inherent powers to secure ends of justice and prevent abuse of process.' },
    ],
  },
  {
    slug: 'contract-act',
    category: 'Civil Law',
    title: 'Indian Contract Act',
    shortTitle: 'Contract Act',
    icon: '📜',
    accent: 'bg-[#F9F2FF] text-[#7A4ED8]',
    summary:
      'The Indian Contract Act lays down the foundational principles of contract formation, enforceability, performance, discharge and remedies for breach, covering offers, acceptance and lawful consideration.',
    subheading: 'Essentials of contracts, voidability, discharge and damages.',
    stats: [
      { label: 'Sections', value: '238' },
      { label: 'Chapters', value: '18' },
      { label: 'Remedies', value: 'Breach' },
      { label: 'Study Time', value: '6 hrs' },
    ],
    quickLinks: ['Offer & Acceptance', 'Consideration', 'Capacity', 'Free Consent', 'Breach', 'Specific Performance'],
    sections: [
      { number: '2', title: 'Definition of contract', group: 'core', description: 'Defines what constitutes a valid contract under the Act.' },
      { number: '10', title: 'What agreements are contracts', group: 'core', description: 'Sets out the essentials of a valid contract and enforceability criteria.' },
      { number: '13', title: 'Consent', group: 'core', description: 'Explains free consent and the relevance of coercion, fraud and undue influence.' },
      { number: '23', title: 'What considerations and objects are lawful', group: 'core', description: 'Deals with lawful consideration and object as a requirement for valid contracts.' },
      { number: '73', title: 'Compensation for loss or damage caused by breach', group: 'execution', description: 'Provides the measure of damages and compensation for breach of contract.' },
      { number: '74', title: 'Compensation for breach of contract where penalty stipulated', group: 'execution', description: 'Explains recoverability of stipulated damages and penalty clauses.' },
      { number: '139', title: 'Contract of indemnity and guarantee', group: 'misc', description: 'Explores indemnity, guarantee and liability of sureties.' },
    ],
  },
  {
    slug: 'transfer-of-property-act',
    category: 'Civil Law',
    title: 'Transfer of Property Act',
    shortTitle: 'Transfer of Property Act',
    icon: '🏠',
    accent: 'bg-[#FFF1E5] text-[#D56939]',
    summary:
      'The Transfer of Property Act governs transfers of property by act of parties, including sales, mortgages, leases, exchange and gifts, and regulates legal consequences of such transfers.',
    subheading: 'Types of transfer, rights and liabilities of transferors and transferees.',
    stats: [
      { label: 'Sections', value: '137' },
      { label: 'Topics', value: '12' },
      { label: 'Focus', value: 'Property' },
      { label: 'Study Time', value: '7 hrs' },
    ],
    quickLinks: ['Sale', 'Lease', 'Mortgage', 'Gift', 'Exchange', 'Easements'],
    sections: [
      { number: '5', title: 'Operation of transfer', group: 'core', description: 'Explains the general rule that a property transfer operates only as permitted by law.' },
      { number: '7', title: 'Persons competent to transfer', group: 'core', description: 'Identifies the persons legally competent to transfer property.' },
      { number: '8', title: 'Operation of transfer', group: 'core', description: 'Clarifies the scope of rights created by transfers.' },
      { number: '54', title: 'Sale defined', group: 'core', description: 'Defines sale and the requirements for a valid transfer by sale.' },
      { number: '105', title: 'Lease defined', group: 'general', description: 'Defines lease and the rights and duties of lessor and lessee.' },
      { number: '129', title: 'Gift', group: 'misc', description: 'Deals with transfer by gift and the legal requirements for valid gifts.' },
    ],
  },
  {
    slug: 'specific-relief-act',
    category: 'Civil Law',
    title: 'Specific Relief Act',
    shortTitle: 'Specific Relief Act',
    icon: '🛡️',
    accent: 'bg-[#EEF8F1] text-[#3D8E5A]',
    summary:
      'The Specific Relief Act provides remedies for breach of contract and civil wrongs where monetary compensation is inadequate, such as specific performance, injunctions and declaratory relief.',
    subheading: 'Civil remedies beyond damages: injunctions, performance and declarations.',
    stats: [
      { label: 'Sections', value: '50' },
      { label: 'Reliefs', value: '7' },
      { label: 'Focus', value: 'Equitable' },
      { label: 'Study Time', value: '5 hrs' },
    ],
    quickLinks: ['Specific Performance', 'Injunctions', 'Declaratory Relief', 'Recission', 'Rectification', 'Part Performance'],
    sections: [
      { number: '5', title: 'Recovery of specific immovable property', group: 'core', description: 'Provides remedy for possession of specific immovable property.' },
      { number: '10', title: 'Specific performance of contracts', group: 'core', description: 'Enables enforcement of contracts where damages are not adequate.' },
      { number: '14', title: 'Contracts not specifically enforceable', group: 'core', description: 'Lists situations where specific performance is not available.' },
      { number: '34', title: 'Discretion of court', group: 'general', description: 'The court exercises discretion in granting equitable relief.' },
      { number: '38', title: 'Perpetual injunctions', group: 'misc', description: 'Addresses perpetual injunctions and their conditions.' },
      { number: '41', title: 'Mandatory injunctions', group: 'misc', description: 'Covers mandatory injunctions for performance or prevention of wrongful acts.' },
    ],
  },
  {
    slug: 'limitation-act',
    category: 'Civil Law',
    title: 'Limitation Act',
    shortTitle: 'Limitation Act',
    icon: '⏳',
    accent: 'bg-[#F8F3FF] text-[#6B5EDD]',
    summary:
      'The Limitation Act prescribes the periods within which legal actions must be filed. It bars stale claims and governs condonation, extensions and legal implications of delay.',
    subheading: 'Deadline management, bars, extension and effect of limitation.',
    stats: [
      { label: 'Articles', value: '184' },
      { label: 'Schedules', value: '2' },
      { label: 'Focus', value: 'Timelines' },
      { label: 'Study Time', value: '5 hrs' },
    ],
    quickLinks: ['Period of Limitation', 'Condonation', 'Computation', 'Acknowledgment', 'Suits', 'Appeals'],
    sections: [
      { number: '3', title: 'Bar of limitation', group: 'core', description: 'A suit instituted after the prescribed period is barred by limitation.' },
      { number: '5', title: 'Extension of prescribed period in certain cases', group: 'core', description: 'Allows extension on sufficient cause for delay in filing appeals, applications or suits.' },
      { number: '12', title: 'Exclusion of time in legal proceedings', group: 'general', description: 'Excludes time spent pursuing the remedy in the wrong forum.' },
      { number: '14', title: 'Exclusion of time of proceeding bona fide in court without jurisdiction', group: 'general', description: 'Provides time exclusion where proceedings were initiated in a defective forum.' },
      { number: '19', title: 'Effect of payment on account of debt or interest on legacy', group: 'misc', description: 'Acknowledgment by debtor can extend limitation in specified circumstances.' },
    ],
  },
  {
    slug: 'family-laws',
    category: 'Civil Law',
    title: 'Family Laws',
    shortTitle: 'Family Laws',
    icon: '👨‍👩‍👧‍👦',
    accent: 'bg-[#F4F9FF] text-[#4867C7]',
    summary:
      'Family law encompasses marriage, divorce, succession, maintenance and guardianship rules under personal laws, including Hindu, Muslim and Christian law principles and relevant statutory frameworks.',
    subheading: 'Personal law frameworks for marriage, maintenance and succession.',
    stats: [
      { label: 'Domains', value: '4' },
      { label: 'Acts', value: '12+' },
      { label: 'Focus', value: 'Personal law' },
      { label: 'Study Time', value: '7 hrs' },
    ],
    quickLinks: ['Marriage', 'Divorce', 'Maintenance', 'Guardianship', 'Succession', 'Adoption'],
    sections: [
      { number: 'A', title: 'Marriage and validity', group: 'core', description: 'Explains conditions, formalities and validity of marriage under personal laws.' },
      { number: 'B', title: 'Maintenance and alimony', group: 'core', description: 'Covers provisions for support and maintenance of spouse and dependants.' },
      { number: 'C', title: 'Divorce and separation', group: 'misc', description: 'Addresses grounds and procedure for divorce and judicial separation.' },
      { number: 'D', title: 'Custody and guardianship', group: 'general', description: 'Provides for guardianship, custody and welfare principles of minors.' },
      { number: 'E', title: 'Succession and inheritance', group: 'misc', description: 'Explains succession rights under relevant family law statutes.' },
    ],
  },
]

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function LawDetailPage() {
  const { lawSlug } = useParams<{ lawSlug: string }>()
  const [search, setSearch] = useState('')
  const [activeGroup, setActiveGroup] = useState<'all' | 'core' | 'execution' | 'appeals' | 'misc' | 'general'>('all')

  const law = lawDetails.find((item) => item.slug === lawSlug || slugify(item.title) === lawSlug)

  const filteredSections = useMemo(() => {
    if (!law) return []

    return law.sections.filter((section) => {
      const matchesGroup = activeGroup === 'all' || section.group === activeGroup
      const matchesSearch =
        search.trim().length === 0 ||
        section.title.toLowerCase().includes(search.toLowerCase()) ||
        section.description.toLowerCase().includes(search.toLowerCase()) ||
        section.number.includes(search)

      return matchesGroup && matchesSearch
    })
  }, [activeGroup, law, search])

  const chapterCards = law?.slug === 'cpc'
    ? [
        { order: 'I', title: 'Suits in General', summary: 'Parties, framing and institution of suits.' },
        { order: 'II', title: 'Frame of Suit', summary: 'Suit structure and cause of action requirements.' },
        { order: 'V', title: 'Issue and Service of Summons', summary: 'Service, appearance and summon procedure.' },
        { order: 'VI', title: 'Pleadings Generally', summary: 'General rules for pleadings and written submissions.' },
        { order: 'VII', title: 'Plaint', summary: 'Contents, drafting and filing of the plaint.' },
        { order: 'VIII', title: 'Written Statement', summary: 'Defence, set-off and counterclaims.' },
        { order: 'IX', title: 'Appearance and Non-Appearance', summary: 'Procedural consequences of default or appearance.' },
        { order: 'X', title: 'Examination of Parties', summary: 'Court-led examination of parties and issues.' },
        { order: 'XI', title: 'Discovery and Inspection', summary: 'Document production and fact discovery.' },
        { order: 'XIV', title: 'Settlement of Issues', summary: 'Issue framing and adjudication process.' },
        { order: 'XVIII', title: 'Judgment and Decree', summary: 'Pronouncement of judgments and decrees.' },
        { order: 'XXI', title: 'Execution of Decrees', summary: 'Execution, attachment and satisfaction.' },
        { order: 'XXXIX', title: 'Temporary Injunctions', summary: 'Interim relief and injunction procedure.' },
        { order: 'XLI', title: 'Appeals from Decrees', summary: 'Appeal structure and procedural framework.' },
        { order: 'XLVII', title: 'Review', summary: 'Review mechanism and reconsideration.' },
      ]
    : law?.quickLinks.map((item, index) => ({
        order: String(index + 1).padStart(2, '0'),
        title: item,
        summary: 'Key legal concept under the selected act.',
      })) ?? []

  if (!law) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FFF9F2] px-4">
        <div className="max-w-md rounded-[24px] border border-[#EEDFCB] bg-white p-8 text-center shadow-[0_16px_35px_rgba(88,62,24,0.06)]">
          <div className="mb-4 text-4xl">⚖️</div>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-[#171936]">Act not found</h2>
          <p className="mt-2 text-sm leading-6 text-[#6E6A7D]">The legal topic you requested is not available in the current library.</p>
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
          <Link to="/categories" className="text-inherit no-underline hover:text-[#171936]">{law.category}</Link>
          <span className="mx-2">›</span>
          <strong className="text-[#171936]">{law.title}</strong>
        </div>

        <section className="mb-[24px] flex flex-col gap-[22px] md:flex-row md:items-start md:justify-between">
          <div>
            <span className="inline-flex items-center gap-[7px] rounded-[30px] border border-[#F2D47B] bg-[#FFFDF6] px-[10px] py-[6px] text-[10px] font-extrabold uppercase tracking-[0.65px] text-[#9A7000]">
              ⚖ &nbsp; {law.category.toUpperCase()} / PROCEDURAL LAW
            </span>
            <h1 className="mt-[12px] text-[clamp(26px,3vw,36px)] font-black tracking-[-1.2px] text-[#171936]">{law.title}</h1>
            {/* <p className="mt-[6px] max-w-[720px] text-[14px] leading-[1.6] text-[#77758B]">{law.summary}</p> */}
          </div>

          <div className="flex flex-wrap gap-[9px]">
            <a href="https://www.indiacode.nic.in/bitstream/123456789/2191/1/eng.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-[8px] rounded-[12px] border border-[#171936] bg-[#171936] px-[14px] py-[10px] text-[12px] font-bold text-white no-underline shadow-[0_12px_34px_rgba(48,35,18,0.055)] transition-transform hover:-translate-y-[1px] hover:shadow-[0_12px_34px_rgba(48,35,18,0.055)]">
              ↗ Official Bare Act PDF
            </a>
            <a href="https://www.indiacode.nic.in/indiacode/handle/123456789/2191?view_type=browse" target="_blank" rel="noreferrer" className="inline-flex items-center gap-[8px] rounded-[12px] border border-[#EEE6DC] bg-white px-[14px] py-[10px] text-[12px] font-bold text-[#171936] no-underline shadow-[0_12px_34px_rgba(48,35,18,0.055)] transition-transform hover:-translate-y-[1px] hover:shadow-[0_12px_34px_rgba(48,35,18,0.055)]">
              India Code record ↗
            </a>
          </div>
        </section>

        <section className="mb-[22px] grid gap-[12px] md:grid-cols-4">
          {law.stats.map((item) => (
            <div key={item.label} className="rounded-[16px] border border-[#EEE6DC] bg-white p-[15px_17px] shadow-[0_12px_34px_rgba(48,35,18,0.055)]">
              <strong className="block text-[19px] font-bold tracking-[-0.5px] text-[#171936]">{item.value}</strong>
              <span className="mt-[2px] block text-[11px] text-[#77758B]">{item.label}</span>
            </div>
          ))}
        </section>

        <div className="grid gap-[20px] xl:grid-cols-[248px_minmax(0,1fr)]">
          <aside className="rounded-[20px] border border-[#EEE6DC] bg-white p-[18px] shadow-[0_12px_34px_rgba(48,35,18,0.055)] xl:sticky xl:top-[94px] xl:h-fit">
            <div className="flex items-center gap-[10px] border-b border-[#EEE6DC] pb-[15px] text-[15px] font-extrabold text-[#171936]">
              <div className="grid h-[35px] w-[35px] place-items-center rounded-[12px] bg-[#FFF4D4] text-[18px]">📚</div>
              CPC Workspace
            </div>

            <nav className="mt-[12px] grid gap-[5px]">
              {[
                { label: 'Bare Act Search', icon: '📖', active: true },
                { label: 'Orders & Rules', icon: '⚖', active: false },
                { label: 'Study Notes', icon: '📝', active: false },
                { label: 'Landmark Cases', icon: '🏛', active: false },
                { label: 'MCQs & PYQs', icon: '✍️', active: false },
                { label: 'Saved Topics', icon: '🔖', active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={[
                    'flex items-center gap-[10px] rounded-[11px] px-[11px] py-[10px] text-left text-[12px] font-semibold transition-colors',
                    item.active ? 'bg-[#F3EDFF] text-[#6738E8]' : 'text-[#55516B] hover:bg-[#F3EDFF] hover:text-[#6738E8]',
                  ].join(' ')}
                >
                  <span className="w-[23px] text-center text-[15px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-[17px] rounded-[13px] bg-[linear-gradient(135deg,#fff8e7,#fff)] p-[13px] text-[11px] leading-[1.55] text-[#81798B]">
              <strong className="text-[#171936]">Study tip</strong><br />
              Use the section number, heading or a keyword (for example “res judicata”, “jurisdiction” or “execution”) to narrow the section index.
            </div>
          </aside>

          <div className="grid min-w-0 gap-[16px]">
            <section className="rounded-[20px] border border-[#EEE6DC] bg-white p-[20px] shadow-[0_12px_34px_rgba(48,35,18,0.055)]">
              <div className="mb-[16px] flex items-start justify-between gap-[15px]">
                <div>
                  <h2 className="text-[18px] font-black tracking-[-0.4px] text-[#171936]">Search the Bare Act</h2>
                  <div className="mt-[5px] text-[12px] text-[#77758B] leading-[1.5]">
                    Find a {law.shortTitle} section by number, heading or keyword. Open the official PDF for the authoritative full statutory text.
                  </div>
                </div>
                <span className="inline-flex items-center gap-[7px] rounded-[30px] border border-[#F2D47B] bg-[#FFFDF6] px-[10px] py-[6px] text-[10px] font-extrabold uppercase tracking-[0.65px] text-[#9A7000]">
                  BARE ACT
                </span>
              </div>

              <div className="mb-[16px] flex flex-wrap gap-[6px] border-b border-[#EEE6DC] pb-[12px]">
                {['all', 'core', 'appeals', 'execution'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveGroup(tab === 'all' ? 'all' : tab as 'core' | 'execution' | 'appeals' | 'misc' | 'general')}
                    className={[
                      'rounded-[10px] px-[12px] py-[9px] text-[12px] font-bold',
                      activeGroup === (tab === 'all' ? 'all' : tab)
                        ? 'bg-[#F3EDFF] text-[#6738E8]'
                        : 'bg-transparent text-[#6C687D] hover:bg-[#F7F3FF]',
                    ].join(' ')}
                  >
                    {tab === 'all' ? 'All sections' : tab === 'core' ? 'Important sections' : tab === 'appeals' ? 'Appeals & review' : 'Execution'}
                  </button>
                ))}
              </div>

              <div className="mb-[13px] flex flex-col gap-[10px] md:flex-row">
                <div className="relative flex-1 min-w-0">
                  <span className="pointer-events-none absolute left-[14px] top-1/2 -translate-y-1/2 text-[#928BA1]">⌕</span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search e.g. 11, res judicata, decree, injunction…"
                    className="w-full rounded-[13px] border border-[#E8E1D8] bg-[#FFFDFB] py-[13px] pl-[40px] pr-[14px] text-[13px] text-[#171936] outline-none placeholder:text-[#928BA1] focus:border-[#BDA7FF] focus:shadow-[0_0_0_3px_rgba(103,56,232,0.08)]"
                  />
                </div>
                <select
                  className="rounded-[12px] border border-[#EEE6DC] bg-white px-[12px] py-[12px] text-[12px] text-[#5F5B70] outline-none"
                  value="all"
                  onChange={() => undefined}
                >
                  <option value="all">All parts</option>
                  <option value="pre">Preliminary</option>
                  <option value="suits">Suits in general</option>
                  <option value="execution">Execution</option>
                  <option value="appeals">Appeals / review</option>
                  <option value="misc">Miscellaneous</option>
                </select>
              </div>

              <p className="mb-[10px] text-[11px] text-[#77758B]" aria-live="polite">
                Showing {filteredSections.length} matching references from the curated quick index
              </p>

              <div className="grid gap-[8px]">
                {filteredSections.length > 0 ? (
                  filteredSections.map((section) => (
                    <article key={`${section.number}-${section.title}`} className="grid grid-cols-[58px_minmax(0,1fr)_auto] items-center gap-[12px] rounded-[13px] border border-[#F0EAE3] bg-white p-[12px_13px] transition-colors hover:border-[#D8CAFA] hover:bg-[#FDFBFF]">
                      <div className="rounded-[9px] bg-[#F3EDFF] px-[7px] py-[8px] text-center text-[12px] font-extrabold text-[#6738E8]">§ {section.number}</div>
                      <div>
                        <div className="text-[12px] font-bold leading-[1.4] text-[#171936]">{section.title}</div>
                        <div className="mt-[3px] text-[10px] text-[#77758B]">
                          {section.group === 'core' ? 'Core provision' : section.group === 'execution' ? 'Execution' : section.group === 'appeals' ? 'Appeals / review' : section.group === 'misc' ? 'Miscellaneous' : 'General'}
                        </div>
                      </div>
                      <button type="button" className="rounded-[9px] border-0 bg-[#F7F3FF] px-[10px] py-[8px] text-[11px] font-extrabold text-[#6738E8]">Quick view ↗</button>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[13px] border border-dashed border-[#E8D9C7] bg-[#FFFDF9] p-[30px_12px] text-center text-[13px] text-[#77758B]">
                    No matching section in this quick index. Try another keyword or use the official Bare Act PDF.
                  </div>
                )}
              </div>

              <div className="mt-[14px] flex items-start gap-[10px] rounded-[13px] border border-[#F5E5B6] bg-[#FFF9E9] p-[12px_13px] text-[11px] leading-[1.55] text-[#75633B]">
                <span>💡</span>
                <span><strong>Research note:</strong> This searchable panel is a curated quick index for navigation, not a substitute for the complete and amended statutory text.</span>
              </div>
            </section>

            <section className="rounded-[20px] border border-[#EEE6DC] bg-white p-[20px] shadow-[0_12px_34px_rgba(48,35,18,0.055)]">
              <div className="mb-[16px] flex items-start justify-between gap-[15px]">
                <div>
                  <h2 className="text-[18px] font-black tracking-[-0.4px] text-[#171936]">
                    {law.slug === 'cpc' ? 'First Schedule – Orders & Rules' : `${law.title} – Key Chapters`}
                  </h2>
                  <div className="mt-[5px] text-[12px] text-[#77758B] leading-[1.5]">
                    {law.slug === 'cpc'
                      ? 'Official chapter structure from the Code of Civil Procedure.'
                      : 'Core areas and chapter themes for this statute.'}
                  </div>
                </div>
                <span className="inline-flex items-center gap-[7px] rounded-[30px] border border-[#F2D47B] bg-[#FFFDF6] px-[10px] py-[6px] text-[10px] font-extrabold uppercase tracking-[0.65px] text-[#9A7000]">
                  PROCEDURE
                </span>
              </div>

              <div className="grid gap-[8px] md:grid-cols-4">
                {chapterCards.map((item) => (
                  <button
                    key={`${item.order}-${item.title}`}
                    type="button"
                    className="rounded-[12px] border border-[#EEE6DC] bg-white p-[11px] text-left transition-colors hover:border-[#C9B7FA] hover:bg-[#FDFBFF]"
                  >
                    <strong className="block text-[12px] text-[#171936]">
                      {law.slug === 'cpc' ? `Order ${item.order}` : `Chapter ${item.order}`}
                    </strong>
                    <span className="mt-[4px] block text-[10px] font-semibold text-[#171936]">{item.title}</span>
                    <span className="mt-[4px] block text-[9px] leading-[1.5] text-[#77758B]">{item.summary}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[20px] border border-[#EEE6DC] bg-white p-[20px] shadow-[0_12px_34px_rgba(48,35,18,0.055)]">
              <div className="mb-[16px] flex items-start justify-between gap-[15px]">
                <div>
                  <h2 className="text-[18px] font-black tracking-[-0.4px] text-[#171936]">Continue Learning</h2>
                  <div className="mt-[5px] text-[12px] text-[#77758B] leading-[1.5]">A structured study path beyond reading the bare text.</div>
                </div>
              </div>

              <div className="grid gap-[10px] md:grid-cols-3">
                {[
                  { icon: '📝', title: 'Topic-wise Notes', text: 'Concept explanations, flowcharts, illustrations and quick revision points.', link: 'Explore notes →' },
                  { icon: '⚖', title: 'Landmark Case Laws', text: 'Important judgments mapped to relevant sections and procedural principles.', link: 'Explore cases →' },
                  { icon: '✍️', title: 'MCQs & PYQs', text: 'Practice questions, previous-year questions and explanations for each answer.', link: 'Start practice →' },
                ].map((item, index) => (
                  <article key={item.title} className="rounded-[14px] border border-[#EEE6DC] bg-white p-[14px]">
                    <div className={[
                      'mb-[10px] grid h-[34px] w-[34px] place-items-center rounded-[11px] text-[17px]',
                      index === 0 ? 'bg-[#F3EDFF]' : index === 1 ? 'bg-[#FFF4D4]' : 'bg-[#FFF0E7]',
                    ].join(' ')}>{item.icon}</div>
                    <strong className="block text-[12px] text-[#171936]">{item.title}</strong>
                    <p className="mt-[5px] mb-[11px] text-[10px] leading-[1.5] text-[#77758B]">{item.text}</p>
                    <a href="#" className="text-[10px] font-extrabold text-[#6738E8] no-underline">{item.link}</a>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-[18px] text-center text-[10px] leading-[1.6] text-[#938DA0]">
          *The section count is an index reference; inserted provisions, omitted provisions and amendments may affect numbering. Always verify against the official text and applicable local amendments.<br />
          Official source: Legislative Department, Ministry of Law and Justice, Government of India.
        </div>
      </main>
    </div>
  )
}
