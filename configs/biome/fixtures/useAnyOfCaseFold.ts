declare const route: string
declare const kind: string | undefined
declare const text: string
declare const list: Array<string>
declare const element: { tagName: string }
declare const map: Map<string, number>
const set = new Set(['embed', 'watch'])
const built = new Set(list.map((item) => item))
const hasLiteral = set.has(route.toLowerCase()) // flag
const hasOptional = set.has(kind?.toLowerCase()) // flag
const isVideo = kind?.toLowerCase() === 'video' // flag
const isNotVideo = kind?.toLowerCase() !== 'video' // flag
const isReversed = 'video' === kind?.toLowerCase() // flag
const isNotReversed = 'video' !== kind?.toLowerCase() // flag
const isSome = list.some((item) => item === route.toLowerCase()) // flag
const isAlternation = /^(embed|watch)$/i.test(route) // flag
const isGroup = /^(?:embed|watch)$/i.test(route) // flag
const hasRaw = set.has(route)
const hasMap = map.has(route.toLowerCase())
const hasBuilt = built.has(route.toLowerCase())
const hasTag = set.has(element.tagName.toLowerCase())
const isTag = element?.tagName?.toLowerCase() === 'img'
const isKey = kind?.toLowerCase() === text
const isSame = kind?.toLowerCase() === text.toLowerCase()
const isPlain = route.toLowerCase() === 'embed'
const isDigits = /^embed\d+$/i.test(route)
const isCased = /^(embed|watch)$/.test(route)
const isWildcard = /^(e.bed|watch)$/i.test(route)
const isPlural = /^(embeds?|watch)$/i.test(route)
