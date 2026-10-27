declare const values: Array<{ url: string }>
declare const findElement: (value: string, test: (name: string) => boolean) => string | undefined
declare const value: string
expect(findElement(value, (name) => name === 'img')).toBeUndefined() // flag
expect(values.map((item) => item.url)).toEqual([]) // flag
expect(values.filter(function (item) { return item.url })).toEqual([]) // flag
const result = findElement(value, (name) => name === 'img')
expect(result).toBeUndefined()
expect(findElement(value, isImage)).toBeUndefined()
declare const isImage: (name: string) => boolean
