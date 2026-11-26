declare const raw: string
declare const optional: string | undefined
declare const log: typeof console.error
let assigned: unknown
const read = () => {
  try { // flag
    return JSON.parse(raw)
  } catch {}
}
const readOr = () => {
  try { // flag
    return JSON.parse(`"${raw}"`)
  } catch {
    return raw
  }
}
const readTwice = () => {
  try {
    const parsed = JSON.parse(raw) // flag
    return parsed
  } catch {}
}
const readTyped = () => {
  try {
    const parsed: unknown = JSON.parse(raw) // flag
    return typeof parsed === 'object'
  } catch {
    return false
  }
}
const readMember = () => {
  try {
    return JSON.parse(raw)?.url // flag
  } catch {}
}
const readAssigned = () => {
  try {
    assigned = JSON.parse(raw) // flag
  } catch {
    return []
  }
}
const readOptional = () => JSON.parse(optional ?? '') // flag
const readOptionalTry = () => {
  try {
    return JSON.parse(optional ?? '').url // flag
  } catch {}
}
const readLogged = () => {
  try {
    const parsed = JSON.parse(raw)
    return parsed
  } catch (error) {
    log(error)
  }
}
const readLater = () => {
  try {
    const value = raw.trim()
    return JSON.parse(value)
  } catch {}
}
const readWrapped = () => {
  try {
    return String(JSON.parse(raw))
  } catch {}
}
const readDefault = () => JSON.parse(optional ?? '{}')
const readResolved = () => {
  try { // flag
    return Promise.resolve(JSON.parse(raw) as unknown)
  } catch {
    return Promise.resolve(undefined)
  }
}
const readRejected = () => {
  try {
    return Promise.resolve(JSON.parse(raw))
  } catch {
    return Promise.reject(undefined)
  }
}
