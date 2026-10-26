declare const base: string
declare const build: (value: string) => string
const expected = `${base}/feed` // flag
const expectedUrl = build('feed') // flag
const expectedCount = 2 + 1 // flag
const expectedPlain = 'https://example.com/feed'
const expectedBlock = `
  <p>one</p>
`
const value = build('feed')
export { expected, expectedBlock, expectedCount, expectedPlain, expectedUrl, value }
