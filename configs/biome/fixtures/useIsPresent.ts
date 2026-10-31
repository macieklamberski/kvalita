declare const value: string | null | undefined
declare const other: string | null | undefined
const isLoose = value != null // flag
const isLooseNullish = value == null // flag
const isLooseUndefined = value != undefined // flag
const isLooseUndefinedNullish = value == undefined // flag
const isReversed = null != value // flag
const isReversedNullish = null == value // flag
const isStrict = value !== null && value !== undefined // flag
const isStrictSwapped = value !== undefined && value !== null // flag
const isStrictNullish = value === null || value === undefined // flag
const isStrictNullishSwapped = value === undefined || value === null // flag
const isDefined = value !== undefined
const isNull = value === null
const isMixed = value !== null && other !== undefined
const isMixedNullish = value === null || other === undefined
