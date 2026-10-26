type MaybePromise<T> = T | Promise<T> // flag
type First = string | Promise<string> // flag
type Second = Promise<string> | string // flag
type Third = Array<string> | Promise<Array<string>> // flag
type Fourth = number | string | Promise<string> // flag
type Fifth = string | undefined | Promise<string | undefined> // flag
type Sixth = (url: string) => Response | Promise<Response> // flag
type Seventh = MaybePromise<string>
type Eighth = Promise<string> | number
type Ninth = Promise<string>
type Tenth = string | Array<string>
type Eleventh = string | Promise<number>
type Twelfth = string | Promise<string | undefined>
type Thirteenth = Array<string> | Promise<Array<number>>
