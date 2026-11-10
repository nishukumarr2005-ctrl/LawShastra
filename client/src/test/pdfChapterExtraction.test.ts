import { describe, expect, it } from 'vitest'
import { extractPdfChapters } from '../features/admin/pages/AdminDashboardPage'

describe('extractPdfChapters', () => {
  it('splits a statute PDF into numbered chapter sections', () => {
    const sample = `
      THE CODE OF CIVIL PROCEDURE, 1908
      CHAPTER I PRELIMINARY
      Definitions and jurisdiction of civil courts.
      The provisions in this chapter apply to all civil proceedings.
      CHAPTER II OF SUITS
      Institution of suits and cause of action.
      Courts shall decide suits in accordance with the law.
      CHAPTER III PLEADINGS
      Parties and pleadings must be complete and verified.
    `

    const chapters = extractPdfChapters(sample)

    expect(chapters).toHaveLength(3)
    expect(chapters[0].title).toMatch(/CHAPTER I/i)
    expect(chapters[1].title).toMatch(/CHAPTER II/i)
    expect(chapters[2].title).toMatch(/CHAPTER III/i)
    expect(chapters[0].content).toContain('Definitions and jurisdiction')
  })
})
