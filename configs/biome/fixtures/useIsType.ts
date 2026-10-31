declare const value: unknown
declare const type: string
const isText = typeof value === 'string' // flag
const isNotNumber = typeof value !== 'number' // flag
const isFlag = 'boolean' === typeof value // flag
const isNotCallable = 'function' !== typeof value // flag
const isCallable = typeof value === 'function' // flag
const isTemplate = typeof value === `string` // flag
const isObject = typeof value === 'object'
const isUndefined = typeof value === 'undefined'
const isSymbol = typeof value === 'symbol'
const isDynamic = typeof value === type
