declare const it: { each: <T>(table: Array<T>) => (title: string, callback: (...args: Array<T>) => void) => void }
declare const values: Array<string>
it.each(values)('should parse %s', (value: string) => {}) // flag
it.each(values)('should parse %s', (value) => {})
