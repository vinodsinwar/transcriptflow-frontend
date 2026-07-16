// Post-build prerender: renders each page's React tree to static HTML and
// injects it into the built dist/*.html files so crawlers (and first paint)
// get real content without executing JavaScript. Clients hydrate on load.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ssrEntry = resolve(root, 'dist-ssr/entry-server.js')

if (!existsSync(ssrEntry)) {
  console.error('prerender: dist-ssr/entry-server.js not found — run the SSR build first')
  process.exit(1)
}

const { render, pageFiles } = await import(ssrEntry)

let failures = 0
for (const pageFile of pageFiles) {
  const target = resolve(root, 'dist', pageFile)
  if (!existsSync(target)) {
    console.error(`prerender: missing ${target}`)
    failures++
    continue
  }
  const html = readFileSync(target, 'utf8')
  const marker = '<div id="root"></div>'
  if (!html.includes(marker)) {
    console.error(`prerender: no empty #root marker in ${pageFile} (already prerendered?)`)
    failures++
    continue
  }
  const rendered = render(pageFile)
  writeFileSync(target, html.replace(marker, `<div id="root">${rendered}</div>`))
  console.log(`prerender: ${pageFile} ✓ (${(rendered.length / 1024).toFixed(1)} kB of HTML)`)
}

process.exit(failures ? 1 : 0)
