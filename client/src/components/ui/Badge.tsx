import React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'yellow' | 'orange' | 'purple' | 'slate' | 'emerald' | 'outline'
  size?: 'sm' | 'md'
}

export function Badge({
  className,
  variant = 'yellow',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full tracking-wide transition-colors'

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
  }

  const variantStyles = {
    yellow: 'bg-[#FFF9E5] text-[#9A7300] border border-[#FFE885]',
    orange: 'bg-[#FFF3EB] text-[#C25413] border border-[#FFD0B3]',
    purple: 'bg-[#F3EEFC] text-[#5B32BF] border border-[#DDD0F7]',
    slate: 'bg-[#F4F1EA] text-[#47444F] border border-[#E5E0D3]',
    emerald: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
    outline: 'bg-transparent text-[#77747F] border border-[#EFEBE1]',
  }

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}
