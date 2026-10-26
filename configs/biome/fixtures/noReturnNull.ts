const readName = (value: string): string | null => {
  if (!value) {
    return null // flag
  }

  return value
}
const readTitle = (value: string): string | undefined => {
  if (!value) {
    return
  }

  return value
}
export { readName, readTitle }
