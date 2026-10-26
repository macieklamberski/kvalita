const cases = [['a'], ['b']]
it.each(cases)('should read %s', (value) => {
  expect(value).toBeDefined()
})
it.each(cases)('should read each value', (value) => { // flag
  expect(value).toBeDefined()
})
it.each(cases)('should read 100%%', (value) => { // flag
  expect(value).toBeDefined()
})
