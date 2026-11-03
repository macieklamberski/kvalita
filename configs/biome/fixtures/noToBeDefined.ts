declare const expect: (value: unknown) => { toBeDefined: () => void; not: { toBeDefined: () => void } }
declare const screen: { getByText: (text: string) => unknown }
declare const result: unknown
expect(result).toBeDefined() // flag
expect(result).not.toBeDefined() // flag
expect(screen.getByText('Title')).toBeDefined()
