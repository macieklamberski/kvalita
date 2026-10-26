declare const expect: (value: unknown) => {
  not: { toHaveProperty: (key: string) => void }
  toHaveProperty: (key: string) => void
}
expect({ id: 1 }).not.toHaveProperty('url') // flag
expect({ id: 1 }).toHaveProperty('id')
