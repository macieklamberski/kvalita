declare const expect: (value: unknown) => { rejects: { toThrow: () => void } }
declare const fetchFeed: () => Promise<void>
expect(fetchFeed()).rejects.toThrow() // flag
const throwing = () => fetchFeed()
expect(throwing()).rejects.toThrow()
const throwing2 = () => fetchFeed()
expect(throwing2()).rejects.toThrow()
