type Parse = (value: string) => number
const parse: Parse = (value) => Number(value)
const inline: (value: string) => number = (value) => Number(value) // flag
let generic: <T>(value: T) => T = (value) => value // flag
const plain = (value: string): number => Number(value)
export { generic, inline, parse, plain }
