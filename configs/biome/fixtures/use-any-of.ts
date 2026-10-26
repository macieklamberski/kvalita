declare const route: string
declare const element: { tagName: string }
declare const routes: Array<string>
declare const text: string
declare const isAnyOf: (value: string, patterns: string | Array<string>) => boolean
const isEmbed = route.toLowerCase() === 'embed' // flag
const isNotShare = route.toLowerCase() !== 'share' // flag
const isReversed = 'embed' === route.toLowerCase() // flag
const isUpper = route.toUpperCase() === 'EMBED' // flag
const isListed = routes.includes(route.toLowerCase()) // flag
const isInline = ['embed', 'share'].includes(route.toLowerCase()) // flag
const isImage = element.tagName.toLowerCase() === 'img'
const isSame = route.toLowerCase() === text.toLowerCase()
const isMatched = isAnyOf(route, 'embed')
const hasWord = text.includes(route)
