import { isAnyOf } from 'trousse'

declare const url: URL
declare const link: URL
declare const hosts: Array<string>
const isHost = url.hostname === 'example.com' // flag
const isOther = url.hostname !== 'example.com' // flag
const isReversed = 'example.com' === url.host // flag
const isSame = url.hostname === link.hostname // flag
const isListed = hosts.includes(url.hostname) // flag
const isLocal = url.host === location.host
const isDomain = url.hostname === 'example.com' || url.hostname.endsWith('.example.com')
const isPath = url.pathname === '/feed'
const isForeign = url.hostname !== 'example.com' && !url.hostname.endsWith('.example.com')
declare const maybeUrl: URL | undefined
declare const maybeHosts: Array<string> | undefined
const isMaybeHost = maybeUrl?.hostname === 'example.com' // flag
const isMaybeReversed = 'example.com' !== maybeUrl?.host // flag
const isMaybeListed = hosts.includes(maybeUrl?.hostname) // flag
const isHostListed = maybeHosts?.includes(url.hostname) // flag
const isMaybeLocal = maybeUrl?.host === location.host
const isMaybeDomain = maybeUrl?.hostname === 'example.com' || maybeUrl?.hostname.endsWith('.example.com')
const isMaybePath = maybeUrl?.pathname === '/feed'
declare const hostname: string
declare const label: Set<string>
const fixedHosts = new Set(['example.com', 'example.org'])
const runtimeHosts = new Set<string>()
const hostRegex = /(?:^|\.)example\.com$/

const isRegexHost = /^example\.com$/i.test(url.hostname) // flag
const isNamedRegexHost = hostRegex.test(url.hostname) // flag
const isMaybeRegexHost = hostRegex.test(maybeUrl?.hostname) // flag
const isAnyHost = isAnyOf(url.hostname, hosts) // flag
const isMaybeAnyHost = isAnyOf(maybeUrl?.hostname, hostRegex) // flag
const isSetHost = fixedHosts.has(url.hostname) // flag
const isMaybeSetHost = fixedHosts.has(maybeUrl?.hostname) // flag
const isBareRegexHost = hostRegex.test(hostname)
const isPortRegexHost = hostRegex.test(url.host)
const isLocalRegexHost = hostRegex.test(location.hostname)
const isRuntimeSetHost = runtimeHosts.has(url.hostname)
const isParamSetHost = label.has(url.hostname)
const isAnyPath = isAnyOf(url.pathname, '/feed')
