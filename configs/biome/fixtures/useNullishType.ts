type Nullish<T> = T | null | undefined // flag
type First = string | null | undefined // flag
type Second = Nullish<string>
type Third = string | undefined
type Fourth = string | null
type Fifth = Array<{ view: null }> | undefined
type Sixth = { name: string | null } | undefined
type Seventh = undefined | number | null // flag
