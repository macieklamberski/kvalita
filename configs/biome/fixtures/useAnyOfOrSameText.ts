declare const name: string | undefined
declare const route: string
declare const key: string
declare const element: { tagName: string }
const isKey = name?.toLowerCase() === key // flag
const isNotKey = route.toLowerCase() !== key // flag
const isReversed = key === route.toLowerCase() // flag
const isReversedOptional = key !== name?.toLowerCase() // flag
const isLiteral = route.toLowerCase() === 'embed'
const isSame = route.toLowerCase() === key.toLowerCase()
const isTag = element.tagName.toLowerCase() === key
const isUndefined = name?.toLowerCase() === undefined
const isRaw = route === key
const isFolded = route.toLowerCase() !== route
const isFoldedReversed = route !== route.toLowerCase()
const isUpperKey = route.toUpperCase() === key // flag
const isUpperOptional = key !== name?.toUpperCase() // flag
const isUpperFolded = route.toUpperCase() !== route
declare const options: { key: string }
declare const kind: string | undefined
const isOption = route.toLowerCase() === options.key // flag
const isLocale = route.toLocaleLowerCase() === key // flag
const isTrimmedLiteral = route.toLowerCase().trim() === 'embed' // flag
const isTrimmedKey = key !== kind?.toUpperCase().trim() // flag
const isTrimmedSelf = route.toLowerCase().trim() === route
const isLocaleArg = route.toLocaleLowerCase('tr') === key
const isSameLocale = route.localeCompare(key, undefined, { sensitivity: 'base' }) === 0 // flag
const isAccent = route.localeCompare(key, 'en', { sensitivity: 'accent' }) !== 0 // flag
const isVariant = route.localeCompare(key, undefined, { sensitivity: 'variant' }) === 0
const isOrdered = route.localeCompare(key) === 0
