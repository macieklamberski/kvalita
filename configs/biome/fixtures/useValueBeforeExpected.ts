it('should read', () => {
  const value = 'a'
  const expected = 'a'
  expect(read(value)).toBe(expected)
})
it('should read the other order', () => {
  const expected = 'b' // flag
  const value = 'b'
  expect(read(value)).toBe(expected)
})
