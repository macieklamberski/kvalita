declare const first: string | undefined
declare const second: string | undefined
declare const read: (value: string) => string
const chained = (first ? read(first) : undefined) ?? read('x') // flag
const bare = first ? read(first) : undefined ?? second
const plain = first ?? second
export { bare, chained, plain }
