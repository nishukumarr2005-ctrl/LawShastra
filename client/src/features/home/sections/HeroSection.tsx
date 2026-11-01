import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Sparkles,
  Search,
  Star,
  Users,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/courses?query=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/courses')
    }
  }

  const quickPills = [
    { label: 'React 19', query: 'React' },
    { label: 'UI/UX Masterclass', query: 'UI/UX' },
    { label: 'Python & Data', query: 'Python' },
    { label: 'AI & Deep Learning', query: 'AI' },
  ]

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-[#EFEBE1]">
      {/* Subtle warm ambient backdrop circles */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#FFF9E5]/60 rounded-full blur-3xl -z-10 pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Search, Quick Tags, Metrics */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9E5] border border-[#FFE885] text-[#9A7300] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#FF8A45]" />
              <span>Modern Practical Online Education</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#25232B] tracking-tight leading-[1.12] mb-6">
              Learn skills that{' '}
              <span className="relative inline-block">
                <span className="relative z-10">matter.</span>
                <span className="absolute bottom-2 left-0 w-full h-3.5 bg-[#FFD84D] -rotate-1 rounded-sm -z-0" />
              </span>{' '}
              Build the future you desire.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#5C5963] leading-relaxed max-w-xl mb-8">
              Explore 1,200+ project-driven courses crafted by senior engineers and designers from Stripe, Linear, and AWS. Real code, real portfolios, zero filler.
            </p>

            {/* Integrated Hero Search Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-xl bg-white border border-[#EFEBE1] hover:border-[#D5D0C5] p-2 rounded-2xl sm:rounded-3xl shadow-sm transition-all flex flex-col sm:flex-row items-center gap-2 mb-4"
            >
              <div className="relative flex-1 w-full flex items-center pl-3">
                <Search className="w-5 h-5 text-[#A19DA8] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What skill do you want to master today? (e.g. React, UX...)"
                  className="w-full py-2.5 px-3 text-sm text-[#25232B] placeholder:text-[#A19DA8] font-medium bg-transparent focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full sm:w-auto shrink-0"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Find Courses
              </Button>
            </form>

            {/* Quick Search Tag Pills */}
            <div className="flex items-center gap-2 flex-wrap mb-10 text-xs">
              <span className="text-[#77747F] font-semibold">Popular Searches:</span>
              {quickPills.map((pill) => (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() =>
                    navigate(`/courses?query=${encodeURIComponent(pill.query)}`)
                  }
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#EFEBE1] text-[#25232B] hover:border-[#FF8A45] hover:text-[#FF8A45] transition-colors font-medium shadow-2xs"
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Proof Points & Social Proof */}
            <div className="pt-6 border-t border-[#EFEBE1] w-full flex items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                    alt="Student"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                    alt="Student"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                    alt="Student"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-xs font-bold text-[#25232B]">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span>4.9 / 5.0</span>
                  </div>
                  <span className="text-[11px] text-[#77747F]">from 45k+ reviews</span>
                </div>
              </div>

              <div className="h-8 w-px bg-[#EFEBE1]" />

              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-[#25232B]">120,000+</span>
                <span className="text-[11px] text-[#77747F]">Graduated Students</span>
              </div>

              <div className="hidden sm:block h-8 w-px bg-[#EFEBE1]" />

              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-extrabold text-[#25232B]">98.4%</span>
                <span className="text-[11px] text-[#77747F]">Career Satisfaction</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Visual Composition (Ronas IT Style) */}
          <div className="lg:col-span-5 relative">
            {/* Main Visual Feature Card */}
            <div className="relative bg-white border border-[#EFEBE1] rounded-3xl p-4 sm:p-5 shadow-lg">
              {/* Card Banner Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#F4F1EA] mb-4">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                  alt="Students collaborating"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="px-2 py-0.5 rounded-lg bg-[#FF8A45] text-[11px] font-bold uppercase tracking-wider">
                    Interactive Workshop
                  </span>
                  <p className="text-xs font-bold mt-1">Live Mentorship Every Thursday</p>
                </div>
              </div>

              {/* Course Spotlight Details inside Hero Card */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-[11px] font-bold text-[#FF8A45] uppercase tracking-wider">
                    Featured Curriculum
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-[#25232B] line-clamp-1">
                    Full-Stack Next.js & React 19 Mastery
                  </h4>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#9A7300] bg-[#FFF9E5] px-2 py-1 rounded-xl border border-[#FFE885]">
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span>4.9</span>
                </div>
              </div>

              {/* Mini curriculum list */}
              <div className="space-y-1.5 text-xs text-[#5C5963] mb-4 bg-[#FFFDF8] border border-[#F0ECE1] rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Server Components Deep Dive
                  </span>
                  <span className="text-[11px] text-[#A19DA8]">45 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> TanStack Query Architecture
                  </span>
                  <span className="text-[11px] text-[#A19DA8]">60 min</span>
                </div>
              </div>

              <Link to="/courses/complete-react-development">
                <Button variant="dark" size="sm" className="w-full">
                  Explore Course Syllabus
                </Button>
              </Link>
            </div>

            {/* Floating Floating Accent Badge 1: Top Right */}
            <div className="absolute -top-6 -right-4 sm:-right-6 bg-white border border-[#EFEBE1] rounded-2xl p-3 shadow-md hidden sm:flex items-center gap-3 animate-bounce-subtle">
              <div className="w-10 h-10 rounded-xl bg-[#FFF3EB] text-[#FF8A45] border border-[#FFD0B3] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-xs font-extrabold text-[#25232B]">Verified Credential</span>
                <span className="text-[10px] text-[#77747F]">Accredited Certificate</span>
              </div>
            </div>

            {/* Floating Accent Badge 2: Bottom Left */}
            <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white border border-[#EFEBE1] rounded-2xl p-3 shadow-md hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEFC] text-[#7952D9] border border-[#DDD0F7] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-xs font-extrabold text-[#25232B]">Active Community</span>
                <span className="text-[10px] text-[#77747F]">2,400+ Online Right Now</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
