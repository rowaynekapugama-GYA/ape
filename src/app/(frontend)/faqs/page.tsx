import { CONTENT } from '@/content'
import { pageMetadata } from '@/lib/seo'
import { Txt, typeset } from '@/lib/text'
import { Eyebrow, ReadyPanel } from '@/components/Ui'
import Accordion from '@/components/Accordion'

const c = CONTENT.faqs

export const metadata = pageMetadata(c.meta, '/faqs/')

export default function FaqsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.items.map((i) => ({
      '@type': 'Question',
      name: typeset(i.q),
      acceptedAnswer: { '@type': 'Answer', text: typeset(i.a) },
    })),
  }
  return (
    <>
      {/* Hero */}
      <section className="hero-simple center">
        <div className="wrap">
          <Eyebrow>{c.hero.eyebrow}</Eyebrow>
          <h1 className="reveal d1">
            <Txt>{c.hero.headline}</Txt>
          </h1>
        </div>
      </section>

      {/* Questions and answers */}
      <section className="section" style={{ paddingTop: 'clamp(24px,4vw,56px)' }} aria-label="Questions and answers">
        <div className="wrap">
          <Accordion items={c.items} />
        </div>
      </section>

      {/* Closing CTA */}
      <ReadyPanel heading={c.closing.heading} body={c.closing.body} buttons={c.closing.buttons} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  )
}
