type Fields<T> = { [K in keyof T]: T[K] }
type Lookup = { key: string }
// Read a key in the value before the fallback.
const label = 'observed in feeds'
const hasKey = (key: string, value: object) => key in value // flag
const hasField = (lookup: Lookup, value: object) => !(lookup.key in value) // flag
const hasHref = (value: object) => 'href' in value
const hasOwnKey = (key: string, value: object) => Object.hasOwn(value, key)
const listKeys = (value: object) => {
  const keys: Array<string> = []

  for (const key in value) {
    keys.push(key)
  }

  return keys
}

class Token {
  #id = 1

  static isToken = (value: object) => #id in value
}

export type { Fields }
export { hasField, hasHref, hasKey, hasOwnKey, label, listKeys, Token }
