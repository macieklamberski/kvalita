declare const date: Date
declare const value: unknown
const isValid = !Number.isNaN(date.getTime()) // flag
const isInvalid = Number.isNaN(date.getTime()) // flag
const isDate = value instanceof Date && !Number.isNaN(value.getTime()) // flag
const isNotNumber = Number.isNaN(Number(value))
const time = date.getTime()
