declare const url: URL
declare const protocol: string
declare const link: string
declare const maybeLink: string | undefined
const isWeb = url.protocol === 'http:' || url.protocol === 'https:' // flag
const isSecureFirst = url.protocol === 'https:' || url.protocol === 'http:' // flag
const isNotWeb = url.protocol !== 'http:' && url.protocol !== 'https:' // flag
const isNotSecureFirst = protocol !== 'https:' && protocol !== 'http:' // flag
const isListed = ['http:', 'https:'].includes(url.protocol) // flag
const isPrefixed = url.protocol.startsWith('http') // flag
const isLink = link.startsWith('http') // flag
const isSecureLink = link.startsWith('https') // flag
const isMaybeLink = maybeLink?.startsWith('http') // flag
const isPlain = url.protocol === 'http:'
const isSecure = url.protocol === 'https:'
const isMail = ['ftp:', 'mailto:'].includes(url.protocol)
const isSecureScheme = link.startsWith('https://')
const isLocal = link.startsWith('http://localhost:')
declare const maybeUrl: URL | undefined
const isMaybeWeb = maybeUrl?.protocol === 'http:' || maybeUrl?.protocol === 'https:' // flag
const isMaybeNotWeb = maybeUrl?.protocol !== 'https:' && maybeUrl?.protocol !== 'http:' // flag
const isMaybeListed = ['http:', 'https:'].includes(maybeUrl?.protocol) // flag
const isMaybePlain = maybeUrl?.protocol === 'http:'
