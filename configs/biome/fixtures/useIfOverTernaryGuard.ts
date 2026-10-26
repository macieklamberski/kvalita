export const read = (id: string | undefined) => {
  return id ? { id } : undefined // flag
}
export const label = (id: string | undefined) => {
  return id ? 'known' : 'unknown'
}
export const pick = (id: string | undefined) => {
  const value = id ? 1 : undefined
  return value
}
