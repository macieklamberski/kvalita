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
