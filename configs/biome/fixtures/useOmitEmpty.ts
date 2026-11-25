type Check = (value: unknown) => boolean
declare const isPresent: Check
declare const items: Array<string | undefined>
declare const numbers: Array<number>
const isEmpty = items.every((item) => !item) // flag
const filled = items.filter((item) => item !== '') // flag
const present = items.filter((item) => isPresent(item) && item !== '') // flag
const defined = items.filter((item) => item !== undefined && item !== '') // flag
const loose = items.filter((item) => item != null && item !== '') // flag
const truthy = items.filter(Boolean)
const isFull = items.every((item) => item)
const positive = numbers.filter((number) => number !== 0)
const isZero = numbers.every((number) => number === 0)
