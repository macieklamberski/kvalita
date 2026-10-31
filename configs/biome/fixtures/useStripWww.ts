declare const hostname: string
const bare = hostname.replace(/^www\./, '') // flag
const folded = hostname.replace(/^www\./i, '') // flag
const optional = hostname.replace(/^(?:www\.)?/, '') // flag
const grouped = hostname.replace(/^(www\.)/, '') // flag
const unanchored = hostname.replace(/www\./, '')
const mobile = hostname.replace(/^www\./, 'm.')
const other = hostname.replace(/^m\./, '')
declare const maybeHostname: string | undefined
const maybeBare = maybeHostname?.replace(/^www\./, '') // flag
const maybeMobile = maybeHostname?.replace(/^www\./, 'm.')
