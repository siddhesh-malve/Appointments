import { cn } from '@/lib/utils'
import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
      'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'
