import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CourseCard } from '@/features/courses/components/CourseCard'
import { courses } from '@/data/courses'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export function FeaturedCourses() {
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'web' | 'design' | 'ai'>('all')

  const tabs = [
    { id: 'all', label: 'All Curated Courses' },
    { id: 'trending', label: 'Trending & Popular' },
    { id: 'web', label: 'Web Development' },
    { id: 'design', label: 'UI/UX & Design' },
    { id: 'ai', label: 'AI & Data Science' },
  ]

  // Filter courses based on active tab
  const filteredCourses = courses.filter((course) => {
    if (activeTab === 'all') return true
    if (activeTab === 'trending') return course.popular || course.featured
    if (activeTab === 'web') return course.categorySlug === 'web-development'
    if (activeTab === 'design') return course.categorySlug === 'ui-ux-design' || course.categorySlug === 'graphic-design'
    if (activeTab === 'ai') return course.categorySlug === 'artificial-intelligence' || course.categorySlug === 'data-science'
    return true
  }).slice(0, 6) // display top 6 in curated home grid

  return (
    <section className="py-16 lg:py-24 border-b border-[#EFEBE1] bg-[#FFFDF8]">
      <Container>
        <SectionHeading
          eyebrow="Curated Collections"
          eyebrowColor="orange"
          title="Explore Top Rated Courses & Curated Learning Paths"
          highlightWord="Courses"
          description="Hand-picked curriculums taught by industry veterans. Learn through real code repositories, interactive Figma boards, and direct mentorship."
          action={
            <Link to="/courses">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Browse All 1,200+ Courses
              </Button>
            </Link>
          }
        />

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer',
                activeTab === tab.id
                  ? 'bg-[#25232B] text-white shadow-xs'
                  : 'bg-white text-[#5C5963] border border-[#EFEBE1] hover:border-[#D5D0C5] hover:text-[#25232B]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Bottom Banner linking to full catalog */}
        <div className="bg-[#FFF9E5] border border-[#FFE885] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#9A7300] border border-[#FFE885] flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-extrabold text-[#25232B]">
                Looking for a custom learning path or team training?
              </h4>
              <p className="text-xs sm:text-sm text-[#77747F]">
                Access personalized skill roadmaps, team dashboards, and private mentoring sessions.
              </p>
            </div>
          </div>
          <Link to="/courses" className="shrink-0 w-full sm:w-auto">
            <Button variant="dark" size="md" className="w-full sm:w-auto">
              Explore All Paths
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}
