declare const readPostUrl: (value: string) => string
declare const parseUrl: (value: string, hosts: Array<string>) => string
declare const attr: (element: Element, name: string) => string
declare const text: (element: Element) => string
declare const find: (element: Element, selector: string) => Element
declare const composeQuery: (value: string) => string
declare const buildCite: (value: { url: string }) => string
declare const expect: (value: unknown) => { toBe: (value: unknown) => void }
declare const anchor: Element
declare const element: Element
declare const hosts: Array<string>
declare const items: Array<Element>
const post = readPostUrl(parseUrl(attr(anchor, 'href'), hosts)) // flag
const fragment = composeQuery(attr(anchor, 'href')).replace('?', '#') // flag
const names = items.map((item) => readPostUrl(parseUrl(attr(item, 'href'), hosts))) // flag
const title = text(find(element, 'h3'))
const query = composeQuery(post).replace('?', '#')
const cite = buildCite({ url: attr(find(element, 'a'), 'href') })
const texts = items.map((item) => text(find(item, 'h3')))
expect(readPostUrl(parseUrl(post, hosts))).toBe(post)
