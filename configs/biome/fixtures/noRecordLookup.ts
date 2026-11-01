type Role = 'href' | 'src'
const heights: Record<string, number> = {
  track: 150,
}
const widths: Readonly<Record<string, number>> = { track: 300 }
const sentinels: Readonly<Record<Role, string>> = { href: '#', src: '' }
const modes = { e: 'episode', s: 'show' }
const sizes = { small: 1 } as const
const names = ['a', 'b']
const readHeight = (kind: string) => heights[kind] // flag
const readWidth = (kind: string) => widths[kind.toLowerCase()] // flag
const readMode = (kind: string) => modes[kind as keyof typeof modes] // flag
const readSentinel = (role: Role) => sentinels[role]
const readOwnMode = (kind: keyof typeof modes) => modes[kind]
const readSize = (size: 'small') => sizes[size]
const readName = (index: number) => names[index]
const track = heights['track']
const first = heights[0]
const selector = 'heights[kind]'
const buildQuery = (key: string) => {
  const query: Record<string, string> = {}
  query[key] = key

  return query
}
const readLocal = (key: string) => {
  const local: Record<string, string> = { a: 'b' }

  return local[key]
}

export {
  buildQuery,
  first,
  readHeight,
  readLocal,
  readMode,
  readName,
  readOwnMode,
  readSentinel,
  readSize,
  readWidth,
  selector,
  track,
}
