// Fails if an em dash or en dash appears anywhere in source, content, docs or the rendered pages.
// Usage: node scripts/check-dashes.mjs [baseUrl]
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const BAD = new RegExp('[' + String.fromCharCode(0x2013) + String.fromCharCode(0x2014) + ']')
const hits = []
function walk(dir) {
  for (const f of readdirSync(dir)) {
    if (['node_modules', '.next', '.git', 'fonts', 'images'].includes(f)) continue
    const p = join(dir, f)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(tsx?|mjs|js|json|css|md|txt|svg)$/.test(f) && f !== 'package-lock.json') {
      readFileSync(p, 'utf8').split('\n').forEach((l, i) => BAD.test(l) && hits.push(`${p.replace(ROOT, '')}:${i + 1}`))
    }
  }
}
walk(ROOT)
const base = process.argv[2]
if (base) {
  for (const path of ['/', '/understanding-the-experience/', '/meet-the-team/', '/book-now/', '/faqs/', '/privacy-policy/']) {
    const html = await (await fetch(base.replace(/\/+$/, '') + path)).text()
    if (BAD.test(html)) hits.push(`rendered ${path}`)
  }
}
console.log(hits.length ? `Dashes found:\n${hits.join('\n')}` : 'No em or en dashes.')
process.exit(hits.length ? 1 : 0)
