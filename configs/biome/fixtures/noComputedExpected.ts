declare const base: string
declare const build: (value: string) => string
declare const glyphs: Array<string>
const expected = `${base}/feed` // flag
const expectedUrl = build('feed') // flag
const expectedCount = 2 + 1 // flag
const expectedPlain = 'https://example.com/feed'
const expectedBlock = `
  <p>one</p>
`
const expectedMatch = expect.objectContaining({ url: 'https://example.com/feed' })
const expectedJson = JSON.stringify({ link: '/post/1' })
const expectedJsonFromValue = JSON.stringify({ link: base }) // flag
const value = build('feed')
it.each(glyphs)('should wrap %s', (glyph) => {
  const expectedRow = `<p>${glyph}</p>`

  expect(build(glyph)).toBe(expectedRow)
})
export { expected, expectedBlock, expectedCount, expectedJson, expectedJsonFromValue, expectedMatch, expectedPlain, expectedUrl, value }
