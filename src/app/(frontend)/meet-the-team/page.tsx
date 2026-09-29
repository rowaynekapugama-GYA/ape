import { CONTENT } from '@/content'
import { pageMetadata } from '@/lib/seo'
import { Txt, splitFirstSentence } from '@/lib/text'
import { Button, Eyebrow, Frame, ReadyPanel } from '@/components/Ui'

const c = CONTENT.team

export const metadata = pageMetadata(c.meta, '/meet-the-team/')

function Quote({ text }: { text: string }) {
  // Keep the quote marks from the copy; the second sentence takes the accent colour.
  const inner = text.replace(/^"|"$/g, '')
  const [a, b] = splitFirstSentence(inner)
  return (
    <blockquote>
      <Txt>{`"${a}`}</Txt> <span className="accent"><Txt>{`${b}"`}</Txt></span>
    </blockquote>
  )
}

export default function TeamPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-simple center">
        <div className="wrap">
          <Eyebrow>{c.hero.eyebrow}</Eyebrow>
          <h1 className="reveal d1">
            <Txt>{c.hero.headline}</Txt>
          </h1>
          <p className="sub reveal d2">
            <Txt>{c.hero.subheading}</Txt>
          </p>
        </div>
      </section>

      {/* Team members: rendered from a list so more APE-trained practitioners can be added later */}
      <section className="section" style={{ paddingTop: 'clamp(40px,5vw,72px)' }} aria-label="Team">
        <div className="wrap team-list">
          {c.members.map((m) => (
            <article key={m.slug} className="member" id={m.slug}>
              <div className="member-photo reveal">
                <Frame image={m.photo} className="arch portrait" sizes="(max-width: 900px) 100vw, 40vw" />
              </div>
              <div>
                <h2 className="reveal">
                  <Txt>{m.name}</Txt>
                </h2>
                <p className="role reveal d1">
                  <Txt>{m.role}</Txt>
                </p>
                {/* Blank lines in the bio start a new paragraph. */}
                {m.bio.split(/\n\s*\n/).map((para, i) => (
                  <p key={i} className="bio reveal d1">
                    <Txt>{para}</Txt>
                  </p>
                ))}
                {m.quote && (
                  <div className="reveal d2">
                    <Quote text={m.quote} />
                  </div>
                )}
                {m.button && (
                  <div className="actions reveal d2">
                    <Button link={m.button} variant="ghost" />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <ReadyPanel eyebrow={c.closing.eyebrow} heading={c.closing.heading} buttons={[c.closing.button]} />
    </>
  )
}
