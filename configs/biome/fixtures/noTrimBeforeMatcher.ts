declare const format: string
declare const name: string | undefined
declare const other: string
declare const extensions: Array<string>
declare const isAnyOf: (value: string | undefined, patterns: string | Array<string>) => boolean
declare const getAnyOf: (value: string | undefined, patterns: Array<string>) => string | undefined
declare const isSameText: (value: string | undefined, other: string | undefined) => boolean
declare const includesAnyOf: (value: string | undefined, patterns: Array<string>) => boolean
const isRaster = isAnyOf(format.trim(), extensions) // flag
const entry = getAnyOf(name?.trim(), extensions) // flag
const isSame = isSameText(format, other.trim()) // flag
const isSameReversed = isSameText(name?.trim(), other) // flag
const isTrimmedPattern = isAnyOf(format, other.trim()) // flag
const isRaw = isAnyOf(format, extensions)
const isIncluded = includesAnyOf(format.trim(), extensions)
