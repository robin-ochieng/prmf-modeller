/**
 * Utility functions for the PRMF Calculator
 */

import { type ClassValue, clsx } from 'clsx'

/**
 * Merge class names conditionally
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Format currency in KES
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}
