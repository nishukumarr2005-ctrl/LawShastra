import { Code2, GitPullRequest, Award, Users, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function WhyChooseUs() {
  const pillars = [
    {
      icon: Code2,
      accent: 'yellow',
      title: 'Production-Grade Capstones',
      description:
        'Build real GitHub repositories and design systems. No toy hello-world apps. Every lesson culminates in a portfolio piece you can ship to production.',
      highlight: 'Real codebases & deployments',
    },
    {
      icon: GitPullRequest,
      accent: 'orange',
      title: '1-on-1 Code & Design Reviews',
      description:
        'Submit your pull requests and Figma boards for line-by-line feedback from staff engineers and design directors who know what industry bars demand.',
      highlight: 'Actionable mentorship',
    },
    {
      icon: Award,
      accent: 'purple',
      title: 'Recognized Career Credentials',
      description:
        'Earn cryptographically verifiable course completion credentials. Highlight your achievements directly on LinkedIn, resume, and portfolio.',
      highlight: 'Verified digital certificates',
    },
    {
      icon: Users,
      accent: 'slate',
      title: 'Lifetime Global Community',
      description:
        'Join an active peer network of over 120,000 developers and creators. Participate in weekly office hours, hackathons, and job referral channels.',
      highlight: 'Alumni career network',
    },
  ]

  const accentStyles = {
    yellow: {
      card: 'hover:border-[#FFD84D]',
      iconWrap: 'bg-[#FFF9E5] text-[#9A7300] border-[#FFE885]',
      badge: 'bg-[#FFF9E5] text-[#9A7300]',
    },
    orange: {
      card: 'hover:border-[#FF8A45]',
      iconWrap: 'bg-[#FFF3EB] text-[#C25413] border-[#FFD0B3]',
      badge: 'bg-[#FFF3EB] text-[#C25413]',
    },
    purple: {
      card: 'hover:border-[#7952D9]',
      iconWrap: 'bg-[#F3EEFC] text-[#5B32BF] border-[#DDD0F7]',
      badge: 'bg-[#F3EEFC] text-[#5B32BF]',
    },
    slate: {
      card: 'hover:border-[#D5D0C5]',
      iconWrap: 'bg-[#F4F1EA] text-[#47444F] border-[#E5E0D3]',
      badge: 'bg-[#F4F1EA] text-[#47444F]',
    },
  }

  return (
    <section id="why-us" className="py-16 lg:py-24 border-b border-[#EFEBE1] bg-white">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="The EduSphere Standard"
          eyebrowColor="purple"
          title="Designed for Deep Understanding, Not Just Video Watching"
          highlightWord="Understanding"
          description="Traditional online tutorials leave you stranded when real engineering bugs arise. Our methodology bridges theory into deep muscle memory through rigorous deliberate practice."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((pillar) => {
            const currentAccent = accentStyles[pillar.accent as keyof typeof accentStyles]
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className={`bg-[#FFFDF8] border border-[#EFEBE1] rounded-3xl p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between ${currentAccent.card}`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${currentAccent.iconWrap}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span
                    className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-3 ${currentAccent.badge}`}
                  >
                    {pillar.highlight}
                  </span>

                  <h3 className="text-lg font-bold text-[#25232B] mb-2 leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#77747F] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F5F2EA] flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Standard</span>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
