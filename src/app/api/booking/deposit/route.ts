import { NextResponse } from 'next/server'
import { BookingError, getBookingProvider } from '@/lib/booking'
import { fail } from '../_respond'

export const dynamic = 'force-dynamic'

/**
 * POST /api/booking/deposit : take the $100 deposit for a hold.
 * Refuses unless the deposit and cancellation policy checkbox was ticked.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    if (body.policyAcknowledged !== true) throw new BookingError('Please confirm you have read the deposit and cancellation policy.', 400)
    const holdId = String(body.holdId || '')
    if (!holdId) throw new BookingError('Missing hold.', 400)
    const result = await getBookingProvider().startDeposit(holdId, true)
    return NextResponse.json(result)
  } catch (err) {
    return fail(err)
  }
}
