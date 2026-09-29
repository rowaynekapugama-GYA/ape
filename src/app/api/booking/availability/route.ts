import { NextResponse } from 'next/server'
import { getBookingProvider } from '@/lib/booking'
import { fail } from '../_respond'

export const dynamic = 'force-dynamic'

/** GET /api/booking/availability : APE sessions for the next few weeks. */
export async function GET() {
  try {
    const provider = getBookingProvider()
    const from = new Date()
    const to = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60)
    const slots = await provider.getAvailability(from.toISOString(), to.toISOString())
    return NextResponse.json({ mode: provider.mode, slots }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    return fail(err)
  }
}
