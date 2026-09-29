import { NextResponse } from 'next/server'
import { BookingError, getBookingProvider } from '@/lib/booking'
import { fail } from '../_respond'

export const dynamic = 'force-dynamic'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** POST /api/booking/hold : reserve a session while the patient pays the deposit. */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const slotId = String(body.slotId || '')
    const details = {
      name: String(body.name || '').trim().slice(0, 120),
      email: String(body.email || '').trim().slice(0, 200),
      phone: String(body.phone || '').trim().slice(0, 40) || undefined,
      notes: String(body.notes || '').trim().slice(0, 2000) || undefined,
    }
    if (!slotId || !details.name || !EMAIL.test(details.email)) throw new BookingError('Missing details.', 400)
    const hold = await getBookingProvider().createHold(slotId, details)
    return NextResponse.json(hold)
  } catch (err) {
    return fail(err)
  }
}
