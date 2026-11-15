declare const map: Map<string, number>
const readPage = (script: string) => {
  const page = script.toLowerCase() // flag
  if (page === 'opac-search') {
    return 1
  }
  return 'opac-shelves' !== page ? 2 : 3
}
const readKind = (kind: string | undefined) => {
  const folded = kind?.toUpperCase() // flag
  return folded === 'VIDEO'
}
const readKey = (key: string) => {
  const name = key.toLowerCase()
  if (name === 'ts') {
    return 0
  }
  return map.get(name)
}
const readExplicit = (value: string) => {
  const explicit = value.toLowerCase()
  if (explicit === 'clean') {
    return explicit
  }
}
const readHost = (hostname: string) => {
  return hostname === 'localhost'
}
const readTrimmed = (script: string) => {
  const trimmed = script.trim()
  return trimmed === 'opac-search'
}
