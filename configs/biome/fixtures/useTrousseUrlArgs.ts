declare const url: URL
declare const link: string | undefined
declare const query: string
declare const page: number
declare const getQueryParam: (source: unknown, name: string, options?: object) => string | undefined
declare const getQueryParamValues: (source: unknown, name: string) => Array<string>
declare const getFragmentParam: (source: unknown, name: string) => string | undefined
declare const parseUrl: (value: unknown, base?: string) => URL | undefined
declare const composeQuery: (params: Record<string, string | number>) => string
declare const isHostOf: (url: URL, hosts: string | Array<string>) => boolean
declare const getSubdomain: (url: URL, hosts: string | Array<string>) => string | undefined
declare const fixMalformedProtocol: (value: string) => string
declare const addMissingProtocol: (value: string) => string
const parsed = parseUrl(link ?? '') // flag
const based = parseUrl(link ?? '', 'https://example.com')
const id = getQueryParam(new URLSearchParams(query), 'v') // flag
const ids = getQueryParamValues(new URLSearchParams(query), 'v') // flag
const trimmed = getQueryParam(url, 'v')?.trim() // flag
const fragment = getFragmentParam(url, 't')?.trim() // flag
const untrimmed = getQueryParam(url, 'v', { trimValues: false })?.trim()
const fallback = getQueryParam(url, 'v') || undefined // flag
const kept = getQueryParam(url, 'v', { preserveEmptyValues: true }) || undefined
const hash = composeQuery({ t: '1' }).replace('?', '#') // flag
const isHost = isHostOf(url, ['example.com']) // flag
const label = getSubdomain(url, ['example.com']) // flag
const isEither = isHostOf(url, ['example.com', 'example.org'])
const paged = composeQuery({ page: String(page) }) // flag
const counted = composeQuery({ page: page.toString() }) // flag
const plain = composeQuery({ page })
const fixed = fixMalformedProtocol(query) // flag
const added = addMissingProtocol(query) // flag
const read = getQueryParam(url, 'v')
