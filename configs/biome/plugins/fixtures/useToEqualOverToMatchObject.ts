declare const expect: (value: unknown) => {
  toMatchObject: (value: object) => void
  toEqual: (value: unknown) => void
}
expect({ id: 1 }).toMatchObject({ id: 1 }) // flag
expect({ id: 1 }).toEqual({ id: 1 })
