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
