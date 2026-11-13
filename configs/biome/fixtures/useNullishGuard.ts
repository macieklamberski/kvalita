declare const value: unknown
declare const other: unknown
const isMissing = value == null // flag
const isSet = value != null // flag
const isEither = value === null || value === undefined // flag
const isEitherSwapped = value === undefined || value === null // flag
const isBoth = value !== null && value !== undefined // flag
const isBothSwapped = value !== undefined && value !== null // flag
const patch = { ...(value != null && { value }) } // flag
const isNull = value === null
const isUndefined = value === undefined
const isNotNull = value !== null
const isMixed = value === null || other === undefined
