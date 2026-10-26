describe('read', () => {
  it('should read', () => {
    expect(read('a')).toBe('a')
  })
})
it('should stand alone', () => { // flag
  expect(read('a')).toBe('a')
})
it.todo('should read the date') // flag
it.each([['a']])('should read %s', (value) => { // flag
  expect(value).toBe('a')
})
