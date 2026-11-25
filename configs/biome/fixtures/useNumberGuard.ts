declare const value: unknown
declare const isNumber: (value: unknown) => value is number
const a = isNumber(value) && Number.isInteger(value) // flag
const b = typeof value === 'number' && Number.isInteger(value) // flag
const c = isNumber(value) && Number.isFinite(value) // flag
const d = Number.isInteger(value)
const e = isNumber(value) && value > 0
declare const maybe: number | undefined
declare const isPresent: typeof isNumber
const f = maybe !== undefined && Number.isFinite(maybe) // flag
const g = maybe != null && Number.isFinite(maybe) // flag
const h = isPresent(maybe) && Number.isFinite(maybe) // flag
const i = maybe !== undefined && Number.isInteger(maybe)
const j = maybe !== undefined && maybe > 0
