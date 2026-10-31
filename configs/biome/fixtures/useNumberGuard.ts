declare const value: unknown
declare const isNumber: (value: unknown) => value is number
const a = isNumber(value) && Number.isInteger(value) // flag
const b = typeof value === 'number' && Number.isInteger(value) // flag
const c = isNumber(value) && Number.isFinite(value) // flag
const d = Number.isInteger(value)
const e = isNumber(value) && value > 0
