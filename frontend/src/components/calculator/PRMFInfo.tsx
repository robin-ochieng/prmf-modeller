'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, ChevronDown, ChevronUp } from 'lucide-react'

export function PRMFInfo() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mt-4 max-w-xl mx-auto">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors py-2 group"
      >
        <Info className="w-4 h-4" />
        <span className="font-medium">What is PRMF?</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 transition-transform" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-4 bg-primary-50/50 rounded-xl border border-primary-100 text-sm text-gray-700 leading-relaxed">
              <strong className="text-primary-700">PRMF (Post-Retirement Medical Fund)</strong> is a fund arrangement 
              designed to help members meet medical costs after retirement by providing medical benefits.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
