declare const isAnyOf: (
  value: string,
  patterns: string | Array<string>,
  parser?: (value: string) => string,
) => boolean
declare const startsWithAnyOf: (value: string, patterns: string | Array<string>) => boolean
declare const isHostOrSubdomainOf: (value: URL, patterns: string | Array<string>) => boolean
declare const getAnyOf: (value: string, patterns: Array<string>) => string | undefined
declare const name: string
declare const url: URL
declare const list: Array<string>
declare const parser: (value: string) => string
const isSingle = isAnyOf(name, ['a']) // flag
const isTemplate = startsWithAnyOf(name, [`${name}/`]) // flag
const isHost = isHostOrSubdomainOf(url, ['anchor.fm']) // flag
const isParsed = isAnyOf(name, ['a'], parser) // flag
const isPair = isAnyOf(name, ['a', 'b'])
const isSpread = isAnyOf(name, [...list])
const isBare = isAnyOf(name, 'a')
const isParsedPair = isAnyOf(name, ['a', 'b'], parser)
const found = getAnyOf(name, ['a'])
