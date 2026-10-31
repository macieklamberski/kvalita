declare const raw: string
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
    const parsed = JSON.parse(raw)
    return parsed
  } catch {}
}
