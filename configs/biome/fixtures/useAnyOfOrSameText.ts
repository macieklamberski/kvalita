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
