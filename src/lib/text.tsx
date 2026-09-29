import { Fragment, type ReactNode } from 'react'
import { SITE_CONFIG } from '@/site.config'

/** Straight quotes to typographic quotes. Wording is untouched. */
export function typeset(input: string): string {
  if (!SITE_CONFIG.typography.smartQuotes) return input
  return input
    .replace(/(\w)'(\w)/g, '$1’$2')
    .replace(/(^|[\s(\[])'/g, '$1‘')
    .replace(/'/g, '’')
    .replace(/(^|[\s(\[])"/g, '$1“')
    .replace(/"/g, '”')
}

/** True when a value is still a client placeholder such as [Phone]. */
export function isPlaceholder(value: string): boolean {
  return /\[[^\]]+\]/.test(value)
}

/**
 * Renders copy exactly as supplied, typeset, with any [square bracket] placeholder
 * wrapped in a highlighted mark so it is impossible to miss on staging.
 */
export function Txt({ children }: { children: string }): ReactNode {
  const text = typeset(children)
  const parts = text.split(/(\[[^\]]+\])/g)
  return (
    <>
      {parts.map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <mark key={i} className="placeholder" title="Placeholder: waiting on the client">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

/** Plain string version for attributes (alt, aria-label, meta). */
export function plain(text: string): string {
  return typeset(text)
}

/** Resolves a content href. "talkToAlex" is a named link held in site settings. */
export function resolveHref(href: string): string {
  if (href === 'talkToAlex') return SITE_CONFIG.contact.talkToAlexHref
  return href
}

/** Splits "First sentence. Second sentence." into [first, rest] for two-tone lines. */
export function splitFirstSentence(text: string): [string, string] {
  const m = text.match(/^(.+?[.!?])\s+(.+)$/)
  return m ? [m[1], m[2]] : [text, '']
}
