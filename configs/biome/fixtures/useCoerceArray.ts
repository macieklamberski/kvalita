declare const value: string | Array<string>
declare const other: string
const values = Array.isArray(value) ? value : [value] // flag
const negated = !Array.isArray(value) ? [value] : value // flag
const first = Array.isArray(value) ? value[0] : value // flag
const negatedFirst = !Array.isArray(value) ? value : value[0] // flag
const typed = typeof value === 'string' ? [value] : value
const mixed = Array.isArray(value) ? value : [other]
const length = Array.isArray(value) ? value.length : 0
