import { instructors } from '@/data/instructors'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Star, BookOpen, Users } from 'lucide-react'

export function InstructorsSection() {
  return (
    <section id="instructors" className="py-16 lg:py-24 border-b border-[#EFEBE1] bg-[#FFFDF8]">
      <Container>
        <SectionHeading
          eyebrow="World-Class Educators"
          eyebrowColor="yellow"
          title="Learn Directly from Engineers & Designers Who Build What You Use"
          highlightWord="Engineers"
          description="Our instructors are actively leading engineering squads, building open-source tooling, and directing design teams at high-impact technology organizations."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {instructors.map((inst) => (
            <div
              key={inst.id}
              className="bg-white border border-[#EFEBE1] hover:border-[#D5D0C5] rounded-3xl p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Avatar with Badge */}
                <div className="relative mb-5 inline-block">
                  <img
                    src={inst.avatar}
                    alt={inst.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#EFEBE1]"
                  />
                  {inst.badge && (
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg bg-[#FFD84D] text-[#25232B] text-[10px] font-extrabold uppercase tracking-wider border border-[#F5CC38] shadow-2xs">
                      {inst.badge}
                    </span>
                  )}
                </div>

                {/* Name & Role */}
                <h3 className="text-lg font-bold text-[#25232B] mb-0.5">
                  {inst.name}
                </h3>
                <p className="text-xs font-bold text-[#FF8A45] mb-1">
                  {inst.role}
                </p>
                <p className="text-xs font-medium text-[#77747F] mb-4">
                  {inst.company}
                </p>

                {/* Bio */}
                <p className="text-xs text-[#5C5963] leading-relaxed line-clamp-3 mb-6">
                  {inst.bio}
                </p>
              </div>

              {/* Stats Footer */}
              <div className="pt-4 border-t border-[#F5F2EA] flex items-center justify-between text-xs text-[#77747F]">
                <div className="flex items-center gap-1 font-bold text-[#25232B]">
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span>{inst.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#A19DA8]" />
                  <span>{inst.studentsCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#A19DA8]" />
                  <span>{inst.coursesCount} courses</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
