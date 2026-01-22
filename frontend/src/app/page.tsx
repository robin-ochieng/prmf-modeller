'use client'

import { useState } from 'react'
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion'
import Image from 'next/image'
import { Calculator, Sparkles, Shield, TrendingUp } from 'lucide-react'
import { Button, Card, CalculatingAnimation } from '@/components/ui'
import { AgeSlider, BenefitSelector, FamilySizeToggle, PremiumResult } from '@/components/calculator'
import { BenefitOption, FamilySize, CalculateSuccessResponse } from '@/types'

export default function Home() {
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
    <div className="min-h-screen relative overflow-hidden">
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
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.header
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 md:gap-4 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div className="rounded-2xl bg-white/80 p-2 shadow-lg shadow-primary-200/40 ring-1 ring-primary-100">
              <Image
                src="/kenbrigt_logo.png"
                alt="Kenbright logo"
                width={72}
                height={72}
                className="h-14 w-14 md:h-16 md:w-16 object-contain"
                priority
              />
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-primary-600 font-semibold">Kenbright</p>
              <p className="text-lg md:text-xl font-semibold text-gray-900">PRMF Premium Calculator</p>
              <p className="text-sm text-gray-500">Tailored health cover insights</p>
            </div>
          </motion.div>

          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            Premium Rate Calculator
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gradient">PRMF</span>{' '}
            <span className="text-gray-900">Calculator</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Calculate your medical insurance premium instantly. 
            <span className="hidden md:inline"> Get personalized quotes based on your age, coverage needs, and family size.</span>
          </p>
        </motion.header>

        {/* Calculator Card */}
        <div className="max-w-4xl mx-auto">
          <Card variant="glass" className="backdrop-blur-xl">
            {/* Features bar */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 pb-8 border-b border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Feature icon={<Shield className="w-5 h-5" />} text="4 Coverage Options" />
              <Feature icon={<Calculator className="w-5 h-5" />} text="Instant Quotes" />
              <Feature icon={<TrendingUp className="w-5 h-5" />} text="Competitive Rates" />
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
            className="text-center mt-8 text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>
              Rates are indicative and subject to underwriting approval.
            </p>
            <p className="mt-2">
              © {new Date().getFullYear()} PRMF Calculator. All rights reserved.
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
