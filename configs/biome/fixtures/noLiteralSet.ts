declare const runtimeTags: Array<string>
const wrapperTags = new Set(['div', 'p', 'center']) // flag
const statuses = new Set([200, 301]) // flag
const seen = new Set<string>()
const tags = ['div', 'p', 'center']
const merged = new Set([...tags, 'span'])
const spellings = new Set(['div', runtimeTags[0]])
const copied = new Set(runtimeTags)
const empty = new Set([])
export { wrapperTags, statuses, seen, tags, merged, spellings, copied, empty }
