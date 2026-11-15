import 'dotenv/config'
import { PrismaClient } from './generated/prisma/client';
const prisma = new PrismaClient()

const categories = [
  { name: 'Civil Law', slug: 'civil-law', description: 'Civil rights, procedure and property laws', status: 'LIVE' },
  { name: 'Commercial Law', slug: 'commercial-law', description: 'Commercial transactions and contract law', status: 'LIVE' },
  { name: 'Banking Law', slug: 'banking-law', description: 'Banking, finance and recovery frameworks', status: 'LIVE' },
  { name: 'Criminal Law', slug: 'criminal-law', description: 'Criminal offences and legal procedure', status: 'LIVE' },
]

const courses = [
  {
    title: 'Civil Procedure Essentials',
    category: 'Civil Law',
    level: 'BEGINNER',
    duration: '4 weeks',
    status: 'PUBLISHED',
    summary: 'Core principles of civil procedure and court process.',
  },
  {
    title: 'Contract Drafting and Remedies',
    category: 'Commercial Law',
    level: 'INTERMEDIATE',
    duration: '6 weeks',
    status: 'PUBLISHED',
    summary: 'Practical contract drafting and enforceable remedies.',
  },
  {
    title: 'Banking Recovery Framework',
    category: 'Banking Law',
    level: 'ADVANCED',
    duration: '5 weeks',
    status: 'DRAFT',
    summary: 'Recovery and enforcement under banking law.',
  },
]

const laws = [
  {
    title: 'Code of Civil Procedure, 1908',
    shortTitle: 'CPC',
    slug: 'code-of-civil-procedure-1908',
    category: 'Civil Law',
    jurisdiction: 'India',
    summary:
      'The Code of Civil Procedure governs procedural rules for civil litigation in India, covering suits, appeals, execution and jurisdictional principles.',
    sourceUrl: 'https://www.indiacode.nic.in/',
    sourceLabel: 'India Code',
    status: 'PUBLISHED',
    pdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/....pdf',
    pdfExtractedText:
      'Chapter 1: Jurisdiction. The code defines the court’s authority to adjudicate civil disputes. Chapter 2: Pleadings. Parties must set out facts and legal claims clearly.',
    subcategories: ['Procedural Law', 'Civil Remedies', 'Evidence'],
    chapters: [
      { title: 'Jurisdiction', content: 'Rules governing a court’s power to hear and decide a civil matter.' },
      { title: 'Pleadings', content: 'Framework for stating claims, defences and issues in civil litigation.' },
    ],
  },
  {
    title: 'Indian Contract Act, 1872',
    shortTitle: 'Contract Act',
    slug: 'indian-contract-act-1872',
    category: 'Commercial Law',
    jurisdiction: 'India',
    summary: 'Rules for contracts, void agreements, consideration, performance and remedies in commercial matters.',
    sourceUrl: 'https://www.indiacode.nic.in/',
    sourceLabel: 'India Code',
    status: 'REVIEW',
    pdfUrl: 'https://www.indiacode.nic.in/handle/123456789/....pdf',
    pdfExtractedText: 'Formation of contract includes offer, acceptance and consideration. Remedies include damages, specific performance and rescission.',
    subcategories: ['Contractual Rights', 'Remedies'],
    chapters: [
      { title: 'Formation of Contract', content: 'Offer, acceptance, consideration and legal capacity.' },
      { title: 'Discharge', content: 'Modes of discharge of contractual obligations.' },
    ],
  },
  {
    title: 'Negotiable Instruments Act, 1881',
    shortTitle: 'NI Act',
    slug: 'negotiable-instruments-act-1881',
    category: 'Banking Law',
    jurisdiction: 'India',
    summary: 'Legislation governing promissory notes, bills of exchange, cheques and negotiable instruments.',
    sourceUrl: 'https://www.indiacode.nic.in/',
    sourceLabel: 'India Code',
    status: 'PUBLISHED',
    pdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/....pdf',
    pdfExtractedText: 'Promissory notes and bills of exchange must satisfy formal requirements under the legislation. Dishonour of cheques attracts statutory consequences.',
    subcategories: ['Financial Instruments', 'Commercial Banking'],
    chapters: [
      { title: 'Promissory Notes', content: 'Rules relating to promissory notes and their legal enforceability.' },
      { title: 'Cheques', content: 'Presentation, dishonour and notice requirements for cheques.' },
    ],
  },
  {
    title: 'Prevention of Corruption Act, 1988',
    shortTitle: 'PCA',
    slug: 'prevention-of-corruption-act-1988',
    category: 'Criminal Law',
    jurisdiction: 'India',
    summary: 'Framework for investigation and prosecution of offences relating to bribery and corruption.',
    sourceUrl: 'https://www.indiacode.nic.in/',
    sourceLabel: 'India Code',
    status: 'DRAFT',
    pdfUrl: 'https://www.indiacode.nic.in/handle/123456789/....pdf',
    pdfExtractedText: 'The act defines offences and the statutory procedures for investigation and prosecution of corruption matters.',
    subcategories: ['Anti-Corruption', 'Investigative Powers'],
    chapters: [
      { title: 'Offences', content: 'Offences related to bribery, undue influence and abuse of office.' },
      { title: 'Prosecution', content: 'Procedure for investigating and prosecuting corruption offences.' },
    ],
  },
]

const main = async () => {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
  }

  for (const course of courses) {
    await prisma.course.upsert({
      where: {
        id: (await prisma.course.findFirst({ where: { title: course.title } }))?.id ?? -1,
      },
      update: course,
      create: course,
    })
  }

  for (const law of laws) {
    const category = await prisma.category.findUnique({ where: { slug: law.category.toLowerCase().replace(/\s+/g, '-') } })

    if (!category) {
      continue
    }

    const createdLaw = await prisma.law.upsert({
      where: { slug: law.slug },
      update: {
        title: law.title,
        shortTitle: law.shortTitle,
        categoryId: category.id,
        summary: law.summary,
        jurisdiction: law.jurisdiction,
        sourceUrl: law.sourceUrl,
        sourceLabel: law.sourceLabel,
        status: law.status,
        pdfUrl: law.pdfUrl,
        pdfExtractedText: law.pdfExtractedText,
      },
      create: {
        title: law.title,
        shortTitle: law.shortTitle,
        slug: law.slug,
        categoryId: category.id,
        summary: law.summary,
        jurisdiction: law.jurisdiction,
        sourceUrl: law.sourceUrl,
        sourceLabel: law.sourceLabel,
        status: law.status,
        pdfUrl: law.pdfUrl,
        pdfExtractedText: law.pdfExtractedText,
      },
    })

    await prisma.subcategory.deleteMany({ where: { lawId: createdLaw.id } })
    await prisma.chapter.deleteMany({ where: { lawId: createdLaw.id } })

    if (law.subcategories?.length) {
      await prisma.subcategory.createMany({
        data: law.subcategories.map((name) => ({
          lawId: createdLaw.id,
          name,
        })),
      })
    }

    if (law.chapters?.length) {
      await prisma.chapter.createMany({
        data: law.chapters.map((chapter) => ({
          lawId: createdLaw.id,
          title: chapter.title,
          content: chapter.content,
        })),
      })
    }
  }

  console.log('Seed completed successfully.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
