import { Link } from 'react-router-dom'
import { Star, Clock, BookOpen } from 'lucide-react'

import type { Course } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

export interface CourseCardProps {
  course: Course
  layout?: 'grid' | 'list'
}

export function CourseCard({ course, layout = 'grid' }: CourseCardProps) {
  const isList = layout === 'list'

  const badgeVariantMap: Record<string, 'yellow' | 'orange' | 'purple' | 'emerald'> = {
    Bestseller: 'yellow',
    Trending: 'orange',
    'Top Rated': 'purple',
    New: 'emerald',
  }

  return (
    <article
      className={cn(
        'group bg-white rounded-3xl border border-[#EFEBE1] hover:border-[#DED8CB] transition-all duration-200 hover:shadow-md flex overflow-hidden',
        isList ? 'flex-col sm:flex-row' : 'flex-col'
      )}
    >
      {/* Thumbnail Container */}
      <Link
        to={`/courses/${course.slug}`}
        className={cn(
          'relative overflow-hidden bg-[#F4F1EA] block shrink-0',
          isList ? 'w-full sm:w-72 aspect-video sm:aspect-auto' : 'w-full aspect-[16/10]'
        )}
      >
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Category Pill Over Image */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-xs text-[#25232B] text-xs font-bold shadow-2xs">
            {course.category}
          </span>
          {course.badge && (
            <Badge variant={badgeVariantMap[course.badge] || 'yellow'} size="sm">
              {course.badge}
            </Badge>
          )}
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
        <div>
          {/* Metadata row: Rating & Students */}
          <div className="flex items-center justify-between text-xs text-[#77747F] mb-2.5">
            <div className="flex items-center gap-1.5 font-bold text-[#25232B]">
              <div className="flex items-center gap-1 text-[#D97706] bg-[#FFF9E5] px-2 py-0.5 rounded-lg border border-[#FFE885]">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                <span>{course.rating.toFixed(1)}</span>
              </div>
              <span className="text-[#77747F] font-normal">
                ({course.reviewsCount.toLocaleString()})
              </span>
            </div>

            <span className="font-medium text-[#77747F]">
              {course.totalStudents.toLocaleString()} students
            </span>
          </div>

          {/* Course Title */}
          <h3 className="text-base sm:text-lg font-bold text-[#25232B] group-hover:text-[#FF8A45] transition-colors leading-snug line-clamp-2 mb-2">
            <Link to={`/courses/${course.slug}`}>{course.title}</Link>
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#77747F] line-clamp-2 mb-4 leading-relaxed">
            {course.description}
          </p>

          {/* Instructor Meta */}
          <div className="flex items-center gap-2.5 mb-4 pt-3 border-t border-[#F5F2EA]">
            <img
              src={course.instructorAvatar}
              alt={course.instructor}
              className="w-7 h-7 rounded-full object-cover border border-[#EFEBE1]"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#25232B] line-clamp-1">
                {course.instructor}
              </span>
              <span className="text-[11px] text-[#77747F] line-clamp-1">
                {course.instructorRole}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Row: Duration, Level & Price */}
        <div className="pt-3 border-t border-[#F5F2EA] flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#77747F] font-medium">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#A19DA8]" />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#A19DA8]" />
              {course.lessonsCount} lessons
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            {course.originalPrice && (
              <span className="text-xs text-[#A19DA8] line-through">
                ${course.originalPrice}
              </span>
            )}
            <span className="text-lg font-extrabold text-[#25232B]">
              ${course.price}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
