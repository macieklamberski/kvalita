declare const url: URL
declare const link: URL
declare const raw: string
declare const suffixes: Array<string>
const isDomain = url.hostname === 'example.com' || url.hostname.endsWith('.example.com') // flag
const isForeign = url.host !== 'example.com' && !url.host.endsWith('.example.com') // flag
const isSubdomain = url.hostname.endsWith('.example.com') // flag
const { hostname } = link
const isNamed = hostname === 'example.com' || hostname.endsWith('.example.com') // flag
const linkHost = link.host
const isAliased = linkHost === 'example.com' || linkHost.endsWith('.example.com') // flag
const host = raw.match(/\/\/([^/]+)/)?.[1] ?? ''
const isCut = host === 'example.com' || host.endsWith('.example.com')
const isFound = suffixes.find((suffix) => url.hostname.endsWith(suffix))
const isRooted = url.hostname.endsWith('.')
const isField = raw === 'id' || raw.endsWith('Id')
