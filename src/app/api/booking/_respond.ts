import { NextResponse } from 'next/server'
import { BookingError } from '@/lib/booking'

export function fail(err: unknown) {
  if (err instanceof BookingError) return NextResponse.json({ error: err.message }, { status: err.status })
  console.error('[booking]', err)
  return NextResponse.json({ error: 'Something went wrong. Please try again or contact us.' }, { status: 500 })
}
