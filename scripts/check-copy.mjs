// Copy parity check: every published line in docs/approved-copy.md must appear on the matching page.
// Usage: npm run build && npm start, then: node scripts/check-copy.mjs [baseUrl]
// Lines that only render inside the booking flow or behind a feature flag are looked up in the
// content files instead and reported as such.
import { readFileSync, readdirSync } from 'node:fs'

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/+$/, '')
const md = readFileSync(new URL('../docs/approved-copy.md', import.meta.url), 'utf8')
const contentRaw = readdirSync(new URL('../src/content/pages/', import.meta.url))
  .map((f) => readFileSync(new URL(`../src/content/pages/${f}`, import.meta.url), 'utf8'))
  .join('\n')

const PAGES = {
  'Page 1: Home': '/',
  'Page 2: Understanding the Experience': '/understanding-the-experience/',
  'Page 3: Meet the Team': '/meet-the-team/',
  'Page 4: Book Now': '/book-now/',
  'Page 5: FAQs': '/faqs/',
  'Global elements': '/',
}
const SKIP_H3 = new Set(['Future scalability (not built now)'])
const SPLIT = new Set(['Buttons', 'Links', 'Navigation', 'Contact'])

const norm = (s) =>
  s
    .replace(/\\([\\'"$\[\]|*_])/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')

// ---- parse the doc into { page: { meta: {title, description}, lines: [] } }
const doc = {}
let page = null
let skip = false
for (const raw of md.split('\n')) {
  const line = raw.trimEnd()
  const h2 = line.match(/^## (.+)$/)
  if (h2) { page = PAGES[h2[1]] ? h2[1] : null; skip = false; if (page) doc[page] = { meta: {}, lines: [] }; continue }
  if (!page) continue
  const h3 = line.match(/^### (.+)$/)
  if (h3) { skip = SKIP_H3.has(h3[1]); continue }
  if (skip || !line.trim() || /^\s*-{3,}/.test(line)) continue
  const label = line.match(/^\*\*(.+?):\*\*\s*(.*)$/)
  if (label) {
    const [, name, value] = label
    if (name === 'Dev note' || !value) continue
    if (name === 'Meta title') { doc[page].meta.title = norm(value); continue }
    if (name === 'Meta description') { doc[page].meta.description = norm(value); continue }
    const vals = SPLIT.has(name) ? value.split(/\s+\\\|\s+/) : [value]
    vals.forEach((v) => doc[page].lines.push(norm(v)))
    continue
  }
  const bold = line.match(/^\*\*(.+)\*\*$/)
  if (bold) { doc[page].lines.push(norm(bold[1])); continue }
  const item = line.match(/^\s*(?:-|\d+\.)\s+(.+)$/)
  if (item) { doc[page].lines.push(norm(item[1])); continue }
  const row = line.match(/^ {2}(\S.*?)\s{2,}(\S.*)$/)
  if (row) { if (row[1] !== 'Card') { doc[page].lines.push(norm(row[1]), norm(row[2])) } continue }
  doc[page].lines.push(norm(line))
}

// A "Lead: text" policy line is stored as separate lead and text fields.
const splitInContent = (l, content) => {
  const i = l.indexOf(': ')
  return i > 0 && content.includes(l.slice(0, i + 1)) && content.includes(l.slice(i + 2))
}

// ---- compare
let missing = 0
for (const [name, spec] of Object.entries(doc)) {
  const path = PAGES[name]
  const html = await (await fetch(BASE + path)).text()
  const body = norm(decode(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')))
  const title = norm(decode((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || ''))
  const desc = norm(decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || ''))
  const content = norm(contentRaw.replace(/\\"/g, '"'))
  const results = []
  if (spec.meta.title) results.push([title === spec.meta.title ? 'ok' : 'MISSING', `meta title: ${spec.meta.title}`])
  if (spec.meta.description) results.push([desc === spec.meta.description ? 'ok' : 'MISSING', `meta description`])
  for (const l of spec.lines) {
    if (body.includes(l)) results.push(['ok', l])
    else if (content.includes(l) || splitInContent(l, content)) results.push(['flow/flag', l])
    else results.push(['MISSING', l])
  }
  const bad = results.filter((r) => r[0] === 'MISSING')
  const flow = results.filter((r) => r[0] === 'flow/flag')
  missing += bad.length
  console.log(`\n${name} (${path}): ${results.length - bad.length}/${results.length} found` + (flow.length ? `, ${flow.length} only in booking flow or behind a flag` : ''))
  for (const [s, l] of [...bad, ...flow]) console.log(`  ${s.padEnd(9)} ${l}`)
}
console.log(missing ? `\n${missing} line(s) missing` : '\nAll approved copy present.')
process.exit(missing ? 1 : 0)
