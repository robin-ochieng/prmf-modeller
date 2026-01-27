'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Users, User, Info } from 'lucide-react'
import { FamilySize, FAMILY_SIZE_OPTIONS } from '@/types'

interface FamilySizeToggleProps {
  value: FamilySize | ''
  onChange: (value: FamilySize) => void
  error?: string
}

export function FamilySizeToggle({ value, onChange, error }: FamilySizeToggleProps) {
  const [isHovered, setIsHovered] = useState(false)
  const options: { key: FamilySize; icon: typeof User; description: string }[] = [
    { key: 'M', icon: User, description: 'Coverage for principal member only' },
    { key: 'M+1', icon: Users, description: 'Coverage for principal member and one spouse' },
  ]

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
              Choose who will be covered under this plan
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Family Size
      </label>

      <div className="grid grid-cols-2 gap-4">
        {options.map(({ key, icon: Icon, description }) => {
          const isSelected = value === key

          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={cn(
                'relative p-5 rounded-xl border-2 transition-all duration-300',
                isSelected
                  ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-blue-50 shadow-lg shadow-primary-500/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Static gradient background when selected - no infinite animation */}
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-xl overflow-hidden opacity-100"
                >
                  <div
                    className="absolute -inset-1 bg-gradient-to-r from-primary-400/20 via-blue-400/20 to-primary-400/20"
                  />
                </div>
              )}

              <div className="relative flex flex-col items-center text-center gap-3">
                <div
                  className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300',
                    isSelected
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  )}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <div>
                  <div className={cn(
                    'font-bold text-lg',
                    isSelected ? 'text-primary-700' : 'text-gray-900'
                  )}>
                    {FAMILY_SIZE_OPTIONS[key]}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {description}
                  </p>
                </div>
              </div>
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
