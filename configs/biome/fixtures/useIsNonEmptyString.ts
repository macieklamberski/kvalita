declare const value: string
declare const optional: string | undefined
const isBlank = !value.trim() // flag
const isOptionalBlank = !optional?.trim() // flag
const hasText = !!value.trim() // flag
const hasOptionalText = !!optional?.trim() // flag
const isTruthy = Boolean(value.trim()) // flag
const isOptionalZero = optional?.trim().length === 0
const isZero = value.trim().length === 0 // flag
const isPositive = value.trim().length > 0 // flag
const trimmed = value.trim()
const isShort = value.trim().length < 3
const isOther = value.trim() === 'a'
const isUntrimmed = !value
declare const lines: Array<string>
declare const maybeLines: Array<string | undefined>
const filled = lines.filter((line) => line.trim()) // flag
const maybeFilled = maybeLines.filter((line) => line?.trim()) // flag
const trimmedLines = lines.map((line) => line.trim())
const otherFilled = lines.filter((line) => value.trim())
