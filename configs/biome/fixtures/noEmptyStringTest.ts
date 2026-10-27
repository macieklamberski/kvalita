declare const lines: Array<string>
declare const value: string
declare const parsed: { search: string } | undefined
const kept = lines.filter((line) => line.trim() !== '') // flag
const isEmpty = value === '' // flag
const present = lines.filter((line) => line.trim())
const hasSearch = parsed?.search !== ''
export { kept, isEmpty, present, hasSearch }
