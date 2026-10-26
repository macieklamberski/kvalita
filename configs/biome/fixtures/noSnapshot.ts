declare const expect: (value: unknown) => {
  toMatchSnapshot: () => void
  toMatchInlineSnapshot: (value?: string) => void
  toEqual: (value: unknown) => void
}
expect({ id: 1 }).toMatchSnapshot() // flag
expect({ id: 1 }).toMatchInlineSnapshot('{ id: 1 }') // flag
expect({ id: 1 }).toEqual({ id: 1 })
