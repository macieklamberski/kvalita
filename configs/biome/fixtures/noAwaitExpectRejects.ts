declare const expect: (value: unknown) => {
  rejects: {
    toThrow: (value?: string) => Promise<void>
    toBeInstanceOf: (value: unknown) => Promise<void>
  }
}
declare const throwing: () => Promise<never>
const awaited = async () => {
  await expect(throwing()).rejects.toThrow('down') // flag
  await expect(throwing()).rejects.toThrow() // flag
  await expect(throwing()).rejects.toBeInstanceOf(Error) // flag
}
const settled = () => {
  expect(throwing()).rejects.toThrow('down')
  expect(throwing()).rejects.toBeInstanceOf(Error)
}
