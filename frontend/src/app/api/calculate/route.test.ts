import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST, GET } from './route'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => Promise.resolve({
              data: {
                id: 1,
                age: 35,
                family_size: 'M',
                payment_type: 'ANNUAL',
                option_1: 100000,
                option_2: 150000,
                option_3: 200000,
                option_4: 250000,
              },
              error: null,
            })),
          })),
        })),
      })),
    })),
  },
}))

describe('Premium Calculator API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/calculate', () => {
    it('should return API documentation', async () => {
      const response = await GET()
      const data = await response.json()

      expect(data.name).toBe('PRMF Premium Calculator API')
      expect(data.version).toBe('1.0.0')
      expect(data.endpoint).toBe('POST /api/calculate')
    })
  })

  describe('POST /api/calculate - Validation', () => {
    it('should reject request with missing age', async () => {
      const request = new NextRequest('http://localhost/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          benefit_option: 'option_1',
          family_size: 'M',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('MISSING_REQUIRED_FIELD')
    })

    it('should reject request with age below 18', async () => {
      const request = new NextRequest('http://localhost/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          age: 17,
          benefit_option: 'option_1',
          family_size: 'M',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('INVALID_AGE')
    })

    it('should reject request with age above 90', async () => {
      const request = new NextRequest('http://localhost/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          age: 91,
          benefit_option: 'option_1',
          family_size: 'M',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('INVALID_AGE')
    })

    it('should reject request with invalid benefit option', async () => {
      const request = new NextRequest('http://localhost/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          age: 35,
          benefit_option: 'invalid_option',
          family_size: 'M',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('INVALID_BENEFIT_OPTION')
    })

    it('should reject request with invalid family size', async () => {
      const request = new NextRequest('http://localhost/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          age: 35,
          benefit_option: 'option_1',
          family_size: 'INVALID',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('INVALID_FAMILY_SIZE')
    })

    it('should reject request with missing benefit option', async () => {
      const request = new NextRequest('http://localhost/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          age: 35,
          family_size: 'M',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('MISSING_REQUIRED_FIELD')
    })

    it('should reject request with missing family size', async () => {
      const request = new NextRequest('http://localhost/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          age: 35,
          benefit_option: 'option_1',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('MISSING_REQUIRED_FIELD')
    })
  })

  describe('POST /api/calculate - Payment Type Logic', () => {
    it('should return ANNUAL payment type for age 18-60', async () => {
      const request = new NextRequest('http://localhost/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          age: 35,
          benefit_option: 'option_1',
          family_size: 'M',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.payment_type).toBe('ANNUAL')
    })

    it('should return LUMPSUM payment type for age 61-90', async () => {
      // Re-mock for this specific test
      const { supabase } = await import('@/lib/supabase')
      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn(() => Promise.resolve({
                data: {
                  id: 1,
                  age: 65,
                  family_size: 'M',
                  payment_type: 'LUMPSUM',
                  option_1: 500000,
                  option_2: 600000,
                  option_3: 700000,
                  option_4: 800000,
                },
                error: null,
              })),
            })),
          })),
        })),
      }) as ReturnType<typeof supabase.from>)

      const request = new NextRequest('http://localhost/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          age: 65,
          benefit_option: 'option_1',
          family_size: 'M',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.payment_type).toBe('LUMPSUM')
    })
  })

  describe('POST /api/calculate - Edge Cases', () => {
    it('should handle age 18 (minimum)', async () => {
      const request = new NextRequest('http://localhost/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          age: 18,
          benefit_option: 'option_1',
          family_size: 'M',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.payment_type).toBe('ANNUAL')
    })

    it('should handle age 60 (boundary between ANNUAL and LUMPSUM)', async () => {
      const request = new NextRequest('http://localhost/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          age: 60,
          benefit_option: 'option_1',
          family_size: 'M',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.payment_type).toBe('ANNUAL')
    })

    it('should handle age 61 (first LUMPSUM age)', async () => {
      const { supabase } = await import('@/lib/supabase')
      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn(() => Promise.resolve({
                data: {
                  id: 1,
                  age: 61,
                  family_size: 'M',
                  payment_type: 'LUMPSUM',
                  option_1: 500000,
                  option_2: 600000,
                  option_3: 700000,
                  option_4: 800000,
                },
                error: null,
              })),
            })),
          })),
        })),
      }) as ReturnType<typeof supabase.from>)

      const request = new NextRequest('http://localhost/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          age: 61,
          benefit_option: 'option_1',
          family_size: 'M',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.payment_type).toBe('LUMPSUM')
    })

    it('should handle M+1 family size', async () => {
      const { supabase } = await import('@/lib/supabase')
      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              maybeSingle: vi.fn(() => Promise.resolve({
                data: {
                  id: 2,
                  age: 35,
                  family_size: 'M+1',
                  payment_type: 'ANNUAL',
                  option_1: 200000,
                  option_2: 300000,
                  option_3: 400000,
                  option_4: 500000,
                },
                error: null,
              })),
            })),
          })),
        })),
      }) as ReturnType<typeof supabase.from>)

      const request = new NextRequest('http://localhost/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          age: 35,
          benefit_option: 'option_2',
          family_size: 'M+1',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.family_size).toBe('M+1')
      expect(data.data.premium_amount).toBe(300000)
    })
  })
})
