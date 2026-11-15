declare const href: string
declare const text: string | undefined
declare const uris: Array<string>
declare const isAnyOf: (value: string | undefined, patterns: string | Array<string>) => boolean
declare const getAnyOf: (value: string | undefined, patterns: Array<string>) => string | undefined
declare const includesAnyOf: (value: string | undefined, patterns: Array<string>) => boolean
declare const startsWithAnyOf: (value: string | undefined, patterns: string | Array<string>) => boolean
declare const isSameText: (value: string | undefined, other: string | undefined) => boolean
declare const anyWordMatchesAnyOf: (value: string, patterns: Array<string>) => boolean
declare const endsWithAnyOf: (value: string | undefined, patterns: Array<string>) => boolean
const isIgnored = includesAnyOf(href.toLowerCase(), uris) // flag
const isFeed = endsWithAnyOf(href.toLowerCase(), uris) // flag
const isLabel = includesAnyOf(text?.toLowerCase(), uris) // flag
const isEmbed = isAnyOf(href.toLowerCase(), 'embed') // flag
const word = getAnyOf(text?.toLowerCase(), uris) // flag
const isPrefix = startsWithAnyOf(href.toLowerCase(), '/feed') // flag
const isRaw = includesAnyOf(href, uris)
const isTrimmed = isAnyOf(href.trim(), 'embed')
const isUpper = isAnyOf(href.toUpperCase(), 'EMBED') // flag
const isSame = isSameText(href, text?.toLowerCase()) // flag
const hasWord = anyWordMatchesAnyOf(href.toUpperCase(), uris) // flag
const isSameRaw = isSameText(href, text)
declare const prefix: string
const isLocaleValue = includesAnyOf(href.toLocaleLowerCase(), uris) // flag
const isFoldedPattern = startsWithAnyOf(href, prefix.toLowerCase()) // flag
const isFoldedEntry = endsWithAnyOf(href, ['.xml', prefix.toUpperCase()]) // flag
const isMapped = includesAnyOf(href, uris.map((uri) => uri.toLowerCase())) // flag
const isRawPattern = startsWithAnyOf(href, prefix)
const isTrimmedEntry = endsWithAnyOf(href, ['.xml', prefix.trim()])
const isMappedTrim = includesAnyOf(href, uris.map((uri) => uri.trim()))
declare const element: { tagName: string }
const isTag = isAnyOf(element.tagName.toLowerCase(), 'img')
