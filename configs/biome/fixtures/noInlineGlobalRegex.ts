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
