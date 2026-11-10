import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLaws } from '@/services/lawService'

type LawSection = {
  number: string
  title: string
  group: 'core' | 'execution' | 'appeals' | 'misc' | 'general'
  description: string
  range?: string
  fullText?: string
}

type LawChapter = {
  code: string
  title: string
  summary: string
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
  sourceUrl: string
  sourceLabel: string
  chapters: LawChapter[]
  sections: LawSection[]
  parts?: LawSection[]
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
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2191',
    sourceLabel: 'Official source',
    chapters: [
      { code: 'I', title: 'Suits in General', summary: 'Parties, framing and institution of suits.' },
      { code: 'II', title: 'Frame of Suit', summary: 'Suit structure and cause of action requirements.' },
      { code: 'V', title: 'Issue and Service of Summons', summary: 'Service, appearance and summon procedure.' },
      { code: 'VI', title: 'Pleadings Generally', summary: 'General rules for pleadings and written submissions.' },
      { code: 'VII', title: 'Plaint', summary: 'Contents, drafting and filing of the plaint.' },
      { code: 'VIII', title: 'Written Statement', summary: 'Defence, set-off and counterclaims.' },
      { code: 'IX', title: 'Appearance and Non-Appearance', summary: 'Procedural consequences of default or appearance.' },
      { code: 'X', title: 'Examination of Parties', summary: 'Court-led examination of parties and issues.' },
      { code: 'XI', title: 'Discovery and Inspection', summary: 'Document production and fact discovery.' },
      { code: 'XIV', title: 'Settlement of Issues', summary: 'Issue framing and adjudication process.' },
      { code: 'XVIII', title: 'Judgment and Decree', summary: 'Pronouncement of judgments and decrees.' },
      { code: 'XXI', title: 'Execution of Decrees', summary: 'Execution, attachment and satisfaction.' },
      { code: 'XXXIX', title: 'Temporary Injunctions', summary: 'Interim relief and injunction procedure.' },
      { code: 'XLI', title: 'Appeals from Decrees', summary: 'Appeal structure and procedural framework.' },
      { code: 'XLVII', title: 'Review', summary: 'Review mechanism and reconsideration.' },
    ],
    sections: [
      { number: '1', title: 'Short title, commencement and extent', group: 'core', description: 'Provides the short title, commencement and territorial extent of the Code.', fullText: 'Section 1 lays down the short title, commencement and extent of the Code of Civil Procedure. It provides the legal framework for the application of the Code across the territory of India and marks the commencement of the procedural law in civil matters.' },
      { number: '2', title: 'Definitions', group: 'core', description: 'Defines key expressions like decree, judgment, legal representative and mesne profits.', fullText: 'Section 2 defines several important terms used throughout the Code, including "decree", "judgment", "legal representative", "mesne profits" and related expressions. These definitions are integral to understanding the structure and operation of civil procedure.' },
      { number: '9', title: 'Courts to try all civil suits unless barred', group: 'core', description: 'Civil courts have jurisdiction to try suits of a civil nature unless specifically barred.', fullText: 'Section 9 recognises the jurisdiction of civil courts to try all suits of a civil nature unless the cognizance is excluded by any statute. It is the foundational jurisdictional provision of civil procedure in India.' },
      { number: '15', title: 'Court in which suits to be instituted', group: 'core', description: 'Requires suits to be instituted in the court of the lowest grade competent to try them.', fullText: 'Section 15 lays down the forum for institution of suits, emphasising that a suit must be filed in the court of the lowest grade competent to try it. The provision seeks to ensure accessibility, efficiency and territorial correctness in the adjudicatory process.' },
      { number: '20', title: 'Other suits to be instituted where defendants reside or cause of action arises', group: 'core', description: 'Provides the general place-of-suing rule for suits not otherwise governed by specific provisions.', fullText: 'Section 20 provides the general rule for territorial jurisdiction by stating that a suit should be instituted in a court within whose local jurisdiction either the defendant resides or the cause of action arises. It is a key provision governing forum selection.' },
      { number: '24', title: 'General power of transfer and withdrawal', group: 'core', description: 'Confers powers on courts to transfer or withdraw cases in the interest of justice.', fullText: 'Section 24 empowers High Courts and civil courts to transfer or withdraw cases from one court to another in the interests of justice, convenience of parties and fair adjudication. It prevents procedural injustice and forum shopping.' },
      { number: '30', title: 'Power to order discovery and the like', group: 'general', description: 'Covers discovery, inspection, admissions and document production to facilitate fair adjudication.', fullText: 'Section 30 enables the court to order discovery, inspection and other related procedural measures to ensure that relevant facts and documents are produced for adjudication. It plays a central role in managing the fact-finding process.' },
      { number: '33', title: 'Judgment and decree', group: 'core', description: 'Provides for the pronouncement of judgment and the drawing up of a decree.', fullText: 'Section 33 is central to the conclusion of civil litigation. It establishes the requirement that a court, after hearing, must pronounce judgment and pass a decree, giving effect to the rights as determined in the suit.' },
      { number: '36', title: 'Application to orders', group: 'execution', description: 'Applies decree execution provisions to orders so far as they are applicable.', fullText: 'Section 36 provides that the provisions relating to decrees apply to orders as far as may be applicable. It ensures that procedural remedies and execution rules are coherent across decrees and orders.' },
      { number: '47', title: 'Questions to be determined by the Court executing decree', group: 'execution', description: 'The executing court determines questions relating to execution, discharge and satisfaction.', fullText: 'Section 47 empowers the executing court to decide questions arising in relation to the execution, discharge and satisfaction of a decree. The provision ensures that execution is not divorced from the adjudicated rights.' },
      { number: '51', title: 'Powers of Court to enforce execution', group: 'execution', description: 'Lists modes by which a decree may be enforced by the court.', fullText: 'Section 51 enumerates the powers of the court to enforce a decree, including attachment and sale, arrest and detention, appointment of receiver and other ancillary processes. It is essential to the practical enforcement of civil remedies.' },
      { number: '80', title: 'Notice', group: 'misc', description: 'Provides for notice before suits against Government or public officers.', fullText: 'Section 80 requires prior notice before a suit is instituted against the Government or a public officer in respect of an act done in official capacity. It is a procedural safeguard and a condition precedent in many cases.' },
      { number: '96', title: 'Appeal from original decree', group: 'appeals', description: 'Provides for appellate remedies from original decrees subject to the statutory framework.', fullText: 'Section 96 provides the general right of appeal against an original decree. It is an important statutory basis for redressing errors in adjudication and allowing higher court review.' },
      { number: '100', title: 'Second appeal', group: 'appeals', description: 'A second appeal lies to the High Court on a substantial question of law.', fullText: 'Section 100 restricts second appeals to substantial questions of law. It preserves the structure of appellate review while limiting unnecessary re-litigation and ensuring judicial economy.' },
      { number: '113', title: 'Reference to High Court', group: 'appeals', description: 'Outlines reference procedures to the High Court where a question of law arises.', fullText: 'Section 113 deals with references to the High Court where a civil court has to decide a question of law, especially in the context of the court being bound by a lower court ruling or statutory interpretation.' },
      { number: '114', title: 'Review', group: 'appeals', description: 'Allows review of decrees or orders under the circumstances provided by law.', fullText: 'Section 114 provides the statutory basis for review of decrees or orders, while Order XLVII sets out the procedural conditions and requirements for exercising that power. Review is a narrow remedy to correct manifest errors.' },
      { number: '151', title: 'Saving of inherent powers of Court', group: 'misc', description: 'Preserves inherent powers to secure ends of justice and prevent abuse of process.', fullText: 'Section 151 preserves the inherent powers of the court to do justice and prevent abuse of the court process. It is a residual authority to secure the ends of justice where the Code is silent or inadequate.' },
    ],
    parts: [
      { number: '1', title: 'Preliminary', range: 'Sec. 1-8', group: 'core', description: 'General definitions and the jurisdictional foundation of civil procedure.', fullText: 'Part I deals with the preliminary provisions of the Code. It includes the short title, commencement, extent and the foundational definitions that make the rest of the procedural framework intelligible. The provisions in this part clarify the scope, application and key terminology of the Code.' },
      { number: '2', title: 'Suits in general', range: 'Sec. 9-35B', group: 'core', description: 'Institution, jurisdiction and the general structure of suits.', fullText: 'Part II covers suits in general. It addresses the jurisdiction of civil courts, institution of suits, the place of suing, transfer and withdrawal of proceedings, and the general rules governing civil adjudication. This part establishes the procedural architecture for bringing and conducting civil claims.' },
      { number: '3', title: 'Execution', range: 'Sec. 36-74', group: 'execution', description: 'Execution of decrees and orders and enforcement mechanisms.', fullText: 'Part III deals with execution of decrees and orders. It sets out the process for enforcing judgments, including attachment, sale and satisfaction of decrees. The part is critical because it transforms a decree into enforceable relief for the successful party.' },
      { number: '4', title: 'Incidental proceedings', range: 'Sec. 75-78', group: 'general', description: 'Incidental and ancillary proceedings before and after decree.', fullText: 'Part IV addresses incidental proceedings and the principles connected with the proper conduct of civil adjudication. It covers procedural safeguards that support the effective administration of justice between the institution of a suit and the eventual execution of the decree.' },
      { number: '5', title: 'Suits in particular cases', range: 'Sec. 79-88', group: 'core', description: 'Special suits and procedural rules for specific claims and persons.', fullText: 'Part V deals with suits in particular cases, including suits involving public officers, government claims and other specified factual or legal contexts. It creates special procedural rules in order to balance access to justice with the distinct nature of certain disputes.' },
      { number: '6', title: 'Special proceedings', range: 'Sec. 89-93', group: 'general', description: 'Alternative dispute resolution and special judicial mechanisms.', fullText: 'Part VI contains special proceedings, including the court-assisted settlement and conciliation mechanism. These provisions are intended to facilitate efficient and consensual dispute resolution beyond the ordinary adjudicatory route.' },
      { number: '7', title: 'Supplemental proceedings', range: 'Sec. 94-95', group: 'general', description: 'Supplemental procedural powers to secure effective justice.', fullText: 'Part VII deals with supplemental proceedings that assist the court in securing the ends of justice. These provisions enable the court to grant interim and ancillary relief where necessary to support the rights adjudicated in the suit.' },
      { number: '8', title: 'Appeals', range: 'Sec. 96-112', group: 'appeals', description: 'Appeal structure, grounds and appellate procedure.', fullText: 'Part VIII governs appeals. It sets out the rights of appeal, the jurisdiction of the appellate court and the procedural framework within which appeals are heard. This part is central to the correction of legal and factual error in civil justice.' },
      { number: '9', title: 'Reference, review and revision', range: 'Sec. 113-115', group: 'appeals', description: 'Reference, review and revision mechanisms before higher judicial authority.', fullText: 'Part IX contains the provisions on reference, review and revision. These powers allow higher courts to correct serious errors, resolve legal questions and ensure uniformity in the application of law through the judicial hierarchy.' },
      { number: '10', title: 'Special provisions relating to the High Courts not being the court of a judicial commissioner', range: 'Sec. 116-120', group: 'misc', description: 'High Court procedural rules and special jurisdictional arrangements.', fullText: 'Part X deals with special provisions relating to High Courts not being the court of a judicial commissioner. It addresses the procedural relationship of courts within the appellate structure and preserves the distinct role of the High Court.' },
      { number: '11', title: 'Rules', range: 'Sec. 121-131', group: 'general', description: 'Procedural rules and supplementary matters under the Code.', fullText: 'Part XI contains the general rules under the Code and supplements the structure of proceedings by providing procedural clarity. It ensures the Code remains operational and adaptable to a range of civil disputes and court practices.' },
      { number: '12', title: 'Miscellaneous', range: 'Sec. 132 onward', group: 'misc', description: 'Residual and miscellaneous provisions of the Code.', fullText: 'Part XII includes miscellaneous provisions, including the court’s inherent powers and other residual procedural matters necessary to complete the legal architecture of civil procedure. It ensures the Code remains capable of dealing with matters not expressly covered in other parts.' },
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
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2974',
    sourceLabel: 'Official source',
    chapters: [
      { code: '1', title: 'Introductory', summary: 'Nature and definition of contract.' },
      { code: '2', title: 'Offer, Acceptance and Agreement', summary: 'Essential elements of valid agreement formation.' },
      { code: '3', title: 'Consideration', summary: 'Lawful consideration and adequacy.' },
      { code: '4', title: 'Capacity to Contract', summary: 'Competency and incapacity of parties.' },
      { code: '5', title: 'Free Consent', summary: 'Coercion, fraud, misrepresentation and undue influence.' },
      { code: '6', title: 'Legality of Object', summary: 'Lawful consideration and public policy restrictions.' },
      { code: '7', title: 'Void Agreements', summary: 'Agreements that are not enforceable.' },
      { code: '8', title: 'Contingent Contracts', summary: 'Conditional agreements and uncertain events.' },
      { code: '9', title: 'Performance of Contract', summary: 'Execution and discharge of obligations.' },
      { code: '10', title: 'Breach and Damages', summary: 'Remedies and compensation for breach.' },
    ],
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
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2170',
    sourceLabel: 'Official source',
    chapters: [
      { code: '1', title: 'Preliminary', summary: 'Definitions and general application of the Act.' },
      { code: '2', title: 'Transfer of Property', summary: 'General rules of transfer and valid transactions.' },
      { code: '3', title: 'Sales of Immovable Property', summary: 'Sale essentials and rights of parties.' },
      { code: '4', title: 'Mortgages and Charges', summary: 'Security interests and rights of mortgagor and mortgagee.' },
      { code: '5', title: 'Leases', summary: 'Creation and termination of leases.' },
      { code: '6', title: 'Exchange, Gift and Transfer', summary: 'Property transfers by exchange and gift.' },
    ],
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
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2172',
    sourceLabel: 'Official source',
    chapters: [
      { code: '1', title: 'Preliminary', summary: 'Scope and interpretation of the Act.' },
      { code: '2', title: 'Specific Relief', summary: 'Remedies of specific performance and injunctions.' },
      { code: '3', title: 'Rectification and Cancellation', summary: 'Correction and invalidation of instruments.' },
      { code: '4', title: 'Declaratory Decrees', summary: 'Judicial declarations and equitable relief.' },
    ],
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
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2157',
    sourceLabel: 'Official source',
    chapters: [
      { code: '1', title: 'Preliminary', summary: 'Definitions and scope of limitation.' },
      { code: '2', title: 'Limitation of Suits', summary: 'Prescribed periods for civil claims.' },
      { code: '3', title: 'Computation of Period', summary: 'How limitation periods are calculated.' },
      { code: '4', title: 'Acquisition of Ownership', summary: 'Adverse possession and title acquisition.' },
    ],
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
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/1981',
    sourceLabel: 'Official source',
    chapters: [
      { code: '1', title: 'Marriage and Family Relations', summary: 'Essentials of marriage and family obligations.' },
      { code: '2', title: 'Maintenance and Support', summary: 'Spousal and dependent maintenance rules.' },
      { code: '3', title: 'Divorce and Judicial Separation', summary: 'Grounds and process for matrimonial relief.' },
      { code: '4', title: 'Guardianship', summary: 'Custody, guardianship and welfare principles.' },
    ],
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

const normalizeLawSlug = (value: string) => {
  const slug = slugify(value)
  return slug.replace(/-(?:19|20)\d{2}$/, '')
}

type WorkspaceTab =
  | 'bare-act-search'
  | 'orders-rules'
  | 'study-notes'
  | 'landmark-cases'
  | 'mcqs-pyqs'
  | 'saved-topics'

export function LawDetailPage() {
  const { lawSlug } = useParams<{ lawSlug: string }>()
  const [search, setSearch] = useState('')
  const [activeGroup, setActiveGroup] = useState<'all' | 'core' | 'execution' | 'appeals' | 'misc' | 'general'>('all')
  const [selectedSection, setSelectedSection] = useState<LawSection | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<LawChapter | null>(null)
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab>('bare-act-search')
  const [modalSection, setModalSection] = useState<LawSection | null>(null)
  const [apiLaws, setApiLaws] = useState<Array<{ title: string; slug: string; subcategories: string[] }>>([])

  const normalizedLawSlug = lawSlug ? normalizeLawSlug(lawSlug) : ''
  const law = lawDetails.find((item) => {
    const aliases = new Set([
      item.slug,
      slugify(item.title),
      normalizeLawSlug(item.slug),
      normalizeLawSlug(item.title),
      normalizedLawSlug,
    ])

    return aliases.has(lawSlug ?? '') || aliases.has(normalizedLawSlug)
  })

  useEffect(() => {
    let isMounted = true

    const loadLaws = async () => {
      try {
        const laws = await getLaws()
        if (!isMounted) return

        const mapped = laws.map((item) => ({
          title: item.title,
          slug: item.slug || slugify(item.title),
          subcategories: Array.isArray(item.subcategories) && item.subcategories.length > 0 ? item.subcategories : item.subcategory ? [item.subcategory] : [],
        }))

        setApiLaws(mapped.length > 0 ? mapped : lawDetails.map((item) => ({
          title: item.title,
          slug: item.slug,
          subcategories: item.quickLinks.slice(0, 4),
        })))
      } catch {
        if (!isMounted) return
        setApiLaws(
          lawDetails.map((item) => ({
            title: item.title,
            slug: item.slug,
            subcategories: item.quickLinks.slice(0, 4),
          }))
        )
      }
    }

    void loadLaws()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!law) return

    setSelectedSection(law.sections[0] ?? null)
    setSelectedChapter(law.chapters[0] ?? null)
    setActiveGroup('all')
    setSearch('')
    setActiveWorkspaceTab('bare-act-search')
  }, [law])

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

  const chapterCards = law?.chapters.length
    ? law.chapters
    : law?.quickLinks.map((item, index) => ({
        code: String(index + 1).padStart(2, '0'),
        title: item,
        summary: 'Key legal concept under the selected act.',
      })) ?? []

  const activeSection = selectedSection ?? filteredSections[0] ?? law?.sections[0] ?? null
  const activeChapter = selectedChapter ?? chapterCards[0] ?? null

  const openSectionModal = (section: LawSection) => {
    setModalSection(section)
  }

  const closeSectionModal = () => setModalSection(null)

  const workspaceTabs: Array<{ key: WorkspaceTab; label: string; icon: string }> = [
    { key: 'bare-act-search', label: 'Bare Act Search', icon: '📖' },
    { key: 'orders-rules', label: 'Orders & Rules', icon: '⚖' },
    { key: 'study-notes', label: 'Study Notes', icon: '📝' },
    { key: 'landmark-cases', label: 'Landmark Cases', icon: '🏛' },
    { key: 'mcqs-pyqs', label: 'MCQs & PYQs', icon: '✍️' },
    { key: 'saved-topics', label: 'Saved Topics', icon: '🔖' },
  ]

  const tabDescription: Record<WorkspaceTab, string> = {
    'bare-act-search': 'Use the section number, heading or a keyword to narrow the index.',
    'orders-rules': 'Review procedural rules, orders, and important application points across the act.',
    'study-notes': 'Read concise, structured notes for revisions and quick recall.',
    'landmark-cases': 'Explore major case law and judicial principles linked to this act.',
    'mcqs-pyqs': 'Practice objective questions and previous-year style problem sets.',
    'saved-topics': 'Keep your bookmarked sections, notes, and law references in one place.',
  }

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
            <a href={law.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-[8px] rounded-[12px] border border-[#171936] bg-[#171936] px-[14px] py-[10px] text-[12px] font-bold text-white no-underline shadow-[0_12px_34px_rgba(48,35,18,0.055)] transition-transform hover:-translate-y-[1px] hover:shadow-[0_12px_34px_rgba(48,35,18,0.055)]">
              ↗ Official Bare Act PDF
            </a>
            <a href={law.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-[8px] rounded-[12px] border border-[#EEE6DC] bg-white px-[14px] py-[10px] text-[12px] font-bold text-[#171936] no-underline shadow-[0_12px_34px_rgba(48,35,18,0.055)] transition-transform hover:-translate-y-[1px] hover:shadow-[0_12px_34px_rgba(48,35,18,0.055)]">
              {law.sourceLabel} ↗
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

        <div className="grid gap-[20px] xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[20px] border border-[#EEE6DC] bg-[#F7F2EA] p-[18px] shadow-[0_10px_24px_rgba(48,35,18,0.03)] xl:sticky xl:top-[94px] xl:h-fit">
            <div className="rounded-[16px] border border-[#E9DECA] bg-[#F8F3E9] p-[12px]">
              <div className="flex items-center gap-[10px] pb-[10px] text-[15px] font-extrabold text-[#171936]">
                <div className="grid h-[36px] w-[36px] place-items-center rounded-[11px] bg-[#F6D98E] text-[18px] shadow-inner shadow-white/60">📚</div>
                <span>Base Acts</span>
              </div>

              <div className="space-y-2">
                {apiLaws.map((item) => (
                  <div key={item.slug} className="rounded-[12px] border border-[#F0E8DC] bg-white px-[10px] py-[8px]">
                    <Link
                      to={`/categories/${item.slug}`}
                      className="flex items-center justify-between gap-3 text-left text-[15px] font-bold text-[#171936] transition-colors hover:text-[#5F42D9]"
                    >
                      <span>{item.title}</span>
                      <span className="text-[18px] text-[#A59AAE]">›</span>
                    </Link>

                    {item.subcategories.length > 0 && (
                      <div className="mt-2 space-y-1 border-t border-[#F1E8DD] pt-2">
                        {item.subcategories.slice(0, 4).map((subcategory) => (
                          <Link
                            key={`${item.slug}-${subcategory}`}
                            to={`/categories/${item.slug}`}
                            className="block text-[11px] font-medium text-[#625E73] transition-colors hover:text-[#171936]"
                          >
                            {subcategory}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <nav className="mt-[18px] grid gap-[6px]">
              {workspaceTabs.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveWorkspaceTab(item.key)}
                  className={[
                    'flex items-center gap-[10px] rounded-[12px] border px-[12px] py-[10px] text-left text-[12px] font-semibold transition-all',
                    activeWorkspaceTab === item.key
                      ? 'border-[#D9C7FF] bg-[#EAE3FF] text-[#171936] shadow-[0_8px_18px_rgba(103,56,232,0.08)]'
                      : 'border-transparent bg-transparent text-[#55516B] hover:bg-[#EFE9FF] hover:text-[#171936]',
                  ].join(' ')}
                >
                  <span className="grid h-[24px] w-[24px] place-items-center rounded-[8px] bg-white text-[14px] shadow-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-[18px] rounded-[14px] border border-[#E7DCC9] bg-[#F9F3E7] p-[12px_13px] text-[11px] leading-[1.55] text-[#6D5E50]">
              <strong className="block text-[#171936]">Study tip</strong>
              {tabDescription[activeWorkspaceTab]}
            </div>
          </aside>

          <div className="grid min-w-0 gap-[16px]">
            <section className="rounded-[20px] border border-[#EEE6DC] bg-white p-[20px] shadow-[0_12px_34px_rgba(48,35,18,0.055)]">
              <div className="mb-[16px] flex items-start justify-between gap-[15px]">
                <div>
                  <h2 className="text-[18px] font-black tracking-[-0.4px] text-[#171936]">
                    {activeWorkspaceTab === 'bare-act-search' ? 'Bare Act Search' : activeWorkspaceTab === 'orders-rules' ? 'Orders & Rules' : activeWorkspaceTab === 'study-notes' ? 'Study Notes' : activeWorkspaceTab === 'landmark-cases' ? 'Landmark Cases' : activeWorkspaceTab === 'mcqs-pyqs' ? 'MCQs & PYQs' : 'Saved Topics'}
                  </h2>
                  <div className="mt-[6px] text-[12px] text-[#77758B] leading-[1.5]">
                    {tabDescription[activeWorkspaceTab]}
                  </div>
                </div>
                <span className="inline-flex items-center gap-[7px] rounded-[30px] border border-[#F2D47B] bg-[#FFFDF6] px-[10px] py-[6px] text-[10px] font-extrabold uppercase tracking-[0.65px] text-[#9A7000]">
                  {activeWorkspaceTab === 'bare-act-search' ? 'Bare Act' : activeWorkspaceTab === 'orders-rules' ? 'Rules' : activeWorkspaceTab === 'study-notes' ? 'Notes' : activeWorkspaceTab === 'landmark-cases' ? 'Cases' : activeWorkspaceTab === 'mcqs-pyqs' ? 'Practice' : 'Saved'}
                </span>
              </div>

              {activeWorkspaceTab === 'bare-act-search' && (
                <>
                  {law.parts && law.parts.length > 0 ? (
                    <div className="grid gap-0 overflow-hidden rounded-[18px] border border-[#E7E2DB] bg-[#F5F1EE]">
                      {law.parts.map((part) => (
                        <button
                          key={`${part.number}-${part.title}`}
                          type="button"
                          onClick={() => {
                            setSelectedSection(part)
                            openSectionModal(part)
                          }}
                          className="flex w-full items-center justify-between border-b border-[#E7E2DB] bg-[#F2F0EE] px-[18px] py-[18px] text-left transition-colors last:border-b-0 hover:bg-[#EFEAE7]"
                        >
                          <div className="min-w-0 pr-4">
                            <div className="text-[16px] font-black leading-[1.3] tracking-[-0.04em] text-[#171936] md:text-[18px]">
                              {part.title}
                            </div>
                            {part.range ? (
                              <div className="mt-[4px] text-[13px] leading-[1.4] text-[#6D687B] md:text-[14px]">
                                ({part.range})
                              </div>
                            ) : null}
                          </div>

                          <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[#E2D9CF] bg-white text-[22px] text-[#171936]">
                            ›
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[13px] border border-dashed border-[#E8D9C7] bg-[#FFFDF9] p-[30px_12px] text-center text-[13px] text-[#77758B]">
                      No matching section in this quick index. Try another keyword or use the official Bare Act PDF.
                    </div>
                  )}
                </>
              )}

              {activeWorkspaceTab !== 'bare-act-search' && (
                <div className="grid gap-[12px] md:grid-cols-2">
                  <div className="rounded-[14px] border border-[#EEE6DC] bg-[#FFFDFB] p-[16px]">
                    <div className="mb-[6px] text-[10px] font-extrabold uppercase tracking-[0.7px] text-[#7A6F8B]">Focus area</div>
                    <div className="text-[18px] font-black tracking-[-0.04em] text-[#171936]">
                      {activeWorkspaceTab === 'orders-rules' ? 'Procedural framework' : activeWorkspaceTab === 'study-notes' ? 'Revision summary' : activeWorkspaceTab === 'landmark-cases' ? 'Judicial interpretation' : activeWorkspaceTab === 'mcqs-pyqs' ? 'Practice set' : 'Saved references'}
                    </div>
                    <p className="mt-[10px] text-[11px] leading-[1.6] text-[#5E5B6A]">
                      {activeWorkspaceTab === 'orders-rules'
                        ? 'A quick map of order-wise procedural rules and their practical application.'
                        : activeWorkspaceTab === 'study-notes'
                          ? 'Concise revision notes for the most relevant provisions, doctrines and exceptions.'
                          : activeWorkspaceTab === 'landmark-cases'
                            ? 'Important judicial rulings that interpret the act and influence practice.'
                            : activeWorkspaceTab === 'mcqs-pyqs'
                              ? 'A curated set of objective questions and exam-style problems.'
                              : 'Your bookmarked sections, notes, and law references remain available here.'}
                    </p>
                  </div>

                  <div className="rounded-[14px] border border-[#EEE6DC] bg-[#F7F3FF] p-[16px]">
                    <div className="mb-[6px] text-[10px] font-extrabold uppercase tracking-[0.7px] text-[#7A6F8B]">Current topic</div>
                    <div className="text-[16px] font-black tracking-[-0.03em] text-[#171936]">{activeSection ? activeSection.title : 'Select a section'}</div>
                    <p className="mt-[10px] text-[11px] leading-[1.6] text-[#5E5B6A]">
                      {activeSection ? activeSection.description : 'Choose a section from the quick index to view its summary.'}
                    </p>
                  </div>
                </div>
              )}
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
                    key={`${item.code}-${item.title}`}
                    type="button"
                    onClick={() => setSelectedChapter(item)}
                    className={[
                      'rounded-[12px] border p-[11px] text-left transition-colors',
                      activeChapter && activeChapter.title === item.title && activeChapter.code === item.code
                        ? 'border-[#C9B7FA] bg-[#F7F3FF]'
                        : 'border-[#EEE6DC] bg-white hover:border-[#C9B7FA] hover:bg-[#FDFBFF]',
                    ].join(' ')}
                  >
                    <strong className="block text-[12px] text-[#171936]">
                      {law.slug === 'cpc' ? `Order ${item.code}` : `Chapter ${item.code}`}
                    </strong>
                    <span className="mt-[4px] block text-[10px] font-semibold text-[#171936]">{item.title}</span>
                    <span className="mt-[4px] block text-[9px] leading-[1.5] text-[#77758B]">{item.summary}</span>
                  </button>
                ))}
              </div>

              {activeChapter && (
                <div className="mt-[16px] rounded-[15px] border border-[#EEE6DC] bg-[#FFFDFB] p-[16px]">
                  <div className="mb-[7px] text-[10px] font-extrabold uppercase tracking-[0.7px] text-[#7A6F8B]">Selected chapter</div>
                  <div className="flex items-center justify-between gap-[10px]">
                    <div>
                      <div className="text-[16px] font-black tracking-[-0.03em] text-[#171936]">{activeChapter.title}</div>
                      <div className="mt-[4px] text-[11px] text-[#77758B]">
                        {law.slug === 'cpc' ? `Order ${activeChapter.code}` : `Chapter ${activeChapter.code}`}
                      </div>
                    </div>
                    <span className="rounded-full bg-[#FFF4D4] px-[8px] py-[5px] text-[10px] font-bold text-[#8A5B00]">Quick guide</span>
                  </div>
                  <p className="mt-[10px] text-[11px] leading-[1.7] text-[#5E5B6A]">{activeChapter.summary}</p>
                </div>
              )}
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
                  { icon: '📝', title: 'Topic-wise Notes', text: 'Concept explanations, flowcharts, illustrations and quick revision points.', linkLabel: 'Explore notes →', action: () => setSelectedSection(law.sections[0] ?? null) },
                  { icon: '⚖', title: 'Landmark Case Laws', text: 'Important judgments mapped to relevant sections and procedural principles.', linkLabel: 'Explore cases →', action: () => setSelectedSection(law.sections[Math.min(1, law.sections.length - 1)] ?? law.sections[0] ?? null) },
                  { icon: '✍️', title: 'MCQs & PYQs', text: 'Practice questions, previous-year questions and explanations for each answer.', linkLabel: 'Start practice →', action: () => setSelectedChapter(chapterCards[0] ?? null) },
                ].map((item, index) => (
                  <article key={item.title} className="rounded-[14px] border border-[#EEE6DC] bg-white p-[14px]">
                    <div className={[
                      'mb-[10px] grid h-[34px] w-[34px] place-items-center rounded-[11px] text-[17px]',
                      index === 0 ? 'bg-[#F3EDFF]' : index === 1 ? 'bg-[#FFF4D4]' : 'bg-[#FFF0E7]',
                    ].join(' ')}>{item.icon}</div>
                    <strong className="block text-[12px] text-[#171936]">{item.title}</strong>
                    <p className="mt-[5px] mb-[11px] text-[10px] leading-[1.5] text-[#77758B]">{item.text}</p>
                    <button type="button" onClick={item.action} className="bg-transparent p-0 text-[10px] font-extrabold text-[#6738E8] no-underline">
                      {item.linkLabel}
                    </button>
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

      {modalSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171936]/55 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-3xl overflow-hidden rounded-[24px] border border-[#E7DCC9] bg-[#FFFCF8] shadow-[0_20px_60px_rgba(23,25,54,0.2)]">
            <div className="flex items-center justify-between border-b border-[#EEE6DC] bg-white px-5 py-4">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.7px] text-[#7A6F8B]">Section {modalSection.number}</div>
                <h3 className="mt-[3px] text-[24px] font-black tracking-[-0.05em] text-[#171936]">{modalSection.title}</h3>
              </div>
              <button
                type="button"
                onClick={closeSectionModal}
                className="grid h-[36px] w-[36px] place-items-center rounded-full border border-[#E7DED1] bg-[#FFFDFB] text-[18px] text-[#171936] transition-opacity hover:opacity-80"
                aria-label="Close section view"
              >
                ×
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
              <div className="mb-4 inline-flex rounded-full bg-[#F3EDFF] px-[10px] py-[6px] text-[10px] font-extrabold uppercase tracking-[0.7px] text-[#6738E8]">
                {modalSection.group === 'core' ? 'Core provision' : modalSection.group === 'execution' ? 'Execution' : modalSection.group === 'appeals' ? 'Appeals / review' : modalSection.group === 'misc' ? 'Miscellaneous' : 'General'}
              </div>

              <p className="text-[14px] leading-[1.8] text-[#3F3B48]">
                {modalSection.fullText ?? modalSection.description}
              </p>

              <div className="mt-5 rounded-[16px] border border-[#F0EAE3] bg-[#FFFDFB] p-[16px]">
                <div className="mb-[8px] text-[10px] font-extrabold uppercase tracking-[0.7px] text-[#7A6F8B]">Legal interpretation</div>
                <p className="text-[13px] leading-[1.8] text-[#5B586A]">
                  {law.title} is a procedural code, and this provision is part of the system that governs how civil disputes are heard, decided and enforced. The provision influences the rights of parties, the court’s procedural powers, and the available remedies. It should be read together with the surrounding provisions and the broader scheme of the Code.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-[8px]">
                
                <button
                  type="button"
                  onClick={closeSectionModal}
                  className="inline-flex items-center rounded-full border border-[#D9D1C7] bg-white px-[12px] py-[8px] text-[11px] font-bold text-[#171936]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
