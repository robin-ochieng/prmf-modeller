'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Calendar, Minus, Plus, Info } from 'lucide-react'

interface AgeSliderProps {
  value: number
  onChange: (value: number) => void
  error?: string
}

export function AgeSlider({ value, onChange, error }: AgeSliderProps) {
  const [isHovered, setIsHovered] = useState(false)
  const minAge = 18
  const maxAge = 90
  const percentage = ((value - minAge) / (maxAge - minAge)) * 100

  const handleIncrement = () => {
    if (value < maxAge) onChange(value + 1)
  }

  const handleDecrement = () => {
    if (value > minAge) onChange(value - 1)
  }

  const getAgeCategory = (age: number) => {
    if (age >= 61) return { label: 'Retiree', color: 'text-amber-600', bg: 'bg-amber-50' }
    return { label: 'Active Member', color: 'text-primary-600', bg: 'bg-primary-50' }
  }

  const category = getAgeCategory(value)

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
              Enter your current age (18-90 years)
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Age
        </label>
        <motion.span
          key={category.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'text-xs font-semibold px-3 py-1 rounded-full',
            category.bg,
            category.color
          )}
        >
          {category.label}
        </motion.span>
      </div>

      {/* Age Display with Controls */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          type="button"
          onClick={handleDecrement}
          disabled={value <= minAge}
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            'bg-gray-100 hover:bg-gray-200 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Minus className="w-5 h-5 text-gray-600" />
        </motion.button>

        <motion.div
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            {value}
          </div>
          <div className="text-center text-sm text-gray-500 mt-1">years old</div>
        </motion.div>

        <motion.button
          type="button"
          onClick={handleIncrement}
          disabled={value >= maxAge}
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            'bg-gray-100 hover:bg-gray-200 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      {/* Slider */}
      <div className="relative pt-2 pb-4">
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          {/* Progress fill */}
          <motion.div
            className="absolute h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
          {/* Lumpsum zone indicator */}
          <div
            className="absolute h-full bg-amber-200/50 right-0"
            style={{ width: `${((90 - 61) / (90 - 18)) * 100}%` }}
          />
        </div>

        {/* Custom slider input */}
        <input
          type="range"
          min={minAge}
          max={maxAge}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={cn(
            'absolute inset-0 w-full h-3 opacity-0 cursor-pointer',
            'mt-2'
          )}
        />

        {/* Thumb indicator */}
        <motion.div
          className="absolute top-1/2 w-6 h-6 -mt-1 bg-white border-4 border-primary-500 rounded-full shadow-lg cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${percentage}% - 12px)` }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />

        {/* Labels */}
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <span>{minAge}</span>
          <span className="text-amber-600 font-medium">61 (Retiree)</span>
          <span>{maxAge}</span>
        </div>
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
