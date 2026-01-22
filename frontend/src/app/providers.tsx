'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <AuthModal />
    </AuthProvider>
  )
}
