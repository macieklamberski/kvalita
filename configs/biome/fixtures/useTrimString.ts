declare const value: string
declare const optional: string | undefined
declare const items: { title?: string }
const title = value.trim() || undefined // flag
const optionalTitle = optional?.trim() || undefined // flag
const nested = items.title?.trim() || undefined // flag
const fallback = value.trim() || 'Untitled'
const nullable = value.trim() || null
const untrimmed = value || undefined
const readTitle = (raw: string) => {
  const trimmed = raw.trim()

  return trimmed || undefined // flag
}
const readOptional = (raw?: string) => {
  const trimmed = raw?.trim()

  return trimmed || undefined // flag
}
const readLower = (raw: string) => {
  const lower = raw.toLowerCase()

  return lower || undefined
}
const readOther = (raw: string) => {
  const trimmed = raw.trim()
  const other = raw.slice(1)

  return other || undefined
}
const readGuarded = (raw: string) => {
  const trimmed = raw.trim() // flag

  if (!trimmed) {
    return
  }

  return trimmed.split(',')
}
const readOptionalGuarded = (raw?: string) => {
  const trimmed = raw?.trim() // flag

  if (!trimmed) {
    return
  }

  return trimmed.toUpperCase()
}
const readCompared = (raw: string) => {
  const trimmed = raw.trim() // flag

  if (trimmed === '') {
    return 'empty'
  }

  return trimmed
}
const readLength = (raw: string) => {
  const trimmed = raw.trim() // flag

  if (trimmed.length === 0) {
    return 0
  }

  return trimmed.length
}
const readCompound = (raw: string, key: string) => {
  const trimmed = raw.trim() // flag

  if (!key || !trimmed) {
    return
  }

  return `${key}=${trimmed}`
}
const readSplit = (raw: string) => {
  const trimmed = raw.trim()

  return trimmed.split(',')
}
const readPrefixed = (raw: string) => {
  const trimmed = raw.trim()

  if (!trimmed.startsWith('http')) {
    return
  }

  return trimmed
}
const readShort = (raw: string) => {
  const trimmed = raw.trim()

  if (trimmed.length < 3) {
    return
  }

  return trimmed
}
const readOtherGuard = (raw: string, other: string) => {
  const trimmed = raw.trim()

  if (!other) {
    return
  }

  return trimmed
}
const readPair = (rawKey: string, rawValue: string) => {
  const key = rawKey.trim() // flag
  const value = rawValue.trim() // flag

  if (!key || !value) {
    return
  }

  return `${key}=${value}`
}
