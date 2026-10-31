declare const isAnyOf: (value: string | undefined, patterns: string | Array<string>) => boolean
declare const startsWithAnyOf: (
  value: string | undefined,
  patterns: string | Array<string>,
) => boolean
declare const type: string | undefined
declare const list: Array<string>
declare const element: { getAttribute: (name: string) => string | null }
const isListed = isAnyOf(type ?? '', list) // flag
const isPrefixed = startsWithAnyOf(type ?? "", 'a') // flag
const isFallback = isAnyOf(type ?? 'x', list)
const isBare = isAnyOf(type, list)
const isAttribute = isAnyOf(element.getAttribute('type') ?? '', list)
declare const maybeElement: { getAttribute: (name: string) => string | null } | undefined
const isMaybeAttribute = isAnyOf(maybeElement?.getAttribute('type') ?? '', list)
