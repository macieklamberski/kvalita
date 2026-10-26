it('should read', async () => {
  expect(await load()).toBe(1)
  await expect(load()).resolves.toBe(1) // flag
})
