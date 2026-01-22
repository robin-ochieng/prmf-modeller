'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CalculateSuccessResponse } from '@/types'
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Info, 
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

interface PremiumResultProps {
  result: CalculateSuccessResponse['data'] | null
  isVisible: boolean
}

export function PremiumResult({ result, isVisible }: PremiumResultProps) {
  if (!result) return null

  const isLumpsum = result.payment_type === 'LUMPSUM'

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: 50 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: 50 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="mt-8 relative group">
            {/* Decorative elements - animate on hover only */}
            <motion.div
              className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-primary-400/20 to-blue-400/20 rounded-full blur-2xl"
              initial={{ scale: 1, opacity: 0.5 }}
              whileHover={{ scale: 1.2, opacity: 0.8 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-2xl"
              initial={{ scale: 1, opacity: 0.5 }}
              whileHover={{ scale: 1.2, opacity: 0.8 }}
              transition={{ duration: 0.3 }}
            />

            {/* Result Card */}
            <motion.div
              className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-2xl overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {/* Header with payment type badge */}
              <div className="relative px-6 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white overflow-hidden">
                {/* Animated background pattern */}
                <motion.div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                  animate={{ x: [0, 60], y: [0, 60] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      <Sparkles className="w-6 h-6" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold">Your Premium</h3>
                      <p className="text-primary-100 text-sm">Calculated result</p>
                    </div>
                  </div>

                  {/* Payment type badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className={cn(
                      'px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2',
                      isLumpsum
                        ? 'bg-amber-400 text-amber-900'
                        : 'bg-white/20 text-white backdrop-blur-sm'
                    )}
                  >
                    {isLumpsum ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <Calendar className="w-4 h-4" />
                    )}
                    {result.payment_type}
                  </motion.div>
                </div>
              </div>

              {/* Premium Amount */}
              <div className="px-6 py-8 text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="mb-4"
                >
                  <span className="text-gray-500 text-lg">{result.currency}</span>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    <CountUpAnimation value={result.premium_amount} />
                  </div>
                </motion.div>

                {/* Summary chips */}
                <motion.div
                  className="flex flex-wrap justify-center gap-2 mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <SummaryChip 
                    icon={<Calendar className="w-3.5 h-3.5" />}
                    label={`Age ${result.age}`}
                  />
                  <SummaryChip 
                    icon={<TrendingUp className="w-3.5 h-3.5" />}
                    label={result.benefit_option}
                  />
                  <SummaryChip 
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    label={result.family_size === 'M' ? 'Principal Only' : 'Principal + Spouse'}
                  />
                </motion.div>
              </div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={cn(
                  'mx-6 mb-6 p-4 rounded-xl flex gap-3',
                  isLumpsum
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-primary-50 border border-primary-200'
                )}
              >
                <Info className={cn(
                  'w-5 h-5 flex-shrink-0 mt-0.5',
                  isLumpsum ? 'text-amber-600' : 'text-primary-600'
                )} />
                <div>
                  <p className={cn(
                    'font-medium text-sm',
                    isLumpsum ? 'text-amber-800' : 'text-primary-800'
                  )}>
                    {isLumpsum ? 'One-Time Payment' : 'Annual Payment'}
                  </p>
                  <p className={cn(
                    'text-sm mt-1',
                    isLumpsum ? 'text-amber-700' : 'text-primary-700'
                  )}>
                    {result.disclaimer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Count up animation component
function CountUpAnimation({ value }: { value: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value}
    >
      {new Intl.NumberFormat('en-KE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)}
    </motion.span>
  )
}

// Summary chip component
function SummaryChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
      {icon}
      {label}
    </span>
  )
}
