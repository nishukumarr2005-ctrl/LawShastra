import { HeroSection } from '../sections/HeroSection'
import { CategoriesSection } from '../sections/CategoriesSection'
import { FeaturedCourses } from '../sections/FeaturedCourses'
import { WhyChooseUs } from '../sections/WhyChooseUs'
import { InstructorsSection } from '../sections/InstructorsSection'
import { TestimonialsSection } from '../sections/TestimonialsSection'
import { CTASection } from '../sections/CTASection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedCourses />
      <WhyChooseUs />
      <InstructorsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
