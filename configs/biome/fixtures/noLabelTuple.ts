declare const cases: Array<[string, string, string]>
declare const values: Array<[string, string]>
declare const parse: (value: string) => string
it.each(cases)('should parse %s', (_name, value, expected) => { // flag
  expect(parse(value)).toBe(expected)
})
it.each(values)('should parse %s', (value, expected) => {
  expect(parse(value)).toBe(expected)
})
