import React from 'react'
import { cn } from '@/utils/cn'

export interface SectionHeadingProps {
  eyebrow?: string
  eyebrowColor?: 'yellow' | 'orange' | 'purple'
  title: string
  highlightWord?: string
  description?: string
  align?: 'left' | 'center'
  action?: React.ReactNode
  className?: string
}

export function SectionHeading({
  eyebrow,
  eyebrowColor = 'orange',
  title,
  highlightWord,
  description,
  align = 'left',
  action,
  className,
}: SectionHeadingProps) {
  const isCentered = align === 'center'

  const eyebrowColorStyles = {
    yellow: 'bg-[#FFF9E5] text-[#9A7300] border-[#FFE885]',
    orange: 'bg-[#FFF3EB] text-[#C25413] border-[#FFD0B3]',
    purple: 'bg-[#F3EEFC] text-[#5B32BF] border-[#DDD0F7]',
  }

  // Render title with optional highlighted word
  const renderTitle = () => {
    if (!highlightWord || !title.includes(highlightWord)) {
      return title
    }
    const parts = title.split(highlightWord)
    return (
      <>
        {parts[0]}
        <span className="relative inline-block text-[#25232B]">
          <span className="relative z-10">{highlightWord}</span>
          <span className="absolute bottom-1.5 left-0 w-full h-3 bg-[#FFD84D]/70 -rotate-1 rounded-sm -z-0" />
        </span>
        {parts[1]}
      </>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14',
        isCentered && 'text-center md:flex-col md:items-center',
        className
      )}
    >
      <div className={cn('max-w-2xl', isCentered && 'mx-auto')}>
        {eyebrow && (
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mb-3.5',
              eyebrowColorStyles[eyebrowColor]
            )}
          >
            <span>{eyebrow}</span>
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#25232B] tracking-tight leading-tight">
          {renderTitle()}
        </h2>
        {description && (
          <p className="mt-3 text-sm sm:text-base text-[#77747F] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
