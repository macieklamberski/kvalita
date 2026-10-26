declare const read: () => unknown
expect(read()).toBe({ title: 'Feed' }) // flag
expect(read()).toBe(['Feed']) // flag
expect(read()).toEqual({ title: 'Feed' })
expect(read()).toBe('Feed')
