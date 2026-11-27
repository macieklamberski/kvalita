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
const readPresent = (values: Array<string | undefined>) => {
  const present = values.filter(isPresent) // flag

  if (present.length === 0) {
    return
  }

  return present
}
const readTruthy = (values: Array<number>) => {
  const truthy = values.filter(Boolean) // flag

  return truthy.length > 0 ? truthy : undefined
}
const readDefined = (values: Array<string | undefined>) => {
  const defined = values.filter((value) => value !== undefined) // flag

  if (!defined.length) {
    return
  }

  return defined
}
const readCounted = (values: Array<string | undefined>) => {
  const present = values.filter(isPresent)

  if (present.length === 0) {
    return 0
  }

  return present.length
}
const readEven = (values: Array<number>) => {
  const even = values.filter((value) => value % 2 === 0)

  return even.length > 0 ? even : undefined
}
