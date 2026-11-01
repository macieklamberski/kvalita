declare const url: URL | undefined
declare const link: string | undefined
declare const pathRegex: RegExp
declare const isHostOf: (url: string | URL, hosts: string) => boolean
declare const isHttpUrl: (url: string | URL) => boolean
const isFeed = url !== undefined && isHostOf(url, 'example.com') && pathRegex.test(url.pathname) // flag
const isOff = url === undefined || !isHostOf(url, 'example.com') // flag
const isWeb = link !== undefined && isHttpUrl(link) // flag
const isTruthy = url && isHostOf(url, 'example.com')
const isGuarded = !url || !isHostOf(url, 'example.com')
const isOther = url !== undefined && pathRegex.test(url.pathname)
