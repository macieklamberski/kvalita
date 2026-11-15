declare const route: string
declare const url: string
declare const path: string
declare const type: string
const embedRegex = /^embed$/i
const feedRegex = /\.xml$/i
const digitsRegex = /^\d+$/i
const isEmbed = /^embed$/i.test(route) // flag
const isNamed = embedRegex.test(route) // flag
const isHttp = /^http/i.test(url) // flag
const isFeed = /\.xml$/i.test(path) // flag
const isNamedFeed = feedRegex.test(path) // flag
const hasXml = /xml/i.test(type) // flag
const isHyphen = /^podcast-clips$/i.test(route) // flag
const isUnicode = /^embed$/iu.test(route) // flag
const isCased = /^embed$/.test(route)
const isDigits = digitsRegex.test(route)
const isClass = /^[a-z]+$/i.test(route)
const isAlternation = /^(embed|watch)$/i.test(route)
const isWildcard = /^e.bed$/i.test(route)
const isOptional = /^embeds?$/i.test(route)
const colorsPathRegex = /\/themes\/colors$/i
const isColors = colorsPathRegex.test(path)
const rootPath = path.replace(colorsPathRegex, '')
const htmlExtensionRegex = /\.html$/i
const isHtml = htmlExtensionRegex.test(path)
const parts = path.split(htmlExtensionRegex)
