import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Star,
  Clock,
  BookOpen,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  Award,
  Users,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CourseCard } from '../components/CourseCard'
import { courses } from '@/data/courses'


export function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({ 0: true })
  const [enrolled, setEnrolled] = useState(false)

  // Find course by slug or id
  const course = courses.find((c) => c.slug === courseId || c.id === courseId)

  if (!course) {
    return (
      <div className="py-20 text-center bg-[#FFFDF8] min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#25232B] mb-2">Course Not Found</h2>
        <p className="text-sm text-[#77747F] mb-6">
          The course you are looking for does not exist or may have been relocated.
        </p>
        <Link to="/courses">
          <Button variant="primary" size="md">
            Return to Courses
          </Button>
        </Link>
      </div>
    )
  }

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Related courses in same category
  const relatedCourses = courses
    .filter((c) => c.categorySlug === course.categorySlug && c.id !== course.id)
    .slice(0, 3)

  return (
    <div className="bg-[#FFFDF8] pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-[#EFEBE1] py-4">
        <Container>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#77747F] hover:text-[#25232B] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-[#77747F]">
              <Link to="/courses" className="hover:text-[#25232B]">
                Courses
              </Link>
              <span>/</span>
              <span className="text-[#25232B] font-bold line-clamp-1 max-w-[200px] sm:max-w-xs">
                {course.title}
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* Hero Section */}
      <div className="bg-[#FFFDF8] border-b border-[#EFEBE1] py-10 lg:py-14">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Header info */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <Badge variant="purple" size="md">
                  {course.category}
                </Badge>
                {course.badge && (
                  <Badge variant="yellow" size="md">
                    {course.badge}
                  </Badge>
                )}
                <span className="text-xs font-semibold text-[#77747F]">
                  Level: <strong className="text-[#25232B]">{course.level}</strong>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#25232B] tracking-tight leading-tight mb-4">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-[#5C5963] leading-relaxed mb-6">
                {course.longDescription || course.description}
              </p>

              {/* Course Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-[#5C5963] pt-4 border-t border-[#EFEBE1]">
                <div className="flex items-center gap-1.5 font-bold text-[#25232B]">
                  <div className="flex items-center gap-1 text-[#D97706] bg-[#FFF9E5] px-2 py-0.5 rounded-lg border border-[#FFE885]">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span>{course.rating.toFixed(1)}</span>
                  </div>
                  <span>({course.reviewsCount.toLocaleString()} ratings)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#A19DA8]" />
                  <span>{course.totalStudents.toLocaleString()} enrolled</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#A19DA8]" />
                  <span>{course.duration}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#A19DA8]" />
                  <span>{course.lessonsCount} lessons</span>
                </div>
              </div>
            </div>

            {/* Right Sticky Checkout Box (Desktop) */}
            <div className="lg:col-span-4 bg-white border border-[#EFEBE1] rounded-3xl p-6 shadow-md sticky top-24">
              <div className="aspect-video rounded-2xl overflow-hidden bg-[#F4F1EA] mb-6 relative group">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 text-[#25232B] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-8 h-8 fill-current text-[#FF8A45]" />
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-extrabold text-[#25232B]">
                  ${course.price}
                </span>
                {course.originalPrice && (
                  <span className="text-base text-[#A19DA8] line-through">
                    ${course.originalPrice}
                  </span>
                )}
                {course.originalPrice && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Save {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                  </span>
                )}
              </div>

              {enrolled ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-emerald-900">Successfully Enrolled!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Your access passes have been issued. Check your student portal.
                  </p>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mb-3"
                  onClick={() => setEnrolled(true)}
                >
                  Enroll in Masterclass
                </Button>
              )}

              <p className="text-[11px] text-center text-[#77747F] mb-6">
                30-Day Money-Back Guarantee • Full Lifetime Access
              </p>

              <div className="space-y-3 pt-6 border-t border-[#F5F2EA] text-xs text-[#5C5963]">
                <h4 className="font-bold text-[#25232B]">This course includes:</h4>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF8A45]" />
                  <span>{course.duration} on-demand video</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#FF8A45]" />
                  <span>{course.lessonsCount} interactive coding labs</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#FF8A45]" />
                  <span>Downloadable source code & Figma files</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FF8A45]" />
                  <span>Certificate of Completion</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Body: What You'll Learn & Curriculum Accordion */}
      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            {/* What you'll learn card */}
            {course.learningOutcomes && (
              <div className="bg-white border border-[#EFEBE1] rounded-3xl p-6 sm:p-8 mb-10 shadow-2xs">
                <h3 className="text-xl font-bold text-[#25232B] mb-5">
                  What you'll master in this course
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF8A45] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-[#5C5963] leading-relaxed">
                        {outcome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Syllabus / Curriculum Accordion */}
            <div className="bg-white border border-[#EFEBE1] rounded-3xl p-6 sm:p-8 mb-10 shadow-2xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#25232B]">Course Curriculum</h3>
                  <p className="text-xs text-[#77747F] mt-1">
                    {course.curriculum?.length || 2} modules • {course.lessonsCount} total lessons
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {(course.curriculum || [
                  {
                    title: 'Section 1: Foundations & Architecture Setup',
                    lessons: ['Getting Started & Best Practices', 'Core Mental Models & Flow', 'Guided Project Walkthrough']
                  },
                  {
                    title: 'Section 2: Advanced Real-World Implementation',
                    lessons: ['Optimizing Edge Cases', 'Testing & Verification', 'Shipping to Production']
                  }
                ]).map((sec, idx) => {
                  const isOpen = openSections[idx]
                  return (
                    <div
                      key={idx}
                      className="border border-[#EFEBE1] rounded-2xl overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSection(idx)}
                        className="w-full p-4 bg-[#FFFDF8] hover:bg-[#F8F5EE] flex items-center justify-between text-left font-bold text-sm text-[#25232B]"
                      >
                        <span className="flex items-center gap-2">
                          <PlayCircle className="w-4 h-4 text-[#FF8A45]" />
                          {sec.title}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[#77747F]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#77747F]" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-4 bg-white space-y-2 border-t border-[#EFEBE1]">
                          {sec.lessons.map((lesson, lIdx) => (
                            <div
                              key={lIdx}
                              className="flex items-center justify-between text-xs text-[#5C5963] py-1.5 px-2 hover:bg-[#FFFDF8] rounded-lg"
                            >
                              <span className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-[#A19DA8]" />
                                {lesson}
                              </span>
                              <span className="text-[11px] text-[#A19DA8]">Video</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Meet the Instructor */}
            <div className="bg-white border border-[#EFEBE1] rounded-3xl p-6 sm:p-8 shadow-2xs mb-10">
              <h3 className="text-xl font-bold text-[#25232B] mb-6">Your Instructor</h3>
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#EFEBE1]"
                />
                <div>
                  <h4 className="text-lg font-bold text-[#25232B]">{course.instructor}</h4>
                  <p className="text-xs font-bold text-[#FF8A45] mb-2">{course.instructorRole}</p>
                  <p className="text-xs sm:text-sm text-[#5C5963] leading-relaxed">
                    Senior engineering practitioner with years of industry leadership. Passionate about empowering the next generation of software engineers through production-grade projects and mentorship.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-[#25232B] mb-6">
                  More Courses in {course.category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedCourses.map((rc) => (
                    <CourseCard key={rc.id} course={rc} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

