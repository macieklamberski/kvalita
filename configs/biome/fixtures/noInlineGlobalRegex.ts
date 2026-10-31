declare const value: string
const spaceRegex = /\s+/g
const collapsed = value.replace(/\s+/g, ' ') // flag
const swapped = value.replaceAll(/-/gi, '+') // flag
const numbers = [...value.matchAll(/\d+/g)] // flag
const found = value.match(/\d+/g) // flag
const parts = value.split(/,/y) // flag
const named = value.replace(spaceRegex, ' ')
const single = value.replace(/\s+/, ' ')
const literal = value.replaceAll('-', '+')
declare const maybeValue: string | undefined
const maybeCollapsed = maybeValue?.replace(/\s+/g, ' ') // flag
const maybeParts = maybeValue?.split(/,/g) // flag
const maybeSingle = maybeValue?.replace(/\s+/, ' ')
