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
