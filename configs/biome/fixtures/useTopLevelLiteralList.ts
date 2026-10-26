const routes = ['embed', 'watch']
const read = (value: string): boolean => {
  const kinds = ['video', 'audio'] // flag
  const known = routes.includes(value)
  return known || kinds.includes(value) || ['a', 'b'].includes(value)
}
export { read }
