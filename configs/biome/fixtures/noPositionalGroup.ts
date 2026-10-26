declare const path: string
declare const pathRegex: RegExp
const match = pathRegex.exec(path)
const id = match?.[1] // flag
const slug = path.match(pathRegex)?.[2] // flag
const [, first] = pathRegex.exec(path) ?? [] // flag
const named = match?.groups?.id
const segment = path.split('/')[1]
export { first, id, named, segment, slug }
