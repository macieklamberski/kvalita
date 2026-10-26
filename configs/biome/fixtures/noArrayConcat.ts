const first = [1]
const second = [2]
const merged = [...first, ...second]
const joined = first.concat(second) // flag
const text = 'a'.concat('b') // flag
const bytes = Buffer.concat([])
export { bytes, joined, merged, text }
