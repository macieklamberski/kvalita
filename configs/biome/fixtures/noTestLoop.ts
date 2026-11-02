declare const urls: Array<string>
declare const parse: (value: string) => string
for (const url of urls) { // flag
  it(`should parse ${url}`, () => {
    expect(parse(url)).toBe(url)
  })
}
for (let index = 0; index < urls.length; index++) { // flag
  describe(urls[index], () => {
    it('should parse', () => {
      expect(parse(urls[index])).toBe(urls[index])
    })
  })
}
it.each(urls)('should parse %s', (url) => {
  expect(parse(url)).toBe(url)
})
it('should parse every url', () => {
  for (const url of urls) {
    expect(parse(url)).toBe(url)
  }
})
