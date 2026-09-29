import { CONTENT } from '@/content'
import { pageMetadata } from '@/lib/seo'
import { Txt } from '@/lib/text'
import { Button, Eyebrow, Frame } from '@/components/Ui'
import BookingFlow, { ChooseTimeButton } from '@/components/BookingFlow'

const c = CONTENT.book

export const metadata = pageMetadata(c.meta, '/book-now/', { image: c.hero.image.src })

export default function BookNowPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="wrap grid">
          <div>
            <Eyebrow>{c.hero.eyebrow}</Eyebrow>
            <h1 className="reveal d1">
              <Txt>{c.hero.headline}</Txt>
            </h1>
            <p className="sub reveal d2" style={{ marginBottom: 0 }}>
              <Txt>{c.hero.subheading}</Txt>
            </p>
          </div>
          <div className="hero-media reveal d1">
            <Frame image={c.hero.image} className="landscape" priority />
          </div>
        </div>
      </section>

      {/* Appointment card, how booking works, booking flow (policy sits inside the payment step) */}
      <section className="section bg-blush" style={{ paddingTop: 'clamp(56px,7vw,96px)' }} aria-label="Book your appointment">
        <div className="wrap">
          <div className="appt-card reveal">
            <div>
              <h2>
                <Txt>{c.appointmentCard.title}</Txt>
              </h2>
              <p className="details">
                <Txt>{c.appointmentCard.details}</Txt>
              </p>
              <p className="deposit">
                <Txt>{c.appointmentCard.deposit}</Txt>
              </p>
            </div>
            <ChooseTimeButton label={c.appointmentCard.button} />
          </div>

          <div style={{ marginTop: 28 }}>
            <BookingFlow copy={{ steps: c.steps, policy: c.policy, confirmation: c.confirmation }} />
          </div>
        </div>
      </section>

      {/* Reassurance strip */}
      <section className="section" style={{ paddingTop: 'clamp(48px,6vw,80px)' }} aria-label="Talk to Alex">
        <div className="wrap">
          <div className="reassure reveal">
            <p>
              <Txt>{c.reassurance.body}</Txt>
            </p>
            <Button link={c.reassurance.button} variant="ghost" />
          </div>
        </div>
      </section>
    </>
  )
}
