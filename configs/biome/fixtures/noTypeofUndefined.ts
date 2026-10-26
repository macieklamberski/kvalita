declare const value: string | undefined
const isMissing = typeof value === 'undefined' // flag
const isPresent = typeof value !== 'undefined' // flag
const isUnset = value === undefined
const isString = typeof value === 'string'
export { isMissing, isPresent, isString, isUnset }
