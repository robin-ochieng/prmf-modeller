// Request/Response types for the Premium Calculator API

export type BenefitOption = 'option_1' | 'option_2' | 'option_3' | 'option_4'
export type FamilySize = 'M' | 'M+1'
export type PaymentType = 'LUMPSUM' | 'ANNUAL'

// API Request
export interface CalculateRequest {
  age: number
  benefit_option: BenefitOption
  family_size: FamilySize
}

// API Response - Success
export interface CalculateSuccessResponse {
  success: true
  data: {
    age: number
    family_size: FamilySize
    benefit_option: string
    premium_amount: number
    payment_type: PaymentType
    currency: string
    disclaimer: string
  }
}

// API Response - Error
export interface CalculateErrorResponse {
  success: false
  error: {
    code: string
    message: string
  }
}

export type CalculateResponse = CalculateSuccessResponse | CalculateErrorResponse

// Benefit option display names
export const BENEFIT_OPTIONS: Record<BenefitOption, string> = {
  option_1: 'Option I',
  option_2: 'Option II',
  option_3: 'Option III',
  option_4: 'Option IV',
}

// Family size display names
export const FAMILY_SIZE_OPTIONS: Record<FamilySize, string> = {
  'M': 'M (Principal Only)',
  'M+1': 'M+1 (Principal + Spouse)',
}

// Disclaimer messages
export const DISCLAIMERS: Record<PaymentType, string> = {
  LUMPSUM: 'This is a LUMPSUM (one-time) premium payment applicable for retirees aged 61-90.',
  ANNUAL: 'This is an ANNUAL premium payment applicable for active members aged 18-60.',
}

// Validation constants
export const VALIDATION = {
  MIN_AGE: 18,
  MAX_AGE: 90,
  LUMPSUM_MIN_AGE: 61,
  ANNUAL_MAX_AGE: 60,
}
