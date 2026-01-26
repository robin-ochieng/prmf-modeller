import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export interface QuoteHistoryItem {
  id: string
  age: number
  benefit_option: string
  family_size: string
  premium_amount: number
  payment_type: string
  benefit_name: string
  created_at: string
}

export interface QuoteHistoryResponse {
  success: boolean
  data?: QuoteHistoryItem[]
  error?: {
    code: string
    message: string
  }
}

/**
 * GET /api/quotes
 * Fetch user's quote history
 */
export async function GET(request: NextRequest): Promise<NextResponse<QuoteHistoryResponse>> {
  try {
    // Get user from authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Please sign in to view your quote history.',
          },
        },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Create authenticated Supabase client with user's token
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFIGURATION_ERROR',
            message: 'Server configuration error.',
          },
        },
        { status: 500 }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired session. Please sign in again.',
          },
        },
        { status: 401 }
      )
    }

    // Fetch quote history for the user (RLS will filter by auth.uid())
    const { data: quotes, error: dbError } = await supabase
      .from('quote_history')
      .select('id, age, benefit_option, family_size, premium_amount, payment_type, benefit_name, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50) // Limit to last 50 quotes

    if (dbError) {
      console.error('Database error fetching quotes:', dbError)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch quote history. Please try again.',
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: quotes || [],
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
