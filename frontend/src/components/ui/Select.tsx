'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm',
              'text-gray-900 appearance-none cursor-pointer',
              'transition-all duration-300',
              'focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10',
              'hover:border-gray-300',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
              className
            )}
            {...props}
          >
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 flex items-center gap-1"
          >
            <span>⚠</span> {error}
          </motion.p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }
