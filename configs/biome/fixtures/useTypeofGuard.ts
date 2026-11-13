declare const value: unknown
declare const record: { get?: unknown }
const isText = typeof value === 'string' // flag
const isNotText = typeof value !== 'string' // flag
const isCount = typeof value === 'number' // flag
const isFlag = typeof value === 'boolean' // flag
const isNotFlag = typeof value !== 'boolean' // flag
const isCallable = typeof record.get === 'function' // flag
const isNotCallable = typeof value !== 'function' // flag
const label = typeof value === 'string' ? value : '' // flag
const isObjectLike = typeof value === 'object'
const isMissing = typeof value === 'undefined'
const isBig = typeof value === 'bigint'
const kind = typeof value
