declare const found: { params: Record<string, string> }
declare const tailName: 'tail'
const readParams = () => {
  const params = { ...found.params } // flag
  delete params[tailName]
  return params
}
const readValues = () => {
  const values = { ...found.params } // flag
  delete values.tail
  return values
}
const readExtended = () => {
  const extended = { ...found.params, page: '1' }
  delete extended.tail
  return extended
}
const readGuarded = () => {
  const guarded = { ...found.params }
  if (tailName) {
    delete guarded.tail
  }
  return guarded
}
const readKept = () => {
  const kept = { ...found.params }
  return kept
}
