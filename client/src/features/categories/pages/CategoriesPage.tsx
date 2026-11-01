import { categories } from '@/data/categories'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CategoryCard } from '../components/CategoryCard'

export function CategoriesPage() {
  return (
    <div className="py-12 lg:py-16 bg-[#FFFDF8] min-h-[calc(100vh-80px)]">
      <Container>
        <SectionHeading
          eyebrow="All Disciplines"
          eyebrowColor="yellow"
          title="Explore All Learning Paths by Discipline"
          highlightWord="Disciplines"
          description="Select a domain to view tailored curricula, recommended prerequisites, and capstone certifications."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </div>
  )
}
