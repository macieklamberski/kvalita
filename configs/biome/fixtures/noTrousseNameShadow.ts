declare const value: string
const decodeBase64 = (input: string) => atob(input) // flag
function parseUrl(input: string) { // flag
  return input
}
const check = () => {
  const isIpAddress = value.includes('.') // flag
  return isIpAddress
}
export const guess = () => {
  const isHttpUrl = value.length > 4 // flag
  return isHttpUrl
}
export const normalizeUrl = (input: string) => input
export function isHostOf(input: string) {
  return input
}
const t = (key: string) => key
const decoded = decodeBase64(value)
const parsedUrl = parseUrl(value)
