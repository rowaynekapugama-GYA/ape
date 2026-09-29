import type { BookingProvider } from './types'
import { BookingError } from './types'
import { mockProvider } from './mock'

/**
 * INTEGRATION POINT
 * -----------------
 * Set BOOKING_PROVIDER in Vercel to choose the provider. Only "mock" exists today.
 *
 * To connect the live system, add a provider in this folder that implements BookingProvider:
 *   getAvailability  read APE-only sessions from the practice booking system (APE appointment type,
 *                    designated days and clinicians), never the full diary
 *   createHold       reserve the chosen session for about 15 minutes and store the patient details
 *   startDeposit     create a $100 payment (for example a Stripe Checkout Session with the hold id in
 *                    metadata) and return { status: 'redirect', url }; a webhook then confirms the
 *                    booking in the booking system and sends the confirmation email
 * then register it below. The pages and API routes do not change.
 */
const PROVIDERS: Record<string, BookingProvider> = {
  mock: mockProvider,
}

export function getBookingProvider(): BookingProvider {
  const key = (process.env.BOOKING_PROVIDER || 'mock').toLowerCase()
  const provider = PROVIDERS[key]
  if (!provider) throw new BookingError(`Booking provider "${key}" is not connected yet.`, 501)
  return provider
}

export * from './types'
