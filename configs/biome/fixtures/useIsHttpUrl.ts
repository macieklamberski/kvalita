declare const url: URL
declare const protocol: string
const isWeb = url.protocol === 'http:' || url.protocol === 'https:' // flag
const isSecureFirst = url.protocol === 'https:' || url.protocol === 'http:' // flag
const isNotWeb = url.protocol !== 'http:' && url.protocol !== 'https:' // flag
const isNotSecureFirst = protocol !== 'https:' && protocol !== 'http:' // flag
const isListed = ['http:', 'https:'].includes(url.protocol) // flag
const isPrefixed = url.protocol.startsWith('http') // flag
const isPlain = url.protocol === 'http:'
const isSecure = url.protocol === 'https:'
const isMail = ['ftp:', 'mailto:'].includes(url.protocol)
