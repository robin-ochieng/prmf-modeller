import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only throw in development - in production, log the error
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  console.error(errorMessage)
  if (process.env.NODE_ENV === 'development') {
    throw new Error(errorMessage)
  }
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Database types
export interface PremiumRate {
  id: number
  age: number
  family_size: 'M' | 'M+1'
  payment_type: 'LUMPSUM' | 'ANNUAL'
  option_1: number
  option_2: number
  option_3: number
  option_4: number
  created_at: string
  updated_at: string
}
