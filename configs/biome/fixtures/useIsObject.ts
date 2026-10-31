declare const value: unknown
declare const other: unknown
const isRecord = typeof value === 'object' && value !== null && !Array.isArray(value) // flag
const isNullFirst = value !== null && typeof value === 'object' && !Array.isArray(value) // flag
const isNullLast = typeof value === 'object' && !Array.isArray(value) && value !== null // flag
const isCoerced = !!value && typeof value === 'object' && !Array.isArray(value) // flag
const isTruthy = value && typeof value === 'object' && !Array.isArray(value) // flag
const isCoercedMiddle = typeof value === 'object' && !!value && !Array.isArray(value) // flag
const isTruthyMiddle = typeof value === 'object' && value && !Array.isArray(value) // flag
const isNotRecord = typeof value !== 'object' || value === null || Array.isArray(value) // flag
const isNotNullFirst = value === null || typeof value !== 'object' || Array.isArray(value) // flag
const isNotFalsy = !value || typeof value !== 'object' || Array.isArray(value) // flag
const isObjectOrArray = typeof value === 'object' && value !== null
const isMixed = typeof value === 'object' && other !== null && !Array.isArray(value)
