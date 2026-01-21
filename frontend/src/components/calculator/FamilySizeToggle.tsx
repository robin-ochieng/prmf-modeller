'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Users, User } from 'lucide-react'
import { FamilySize, FAMILY_SIZE_OPTIONS } from '@/types'

interface FamilySizeToggleProps {
  value: FamilySize | ''
  onChange: (value: FamilySize) => void
  error?: string
}

export function FamilySizeToggle({ value, onChange, error }: FamilySizeToggleProps) {
  const options: { key: FamilySize; icon: typeof User; description: string }[] = [
    { key: 'M', icon: User, description: 'Coverage for principal member only' },
    { key: 'M+1', icon: Users, description: 'Coverage for principal member and spouse' },
  ]

  return (
    <div className="space-y-4">
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
              {/* Animated background */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-primary-400/20 via-blue-400/20 to-primary-400/20"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              )}

              <div className="relative flex flex-col items-center text-center gap-3">
                <motion.div
                  className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center',
                    isSelected
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  )}
                  animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-7 h-7" />
                </motion.div>

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
