import { testimonials } from '@/data/testimonials'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Star, Quote } from 'lucide-react'

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 border-b border-[#EFEBE1] bg-white">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Student Transformations"
          eyebrowColor="orange"
          title="From Beginners to Staff Engineers & Product Leads"
          highlightWord="Transformations"
          description="Read how our students pivoted careers, earned promotions, and shipped production applications after completing EduSphere curricula."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-[#FFFDF8] border border-[#EFEBE1] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#D5D0C5] transition-all"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#E5E0D3]" />
                </div>

                {/* Content */}
                <p className="text-sm sm:text-base text-[#25232B] font-medium leading-relaxed mb-6 italic">
                  "{test.content}"
                </p>
              </div>

              {/* Student info & Course tag */}
              <div className="pt-4 border-t border-[#F5F2EA]">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#EFEBE1]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#25232B]">{test.name}</h4>
                    <p className="text-xs text-[#77747F]">
                      {test.role} at <span className="font-semibold text-[#25232B]">{test.company}</span>
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-[#FF8A45] bg-[#FFF3EB] px-2.5 py-1 rounded-lg border border-[#FFD0B3] line-clamp-1 inline-block">
                  Completed: {test.courseTaken}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
