/**
 * Booking integration contract. The UI only ever talks to these types through /api/booking/*,
 * so swapping the mock for the live booking system and payment gateway does not touch the page.
 */

export type Slot = {
  id: string
  /** ISO 8601 start and end, UTC. */
  start: string
  end: string
  /** Clinician or room, if the booking system exposes it. */
  resource?: string
}

export type BookingDetails = {
  name: string
  email: string
  phone?: string
  notes?: string
}

export type Hold = {
  holdId: string
  slot: Slot
  /** The slot is reserved for the patient until this time while they pay the deposit. */
  expiresAt: string
}

export type DepositResult =
  /** Payment completed in-process (mock, or a gateway that confirms synchronously). */
  | { status: 'paid'; bookingRef: string; slot: Slot }
  /** Hosted payment page (for example Stripe Checkout). The browser is sent to `url`. */
  | { status: 'redirect'; url: string }

export interface BookingProvider {
  readonly mode: 'mock' | 'live'
  /** APE sessions only. Never the full clinic diary. */
  getAvailability(fromIso: string, toIso: string): Promise<Slot[]>
  createHold(slotId: string, details: BookingDetails): Promise<Hold>
  /** Takes the $100 deposit for a hold. Must only run after the policy checkbox is ticked. */
  startDeposit(holdId: string, policyAcknowledged: true): Promise<DepositResult>
}

export class BookingError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message)
  }
}
