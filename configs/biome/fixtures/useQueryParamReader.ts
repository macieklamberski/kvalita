declare const url: URL
declare const link: URL
declare const query: string
declare const key: string
declare const map: Map<string, string>
const id = url.searchParams.get('v') // flag
const fromQuery = new URLSearchParams(query).get('v') // flag
const ids = url.searchParams.getAll('v') // flag
const fromQueryIds = new URLSearchParams(query).getAll('v') // flag
const hasId = url.searchParams.has('v') // flag
const hasQueryId = new URLSearchParams(query).has('v') // flag
const time = new URLSearchParams(url.hash.slice(1)).get('t') // flag
const times = new URLSearchParams(url.hash.slice(1)).getAll('t') // flag
const hasTime = new URLSearchParams(location.hash.slice(1)).has('t') // flag
const params = new URLSearchParams(query)
const named = params.get('v') // flag
const search = url.searchParams
const namedIds = search.getAll('v') // flag
const { searchParams: linkParams } = link
const namedHas = linkParams.has('v') // flag
const dynamic = params.get(key)
const cached = map.get('v')
declare const maybeUrl: URL | undefined
const maybeId = maybeUrl?.searchParams.get('v') // flag
const maybeIds = maybeUrl?.searchParams.getAll('v') // flag
const maybeHasId = maybeUrl?.searchParams.has('v') // flag
const maybeTime = new URLSearchParams(maybeUrl?.hash.slice(1)).get('t') // flag
declare const maybeParams: URLSearchParams | undefined
const maybeNamed = maybeParams?.get('v')
const maybeSearch = maybeUrl?.searchParams
const maybeSearched = maybeSearch?.get('v') // flag
const maybeDynamic = maybeSearch?.get(key)
