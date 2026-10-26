declare const items: Array<number>
const doubled = items.flatMap((item) => (item > 0 ? [item, item] : [])) // flag
const kept = items.flatMap((item) => [item, item])
const mapped = items.map((item) => (item > 0 ? item : 0))
export { doubled, kept, mapped }
