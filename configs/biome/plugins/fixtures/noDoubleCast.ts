declare const value: unknown
type Target = { id: string }
const first = value as unknown as Target // flag
const second = value as Target
