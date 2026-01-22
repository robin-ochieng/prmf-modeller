'use client'

import { useState } from 'react'
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion'
import { Calculator, LogIn, UserPlus, LogOut, User } from 'lucide-react'
import Image from 'next/image'
import { Button, Card, CalculatingAnimation } from '@/components/ui'
import { AgeSlider, BenefitSelector, FamilySizeToggle, PremiumResult } from '@/components/calculator'
import { BenefitOption, FamilySize, CalculateSuccessResponse } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  // Auth
  const { user, loading: authLoading, setShowAuthModal, setAuthModalView, signOut } = useAuth()

  // Form state
  const [age, setAge] = useState<number>(35)
  const [benefitOption, setBenefitOption] = useState<BenefitOption | ''>('')
  const [familySize, setFamilySize] = useState<FamilySize | ''>('')
  
  // UI state
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<CalculateSuccessResponse['data'] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  // Validation
  const [errors, setErrors] = useState<{
    age?: string
    benefitOption?: string
    familySize?: string
  }>({})

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (age < 18 || age > 90) {
      newErrors.age = 'Age must be between 18 and 90'
    }

    if (!benefitOption) {
      newErrors.benefitOption = 'Please select a benefit option'
    }

    if (!familySize) {
      newErrors.familySize = 'Please select a family size'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = async () => {
    // Check if user is authenticated
    if (!user) {
      setAuthModalView('signin')
      setShowAuthModal(true)
      return
    }

    if (!validateForm()) return

    setIsCalculating(true)
    setError(null)
    setShowResult(false)

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age,
          benefit_option: benefitOption,
          family_size: familySize,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
        // Small delay for dramatic effect
        setTimeout(() => {
          setShowResult(true)
        }, 500)
      } else {
        setError(data.error.message)
      }
    } catch {
      setError('Failed to calculate premium. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleReset = () => {
    setAge(35)
    setBenefitOption('')
    setFamilySize('')
    setResult(null)
    setShowResult(false)
    setError(null)
    setErrors({})
  }

  return (
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Header Bar */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Image
            src="/kenbrigt_logo.png"
            alt="Kenbright"
            width={120}
            height={48}
            priority
            className="object-contain"
          />
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {authLoading ? (
              // Skeleton placeholder to prevent hydration mismatch
              <div className="flex items-center gap-3">
                <div className="w-20 h-9 bg-gray-200 rounded-lg animate-pulse" />
                <div className="w-24 h-9 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ) : user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="max-w-[150px] truncate">{user.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthModalView('signin')
                    setShowAuthModal(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
                <button
                  onClick={() => {
                    setAuthModalView('signup')
                    setShowAuthModal(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </button>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Static background elements - animate on hover only for better performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-primary-300/30 rounded-full blur-3xl transition-transform duration-1000 hover:scale-110"
        />
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl transition-transform duration-1000 hover:scale-110"
        />
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl transition-transform duration-1000 hover:scale-110"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 container mx-auto px-4 pt-24 pb-6 md:pt-28 md:pb-10 flex items-start justify-center">
        {/* Calculator Card */}
        <div className="w-full max-w-4xl">
          <Card variant="glass" className="backdrop-blur-xl">
            {/* Title and Description */}
            <motion.div
              className="text-center mb-8 pb-8 border-b border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                <span className="text-gradient">PRMF</span>{' '}
                <span className="text-gray-900">Premium Rate Calculator</span>
              </h1>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                Calculate your medical insurance premium based on age, benefit option, and family size. Get instant personalized quotes.
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {isCalculating ? (
                <motion.div
                  key="calculating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16"
                >
                  <CalculatingAnimation />
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Form */}
                  <div className="space-y-8">
                    {/* Age Slider */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <AgeSlider
                        value={age}
                        onChange={(value) => {
                          setAge(value)
                          setErrors((prev) => ({ ...prev, age: undefined }))
                        }}
                        error={errors.age}
                      />
                    </motion.div>

                    {/* Benefit Selector */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <BenefitSelector
                        value={benefitOption}
                        onChange={(value) => {
                          setBenefitOption(value)
                          setErrors((prev) => ({ ...prev, benefitOption: undefined }))
                        }}
                        error={errors.benefitOption}
                      />
                    </motion.div>

                    {/* Family Size Toggle */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <FamilySizeToggle
                        value={familySize}
                        onChange={(value) => {
                          setFamilySize(value)
                          setErrors((prev) => ({ ...prev, familySize: undefined }))
                        }}
                        error={errors.familySize}
                      />
                    </motion.div>

                    {/* Error display */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action buttons */}
                    <motion.div
                      className="flex flex-col sm:flex-row gap-4 pt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Button
                        onClick={handleCalculate}
                        variant="primary"
                        size="lg"
                        className="flex-1"
                        disabled={isCalculating}
                      >
                        <Calculator className="w-5 h-5 mr-2" />
                        Calculate Premium
                      </Button>

                      {(result || Object.keys(errors).length > 0) && (
                        <Button
                          onClick={handleReset}
                          variant="outline"
                          size="lg"
                          className="sm:w-auto"
                        >
                          Reset
                        </Button>
                      )}
                    </motion.div>
                  </div>

                  {/* Result Display */}
                  <PremiumResult result={result} isVisible={showResult} />
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Footer */}
          <motion.footer
            className="text-center mt-8 text-gray-500 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>
              Rates are indicative and subject to underwriting approval. © {new Date().getFullYear()} PRMF Calculator.
            </p>
            <p className="mt-1">
              Developed by <span className="font-semibold text-gray-700">Kenbright AI</span>
            </p>
          </motion.footer>
        </div>
      </div>
    </div>
    </LazyMotion>
  )
}

// Feature component
function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <span className="text-primary-500">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}
