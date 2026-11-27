declare const map: Map<string, number>
declare const uris: Array<string>
declare const includesAnyOf: (value: string | undefined, patterns: Array<string>) => boolean
declare const endsWithAnyOf: (value: string | undefined, patterns: Array<string>) => boolean
const readPage = (script: string) => {
  const page = script.toLowerCase() // flag
  if (page === 'opac-search') {
    return 1
  }
  return 'opac-shelves' !== page ? 2 : 3
}
const readKind = (kind: string | undefined) => {
  const folded = kind?.toUpperCase() // flag
  return folded === 'VIDEO'
}
const readKey = (key: string) => {
  const name = key.toLowerCase()
  if (name === 'ts') {
    return 0
  }
  return map.get(name)
}
const readExplicit = (value: string) => {
  const explicit = value.toLowerCase()
  if (explicit === 'clean') {
    return explicit
  }
}
const readHost = (hostname: string) => {
  return hostname === 'localhost'
}
const readTrimmed = (script: string) => {
  const trimmed = script.trim()
  return trimmed === 'opac-search'
}
const readHref = (href: string) => {
  const lowerHref = href.toLowerCase() // flag
  if (includesAnyOf(lowerHref, uris)) {
    return ''
  }
  return endsWithAnyOf(lowerHref, uris)
}
const readText = (text: string) => {
  const anchorText = text.toLowerCase().trim() // flag
  return includesAnyOf(anchorText, uris)
}
const readStored = (href: string) => {
  const lowerHref = href.toLowerCase()
  return includesAnyOf(lowerHref, uris) ? lowerHref : ''
}
declare const routes: Array<string>
const words = new Set(['embed', 'watch'])
const readListed = (route: string) => {
  const folded = route.toLowerCase() // flag
  return routes.includes(folded) || words.has(folded)
}
const readAffix = (url: string) => {
  const lower = url.toLocaleLowerCase() // flag
  return lower.startsWith('http') && !lower.endsWith('.xml')
}
const readRuntimeAffix = (url: string, prefix: string) => {
  const lower = url.toLowerCase()
  return lower.startsWith(prefix)
}
const readTag = (element: { tagName: string }) => {
  const tag = element.tagName.toLowerCase()
  return routes.includes(tag)
}
declare const isLooseMatch: (value: string | undefined, other: string | undefined) => boolean
const readLoose = (title: string, other: string) => {
  const folded = title.toLowerCase() // flag

  return isLooseMatch(folded, other)
}
