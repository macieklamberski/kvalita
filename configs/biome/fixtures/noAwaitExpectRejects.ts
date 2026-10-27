declare const expect: (value: unknown) => {
  rejects: {
    toThrow: (value?: string) => Promise<void>
    toBeInstanceOf: (value: unknown) => Promise<void>
  }
  toBe: (value: unknown) => void
}
declare const throwing: () => Promise<never>
declare const fetchMock: { calls: Array<unknown> }
declare const browser: { close: () => Promise<void> }
const last = async () => {
  await expect(throwing()).rejects.toThrow('down') // flag
}
const lastOfSeveral = async () => {
  await expect(throwing()).rejects.toThrow('down')
  await expect(throwing()).rejects.toThrow() // flag
}
const callCount = async () => {
  await expect(throwing()).rejects.toThrow('down')
  expect(fetchMock.calls.length).toBe(3)
}
const cleanup = async () => {
  try {
    await expect(throwing()).rejects.toThrow('down')
  } finally {
    await browser.close()
  }
}
const nested = async () => {
  if (fetchMock.calls) {
    await expect(throwing()).rejects.toBeInstanceOf(Error)
  }
  expect(fetchMock.calls.length).toBe(3)
}
const settled = () => {
  expect(throwing()).rejects.toThrow('down')
  expect(throwing()).rejects.toBeInstanceOf(Error)
}
