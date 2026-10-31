declare const value: string
const specialRegex = /[.*+?^${}()|[\]\\]/g
const globRegex = /[.+?^${}()|[\]\\]/g
const quoteRegex = /['"\\]/g
const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // flag
const escapedAll = value.replaceAll(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') // flag
const escapedNative = RegExp.escape(value) // flag
const escapedConst = value.replace(specialRegex, '\\$&') // flag
const glob = value.replace(globRegex, '\\$&').replaceAll('*', '.*')
const quoted = value.replace(quoteRegex, '\\$&')
const marked = value.replace(/a/g, '$&!')
const replaced = value.replace(/a/g, 'b')
declare const maybeValue: string | undefined
const maybeEscaped = maybeValue?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // flag
const maybeEscapedAll = maybeValue?.replaceAll(specialRegex, '\\$&') // flag
const maybeQuoted = maybeValue?.replace(quoteRegex, '\\$&')
