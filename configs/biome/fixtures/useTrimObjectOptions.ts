import { isNonEmptyString, trimObject } from 'trousse'

declare const value: Record<string, unknown>
declare const keep: (value: unknown) => boolean
const truthy = trimObject(value, Boolean) // flag
const filled = trimObject(value, isNonEmptyString) // flag
const custom = trimObject(value, keep) // flag
const inline = trimObject(value, (field) => field !== 0) // flag
const plain = trimObject(value)
const options = trimObject(value, { keep: Boolean })
const blank = trimObject(value, { blank: true })
