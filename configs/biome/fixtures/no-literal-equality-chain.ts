declare const tag: string
declare const parsed: { kind: 'a' | 'b' | 'c' }
const isWrapped = tag === 'body' || tag === 'figure' // flag
const isNarrow = parsed.kind === 'a' || parsed.kind === 'b'
