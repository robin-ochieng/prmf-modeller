'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Shield, Check, Info } from 'lucide-react'
import { BenefitOption, BENEFIT_OPTIONS } from '@/types'

interface BenefitSelectorProps {
  value: BenefitOption | ''
  onChange: (value: BenefitOption) => void
  error?: string
}

const benefitDetails: Record<BenefitOption, { description: string; color: string }> = {
  option_1: { description: 'Essential coverage', color: 'from-blue-400 to-blue-500' },
  option_2: { description: 'Standard coverage', color: 'from-teal-400 to-teal-500' },
  option_3: { description: 'Extended coverage', color: 'from-indigo-400 to-indigo-500' },
  option_4: { description: 'Maximum coverage', color: 'from-amber-400 to-amber-500' },
}

export function BenefitSelector({ value, onChange, error }: BenefitSelectorProps) {
  const [isHovered, setIsHovered] = useState(false)
  const options = Object.entries(BENEFIT_OPTIONS) as [BenefitOption, string][]

  return (
    <div 
      className="space-y-4 relative p-4 rounded-xl transition-all duration-300 hover:bg-primary-50/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <Info className="w-3 h-3" />
              Select your preferred coverage level
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Shield className="w-4 h-4" />
        Benefit Option
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {options.map(([optionKey, optionLabel], index) => {
          const isSelected = value === optionKey
          const details = benefitDetails[optionKey]

          return (
            <motion.button
              key={optionKey}
              type="button"
              onClick={() => onChange(optionKey)}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all duration-300 text-left',
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Color bar */}
              <div className={cn(
                'h-1 w-12 rounded-full bg-gradient-to-r mb-3',
                details.color
              )} />

              <div className={cn(
                'font-bold text-lg',
                isSelected ? 'text-primary-700' : 'text-gray-900'
              )}>
                {optionLabel}
              </div>

              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {details.description}
              </p>
            </motion.button>
          )
        })}
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
