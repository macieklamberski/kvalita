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
