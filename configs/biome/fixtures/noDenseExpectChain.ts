declare const document: { querySelector: (selector: string) => { parentElement?: { tagName: string } } | null }
declare const feeds: { forUrl: (value: string) => { getFeedUrl: (key: string, params: object) => string, load: () => Promise<string> } | undefined }
declare const page: { getFeedUrl: (key: string, params: object) => string }
declare const build: (value: string) => (params: object) => string
declare const fn: (value: string) => Promise<Array<string>>
declare const load: (() => string) | undefined
declare const value: string
declare const params: object
expect(document.querySelector('path')?.parentElement?.tagName).toBe('svg') // flag
expect(document.querySelector('path')?.parentElement).toBeDefined() // flag
expect(feeds.forUrl(value)?.getFeedUrl('a:b', params)).toBe('a') // flag
expect(feeds.forUrl(value)!.getFeedUrl('a:b', params)).toBe('a') // flag
expect(build(value)(params)).toBe('a') // flag
expect(await feeds.forUrl(value)!.load()).toBe('a') // flag
expect((await fn(value))['at'](0)).toBe('a') // flag
expect(load?.()).toBe('a') // flag
const parent = document.querySelector('path')?.parentElement
expect(parent).toBeDefined()
expect(build(value)).toBeDefined()
expect(page.getFeedUrl('a:b', params)).toBe('a')
expect(await fn(value)).toEqual(['a'])
expect((await fn(value)).length).toBe(1)
expect({ page: feeds.forUrl(value)?.getFeedUrl('a:b', params) }).toEqual({ page: 'a' })
expect(() => feeds.forUrl(value)?.getFeedUrl('a:b', params)).toThrow()
expect(async () => await feeds.forUrl(value)!.load()).toThrow()
