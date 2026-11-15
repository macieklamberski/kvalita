declare const href: string
declare const text: string | undefined
declare const uris: Array<string>
declare const isAnyOf: (value: string | undefined, patterns: string | Array<string>) => boolean
declare const getAnyOf: (value: string | undefined, patterns: Array<string>) => string | undefined
declare const includesAnyOf: (value: string | undefined, patterns: Array<string>) => boolean
declare const startsWithAnyOf: (value: string | undefined, patterns: string | Array<string>) => boolean
declare const endsWithAnyOf: (value: string | undefined, patterns: Array<string>) => boolean
const isIgnored = includesAnyOf(href.toLowerCase(), uris) // flag
const isFeed = endsWithAnyOf(href.toLowerCase(), uris) // flag
const isLabel = includesAnyOf(text?.toLowerCase(), uris) // flag
const isEmbed = isAnyOf(href.toLowerCase(), 'embed') // flag
const word = getAnyOf(text?.toLowerCase(), uris) // flag
const isPrefix = startsWithAnyOf(href.toLowerCase(), '/feed') // flag
const isRaw = includesAnyOf(href, uris)
const isTrimmed = isAnyOf(href.trim(), 'embed')
const isUpper = isAnyOf(href.toUpperCase(), 'EMBED')
