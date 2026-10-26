declare const read: () => unknown
expect(read()).toEqual('Feed') // flag
expect(read()).toEqual(3) // flag
expect(read()).toStrictEqual(true) // flag
expect(read()).toBe('Feed')
expect(read()).toEqual({ title: 'Feed' })
