import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import {
  CalculateRequest,
  CalculateResponse,
  BenefitOption,
  FamilySize,
  PaymentType,
  BENEFIT_OPTIONS,
  DISCLAIMERS,
  VALIDATION,
} from '@/types'

// Valid options for validation
const VALID_BENEFIT_OPTIONS: BenefitOption[] = ['option_1', 'option_2', 'option_3', 'option_4']
const VALID_FAMILY_SIZES: FamilySize[] = ['M', 'M+1']

/**
 * Determine payment type based on age
 */
function getPaymentType(age: number): PaymentType {
  if (age >= VALIDATION.LUMPSUM_MIN_AGE) {
    return 'LUMPSUM'
  }
  return 'ANNUAL'
}

/**
 * Validate the request body
 */
function validateRequest(body: unknown): { valid: true; data: CalculateRequest } | { valid: false; error: { code: string; message: string } } {
  // Check if body is an object
  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      error: { code: 'INVALID_REQUEST', message: 'Request body must be a JSON object' },
    }
  }

  const { age, benefit_option, family_size } = body as Record<string, unknown>

  // Validate age
  if (age === undefined || age === null) {
    return {
      valid: false,
      error: { code: 'MISSING_REQUIRED_FIELD', message: 'Age is required' },
    }
  }

  if (typeof age !== 'number' || !Number.isInteger(age)) {
    return {
      valid: false,
      error: { code: 'INVALID_AGE', message: 'Age must be an integer' },
    }
  }

  if (age < VALIDATION.MIN_AGE || age > VALIDATION.MAX_AGE) {
    return {
      valid: false,
      error: { code: 'INVALID_AGE', message: `Age must be between ${VALIDATION.MIN_AGE} and ${VALIDATION.MAX_AGE}` },
    }
  }

  // Validate benefit_option
  if (!benefit_option) {
    return {
      valid: false,
      error: { code: 'MISSING_REQUIRED_FIELD', message: 'Benefit option is required' },
    }
  }

  if (!VALID_BENEFIT_OPTIONS.includes(benefit_option as BenefitOption)) {
    return {
      valid: false,
      error: { code: 'INVALID_BENEFIT_OPTION', message: `Benefit option must be one of: ${VALID_BENEFIT_OPTIONS.join(', ')}` },
    }
  }

  // Validate family_size
  if (!family_size) {
    return {
      valid: false,
      error: { code: 'MISSING_REQUIRED_FIELD', message: 'Family size is required' },
    }
  }

  if (!VALID_FAMILY_SIZES.includes(family_size as FamilySize)) {
    return {
      valid: false,
      error: { code: 'INVALID_FAMILY_SIZE', message: `Family size must be one of: ${VALID_FAMILY_SIZES.join(', ')}` },
    }
  }

  return {
    valid: true,
    data: {
      age: age as number,
      benefit_option: benefit_option as BenefitOption,
      family_size: family_size as FamilySize,
    },
  }
}

/**
 * POST /api/calculate
 * Calculate premium based on age, benefit option, and family size
 */
export async function POST(request: NextRequest): Promise<NextResponse<CalculateResponse>> {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables in production')
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFIGURATION_ERROR',
            message: 'Server configuration error. Please contact support.',
          },
        },
        { status: 500 }
      )
    }

    // Parse request body
    const body = await request.json()

    // Validate request
    const validation = validateRequest(body)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      )
    }

    const { age, benefit_option, family_size } = validation.data

    // Query Supabase for the premium rate
    // Using maybeSingle() instead of single() to avoid PGRST116 errors when no row found
    const { data: rates, error: dbError } = await supabase
      .from('premium_rates')
      .select('*')
      .eq('age', age)
      .eq('family_size', family_size)
      .maybeSingle()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'An error occurred while fetching premium rates. Please try again.',
          },
        },
        { status: 500 }
      )
    }

    if (!rates) {
      console.warn(`No premium rate found for age ${age}, family_size ${family_size}`)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_NOT_FOUND',
            message: `No premium rate found for age ${age} and family size ${family_size}. Please contact support.`,
          },
        },
        { status: 404 }
      )
    }

    // Get the premium amount for the selected option
    const premiumAmount = rates[benefit_option] as number
    const paymentType = getPaymentType(age)
    const benefitName = BENEFIT_OPTIONS[benefit_option]

    // Save quote to history (non-blocking, don't fail if this errors)
    // Extract user ID from Authorization header if present
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null
    
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7)
        const { data: { user } } = await supabase.auth.getUser(token)
        userId = user?.id || null
      } catch {
        // Silently ignore auth errors for quote saving
      }
    }

    // Save quote history asynchronously (fire and forget)
    supabase
      .from('quote_history')
      .insert({
        user_id: userId,
        age,
        benefit_option,
        family_size,
        premium_amount: premiumAmount,
        payment_type: paymentType,
        benefit_name: benefitName,
      })
      .then(({ error }) => {
        if (error) {
          console.error('Failed to save quote history:', error)
        }
      })

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        age,
        family_size,
        benefit_option: BENEFIT_OPTIONS[benefit_option],
        premium_amount: premiumAmount,
        payment_type: paymentType,
        currency: 'KES',
        disclaimer: DISCLAIMERS[paymentType],
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred. Please try again.',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/calculate
 * Return API documentation
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    name: 'PRMF Premium Calculator API',
    version: '1.0.0',
    endpoint: 'POST /api/calculate',
    description: 'Calculate medical insurance premium based on age, benefit option, and family size',
    request: {
      age: 'number (18-90)',
      benefit_option: 'string (option_1, option_2, option_3, option_4)',
      family_size: 'string (M, M+1)',
    },
    example: {
      age: 45,
      benefit_option: 'option_2',
      family_size: 'M',
    },
    notes: [
      'Ages 18-60 receive ANNUAL premium rates',
      'Ages 61-90 receive LUMPSUM (one-time) premium rates',
      'M = Principal member only',
      'M+1 = Principal member + Spouse',
    ],
  })
}
