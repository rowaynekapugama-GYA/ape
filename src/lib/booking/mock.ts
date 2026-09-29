import { SITE_CONFIG } from '@/site.config'
import type { BookingDetails, BookingProvider, DepositResult, Hold, Slot } from './types'
import { BookingError } from './types'

/** Offset in minutes between UTC and the given time zone at an instant. */
function tzOffsetMinutes(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant)
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  return Math.round((asUtc - instant.getTime()) / 60000)
}

/** Local wall-clock time in a zone to a UTC Date. */
function zonedToUtc(y: number, m: number, d: number, hh: number, mm: number, timeZone: string): Date {
  const guess = Date.UTC(y, m, d, hh, mm)
  const first = tzOffsetMinutes(new Date(guess), timeZone)
  const second = tzOffsetMinutes(new Date(guess - first * 60000), timeZone)
  return new Date(guess - second * 60000)
}

function localDateParts(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-AU', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }).formatToParts(instant)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return { y: Number(get('year')), m: Number(get('month')) - 1, d: Number(get('day')), weekday }
}

function sessions(): Slot[] {
  const cfg = SITE_CONFIG.booking.mockSessions
  const minutes = SITE_CONFIG.booking.product.durationMinutes
  const now = Date.now()
  const earliest = now + cfg.minNoticeHours * 3600000
  const out: Slot[] = []
  for (let i = 0; i < cfg.weeksAhead * 7; i++) {
    const day = new Date(now + i * 86400000)
    const { y, m, d, weekday } = localDateParts(day, cfg.timeZone)
    if (!(cfg.days as readonly number[]).includes(weekday)) continue
    for (const t of cfg.startTimes) {
      const [hh, mm] = t.split(':').map(Number)
      const start = zonedToUtc(y, m, d, hh, mm, cfg.timeZone)
      if (start.getTime() < earliest) continue
      const end = new Date(start.getTime() + minutes * 60000)
      out.push({ id: `ape-${start.toISOString()}`, start: start.toISOString(), end: end.toISOString() })
    }
  }
  return out
}

/**
 * Sample provider. Generates APE-only sessions from SITE_CONFIG.booking.mockSessions and "takes" the
 * deposit without any payment. Nothing is stored. Replace with the live provider (see README).
 */
export const mockProvider: BookingProvider = {
  mode: 'mock',
  async getAvailability(fromIso, toIso) {
    const from = Date.parse(fromIso)
    const to = Date.parse(toIso)
    return sessions().filter((s) => Date.parse(s.start) >= from && Date.parse(s.start) <= to)
  },
  async createHold(slotId: string, details: BookingDetails): Promise<Hold> {
    const slot = sessions().find((s) => s.id === slotId)
    if (!slot) throw new BookingError('That time is no longer available.', 409)
    if (!details.name?.trim() || !details.email?.trim()) throw new BookingError('Missing details.', 400)
    const payload = Buffer.from(JSON.stringify({ slot })).toString('base64url')
    return { holdId: `mock.${payload}`, slot, expiresAt: new Date(Date.now() + 15 * 60000).toISOString() }
  },
  async startDeposit(holdId: string): Promise<DepositResult> {
    if (!holdId.startsWith('mock.')) throw new BookingError('Unknown hold.', 404)
    const { slot } = JSON.parse(Buffer.from(holdId.slice(5), 'base64url').toString()) as { slot: Slot }
    const bookingRef = `APE-TEST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    return { status: 'paid', bookingRef, slot }
  },
}
