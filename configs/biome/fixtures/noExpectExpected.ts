declare const expect: (value: unknown) => { toEqual: (value: unknown) => void }
declare const result: unknown
declare const expected: unknown
expect(expected).toEqual(result) // flag
expect(result).toEqual(expected)
