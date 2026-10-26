declare const lines: Array<string>
declare const value: string
const kept = lines.filter((line) => line.trim() !== '') // flag
const isEmpty = value === '' // flag
const present = lines.filter((line) => line.trim())
export { kept, isEmpty, present }
