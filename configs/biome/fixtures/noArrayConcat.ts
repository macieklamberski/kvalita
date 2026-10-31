const first = [1]
const second = [2]
const merged = [...first, ...second]
const joined = first.concat(second) // flag
const text = 'a'.concat('b') // flag
const bytes = Buffer.concat([])
declare const maybeFirst: Array<number> | undefined
const maybeJoined = maybeFirst?.concat(second) // flag
export { bytes, joined, merged, text }
