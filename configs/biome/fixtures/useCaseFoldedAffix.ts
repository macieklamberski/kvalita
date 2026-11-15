declare const path: string
declare const type: string
declare const url: string | undefined
declare const input: string
const prefix = 'audio/'
const isXml = path.toLowerCase().endsWith('.xml') // flag
const isImage = type.toLowerCase().startsWith('image/') // flag
const isJson = type.toLowerCase().includes('json') // flag
const isAudio = url?.toLowerCase().startsWith('audio/') // flag
const isFeed = url?.toLowerCase().endsWith('/feed') // flag
const hasPath = !url?.toLowerCase().includes('/x/') // flag
const isTemplate = path.toLowerCase().startsWith(`${type}/`) // flag
const isFolded = path.toLowerCase().includes(`${type}/x`.toLowerCase()) // flag
const isPrefixed = path.toLowerCase().startsWith(prefix) // flag
const isRaw = path.endsWith('.xml')
const parts = path.toLowerCase().split('/')
const hasInput = path.toLowerCase().includes(input.toLowerCase())
const isInput = path.toLowerCase().startsWith(input)
const isUpperXml = path.toUpperCase().endsWith('.XML') // flag
const isLocaleImage = type.toLocaleLowerCase().startsWith('image/') // flag
const isOptionalLocale = url?.toLocaleUpperCase().includes('HTTP') // flag
const isFoldedLiteral = path.toUpperCase().endsWith('.xml'.toUpperCase()) // flag
const isUpperInput = path.toUpperCase().startsWith(input)
