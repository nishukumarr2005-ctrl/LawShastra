import React from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 pointer-events-none text-[#77747F]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white border border-[#EFEBE1] text-[#25232B] placeholder:text-[#A19DA8] rounded-2xl py-3 text-sm font-medium transition-all duration-150',
              'focus:outline-none focus:border-[#FF8A45] focus:ring-3 focus:ring-[#FF8A45]/15',
              leftIcon ? 'pl-11' : 'pl-4',
              rightIcon ? 'pr-11' : 'pr-4',
              error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-200',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 flex items-center text-[#77747F]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-500 font-medium pl-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
