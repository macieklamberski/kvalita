it('should read', () => {
  expect(isEmpty('')).toBe(true)
  expect(isEmpty('a')).toBeTruthy() // flag
  expect(isEmpty('a')).not.toBeFalsy() // flag
})
