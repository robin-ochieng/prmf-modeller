'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui'

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, authModalView, setAuthModalView, signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (authModalView === 'signup') {
      const { error } = await signUp(email, password, fullName)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Account created! Check your email to confirm your account.')
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      }
    }
    setLoading(false)
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setError(null)
    setSuccess(null)
  }

  const switchView = (view: 'signin' | 'signup') => {
    setAuthModalView(view)
    resetForm()
  }

  if (!showAuthModal) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
        onClick={() => setShowAuthModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-2 sm:my-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative gradient header */}
          <div className="relative h-24 sm:h-32 md:h-40 bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 overflow-hidden">
            {/* Abstract shapes - hidden on very small screens for performance */}
            <div className="hidden sm:block absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="hidden sm:block absolute -bottom-20 -left-10 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl" />
            <div className="hidden sm:block absolute top-10 left-10 w-20 h-20 bg-amber-400/30 rounded-full blur-2xl" />
            
            {/* Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Image
                  src="/kenbrigt_logo.png"
                  alt="Kenbright"
                  width={160}
                  height={64}
                  className="object-contain brightness-0 invert drop-shadow-lg w-28 sm:w-36 md:w-40 h-auto"
                />
              </motion.div>
            </div>
            
            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8 pt-4 sm:pt-6">
            {/* Header */}
            <motion.div
              key={authModalView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4 sm:mb-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {authModalView === 'signin' ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                {authModalView === 'signin'
                  ? 'Sign in to calculate your insurance premium'
                  : 'Join us to get instant personalized quotes'}
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <AnimatePresence mode="wait">
                {authModalView === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all outline-none"
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all outline-none"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 sm:p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs sm:text-sm flex items-start gap-2"
                  >
                    <span className="shrink-0">⚠️</span>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 sm:p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-xs sm:text-sm flex items-start gap-2"
                  >
                    <span className="shrink-0">✅</span>
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full !py-3 sm:!py-4 !text-sm sm:!text-base font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {authModalView === 'signin' ? (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Sign In
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {authModalView === 'signin' ? 'New to Kenbright?' : 'Already have an account?'}
                </span>
              </div>
            </div>

            {/* Switch auth mode */}
            <button
              onClick={() => switchView(authModalView === 'signin' ? 'signup' : 'signin')}
              className="w-full py-2.5 sm:py-3 px-4 border-2 border-gray-200 rounded-xl text-sm sm:text-base text-gray-700 font-medium hover:border-primary-300 hover:bg-primary-50 transition-all"
            >
              {authModalView === 'signin' ? 'Create a new account' : 'Sign in to existing account'}
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-400 text-center mt-4 sm:mt-6">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-primary-500 hover:text-primary-600 hover:underline transition-colors">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary-500 hover:text-primary-600 hover:underline transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
