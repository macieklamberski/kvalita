declare const type: string
declare const url: string
declare const title: string
declare const prefix: string
declare const kind: string | undefined
declare const words: Array<string>
declare const runtime: Array<string>
const prefixes = ['http', 'feed']
const wordSet = new Set(['rss', 'atom'])
const hasXml = type.toLowerCase().indexOf('xml') !== -1 // flag
const lacksXml = type.toLowerCase().indexOf('xml') === -1 // flag
const hasAtom = kind?.toLowerCase().indexOf('atom') >= 0 // flag
const isHttp = url.toLowerCase().indexOf('http') === 0 // flag
const isPrefixed = prefixes.some((pattern) => url.toLowerCase().startsWith(pattern)) // flag
const isSuffixed = ['.xml', '.rss'].some((pattern) => url.toUpperCase().endsWith(pattern)) // flag
const hasWord = title.toLowerCase().split(/\s+/).some((word) => words.includes(word)) // flag
const hasSetWord = title.toLowerCase().split(/\s+/).some((word) => wordSet.has(word)) // flag
const hasRuntime = type.toLowerCase().indexOf(prefix) !== -1
const isRuntimeList = runtime.some((pattern) => url.toLowerCase().startsWith(pattern))
const hasComma = title.toLowerCase().split(',').some((word) => words.includes(word))
const position = type.toLowerCase().indexOf('xml')
const markers = ['rss+xml', 'atom+xml']
const casedMarkers = ['RSS+xml']
declare const link: { type?: string }
const readType = () => {
  const folded = link.type?.trim().toLowerCase()
  const isFeed = folded && markers.some((marker) => folded.includes(marker)) // flag
  const isLiteral = folded && ['rss', 'atom'].some((marker) => folded.endsWith(marker)) // flag
  const isCased = folded && casedMarkers.some((marker) => folded.includes(marker))
  const isEmpty = folded && ['', 'rss'].some((marker) => folded.includes(marker))
  const isRuntime = folded && runtime.some((marker) => folded.includes(marker))
  return [isFeed, isLiteral, isCased, isEmpty, isRuntime]
}
const readRaw = () => {
  const unfolded = link.type?.trim()
  return unfolded && markers.some((marker) => unfolded.includes(marker))
}
