type Nullish<T> = T | null | undefined // flag
type First = string | null | undefined // flag
type Second = Nullish<string>
type Third = string | undefined
type Fourth = string | null
type Fifth = Array<{ view: null }> | undefined
type Sixth = { name: string | null } | undefined
type Seventh = undefined | number | null // flag
type Eighth = { title?: string | null } // flag
type Ninth = { title: string | null }
type Tenth = { titles?: Array<string | null> }
type Eleventh = { title?: Nullish<string> }
interface Twelfth {
  title?: string | null // flag
}
const read = (cursor?: string | null) => cursor // flag
const readDefault = (cursor: string | null = null) => cursor
const readRequired = (cursor: string | null) => cursor
