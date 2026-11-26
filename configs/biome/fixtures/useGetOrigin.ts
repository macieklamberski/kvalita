import { parseUrl } from 'trousse'

declare const link: string
const origin = parseUrl(link)?.origin // flag
const based = parseUrl(link, 'https://example.com')?.origin
const path = parseUrl(link)?.pathname
