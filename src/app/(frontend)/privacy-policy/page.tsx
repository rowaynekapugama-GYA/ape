import { CONTENT } from '@/content'
import { pageMetadata } from '@/lib/seo'
import { Txt } from '@/lib/text'

const c = CONTENT.privacy

export const metadata = pageMetadata(c.meta, '/privacy-policy/', { noindex: true })

/** Placeholder page so the footer link resolves. Content to be supplied by the practice. */
export default function PrivacyPage() {
  return (
    <section className="hero-simple">
      <div className="wrap prose">
        <h1>
          <Txt>{c.heading}</Txt>
        </h1>
        <p style={{ marginTop: 28 }}>
          <Txt>{c.body}</Txt>
        </p>
      </div>
    </section>
  )
}
