'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Clock, TrendingUp, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface QuoteHistoryItem {
  id: string
  age: number
  benefit_option: string
  family_size: string
  premium_amount: number
  payment_type: string
  benefit_name: string
  created_at: string
}

export function QuoteHistory() {
  const { user, session } = useAuth()
  const [quotes, setQuotes] = useState<QuoteHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const fetchQuotes = useCallback(async () => {
    if (!session?.access_token) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/quotes', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        setQuotes(data.data)
      } else {
        setError(data.error?.message || 'Failed to load history')
      }
    } catch {
      setError('Failed to load quote history')
    } finally {
      setLoading(false)
    }
  }, [session?.access_token])

  useEffect(() => {
    if (user && isExpanded) {
      fetchQuotes()
    }
  }, [user, isExpanded, fetchQuotes])

  if (!user) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(amount))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        {/* Header - Clickable to expand/collapse */}
        <div className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 flex-1"
          >
            <div className="p-2 bg-primary-100 rounded-lg">
              <History className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Quote History</h3>
              <p className="text-sm text-gray-500">
                {quotes.length > 0 ? `${quotes.length} previous quotes` : 'View your previous calculations'}
              </p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            {isExpanded && (
              <button
                onClick={fetchQuotes}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 border-t border-gray-100">
                {loading && quotes.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading history...</p>
                  </div>
                ) : error ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-red-500">{error}</p>
                    <button
                      onClick={fetchQuotes}
                      className="mt-2 text-sm text-primary-600 hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : quotes.length === 0 ? (
                  <div className="py-8 text-center">
                    <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No quotes yet</p>
                    <p className="text-xs text-gray-400 mt-1">Your calculations will appear here</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
                    {quotes.map((quote, index) => (
                      <motion.div
                        key={quote.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-primary-600">
                                {formatCurrency(quote.premium_amount)}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                quote.payment_type === 'ANNUAL' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {quote.payment_type}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span>{quote.benefit_name}</span>
                              <span className="mx-2">•</span>
                              <span>Age {quote.age}</span>
                              <span className="mx-2">•</span>
                              <span>{quote.family_size === 'M' ? 'Principal Only' : 'Principal + Spouse'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(quote.created_at)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
