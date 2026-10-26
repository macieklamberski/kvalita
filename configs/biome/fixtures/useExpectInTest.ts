it('should read', () => {
  expect(read('a')).toBe('a')
})
it('should not throw', () => { // flag
  read('a')
})
it.todo('should read the date', () => {
  // A date in the RFC 822 form.
})
