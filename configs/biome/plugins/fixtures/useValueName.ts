declare const parse: (value: string) => string
const input = 'https://example.com/feed.xml' // flag
const data = parse(input) // flag
const value = 'https://example.com/feed.xml'
const expected = parse(value)
export { data, expected, value }
