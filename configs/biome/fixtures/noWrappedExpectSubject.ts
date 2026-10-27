declare const transformContent: (value: string, options: object) => Promise<string>
declare const parseHtml: (value: string) => unknown
declare const isObject: (value: unknown) => boolean
declare const value: string
declare const expected: string
declare const result: string
declare const aliases: Array<string>
declare const fn: () => void
expect( // flag
  await transformContent('<p>Body</p>', {
    parseHtmlFn: parseHtml,
    baseUrl: 'https://example.com/post',
  }),
).toEqual(expected)
expect( // flag
  isObject(
    'https://mastodon.social/users/Gargron/statuses/116535232552529093/activity/with/a/long/path',
  ),
).toBe(false)
expect( // flag
  isObject('https://mastodon.social/users/Gargron/statuses/116535232552529093/activity/x'),
).toBe(false)
expect(isObject(() => {})).toBe(false)
expect(await transformContent(value, { parseHtmlFn: parseHtml })).toEqual(expected)
expect({
  result,
  aliases,
}).toEqual({ result, aliases })
expect(() =>
  fn(),
).toThrow()
