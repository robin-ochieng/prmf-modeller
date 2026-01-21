import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
