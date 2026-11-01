import { Link } from 'react-router-dom'
import {
  Code,
  Palette,
  BarChart3,
  Terminal,
  Cpu,
  TrendingUp,
  Megaphone,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import type { Category } from '@/types'
import { cn } from '@/utils/cn'

export interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Map icon strings to Lucide components
  const iconMap: Record<string, React.ElementType> = {
    Code,
    Palette,
    BarChart3,
    Terminal,
    Cpu,
    TrendingUp,
    Megaphone,
    Sparkles,
  }

  const IconComponent = iconMap[category.iconName] || Sparkles

  const accentStyles = {
    yellow: {
      card: 'hover:border-[#FFD84D] hover:bg-[#FFFDF5]',
      iconWrap: 'bg-[#FFF9E5] text-[#9A7300] border-[#FFE885]',
      countBadge: 'bg-[#FFF9E5] text-[#9A7300]',
    },
    orange: {
      card: 'hover:border-[#FF8A45] hover:bg-[#FFF9F5]',
      iconWrap: 'bg-[#FFF3EB] text-[#C25413] border-[#FFD0B3]',
      countBadge: 'bg-[#FFF3EB] text-[#C25413]',
    },
    purple: {
      card: 'hover:border-[#7952D9] hover:bg-[#FAF8FE]',
      iconWrap: 'bg-[#F3EEFC] text-[#5B32BF] border-[#DDD0F7]',
      countBadge: 'bg-[#F3EEFC] text-[#5B32BF]',
    },
    slate: {
      card: 'hover:border-[#D5D0C5] hover:bg-[#F9F7F1]',
      iconWrap: 'bg-[#F4F1EA] text-[#47444F] border-[#E5E0D3]',
      countBadge: 'bg-[#F4F1EA] text-[#47444F]',
    },
  }

  const currentAccent = accentStyles[category.accentColor] || accentStyles.yellow

  return (
    <Link
      to={`/courses?category=${category.slug}`}
      className={cn(
        'group bg-white border border-[#EFEBE1] rounded-3xl p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between h-full',
        currentAccent.card
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-5">
          <div
            className={cn(
              'w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-105 duration-200',
              currentAccent.iconWrap
            )}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <span
            className={cn(
              'text-xs font-bold px-2.5 py-1 rounded-full',
              currentAccent.countBadge
            )}
          >
            {category.coursesCount} courses
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[#25232B] group-hover:text-[#25232B] mb-2 leading-snug">
          {category.name}
        </h3>

        <p className="text-xs sm:text-sm text-[#77747F] leading-relaxed line-clamp-2">
          {category.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-[#F5F2EA] flex items-center text-xs font-bold text-[#25232B] group-hover:text-[#FF8A45] transition-colors">
        <span>Explore Collection</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
