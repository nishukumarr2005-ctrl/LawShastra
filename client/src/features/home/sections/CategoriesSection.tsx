import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CategoryCard } from '@/features/categories/components/CategoryCard'
import { categories } from '@/data/categories'
import { Button } from '@/components/ui/Button'

export function CategoriesSection() {
  // Display top 8 categories
  const featuredCategories = categories.slice(0, 8)

  return (
    <section className="py-16 lg:py-24 border-b border-[#EFEBE1] bg-[#FFFDF8]">
      <Container>
        <SectionHeading
          eyebrow="Explore Disciplines"
          eyebrowColor="yellow"
          title="Browse Most Popular Educational Disciplines"
          highlightWord="Educational"
          description="Structured paths tailored for every level. Dive into specialized curricula, complete guided capstones, and master the tools used by industry pioneers."
          action={
            <Link to="/categories">
              <Button
                variant="secondary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View All Categories
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  )
}
