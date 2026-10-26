type Nullish<T> = T | null | undefined // flag
type First = string | null | undefined // flag
type Second = Nullish<string>
type Third = string | undefined
type Fourth = string | null
