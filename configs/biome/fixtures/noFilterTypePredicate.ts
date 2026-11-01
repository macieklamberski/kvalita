declare const items: Array<string | undefined>
declare const isPresent: (value: string | undefined) => value is string
const present = items.filter((item): item is string => item !== undefined) // flag
const named = items.filter(isPresent)
const truthy = items.filter((item) => item)
declare const maybeItems: Array<string | undefined> | undefined
const maybePresent = maybeItems?.filter((item): item is string => item !== undefined) // flag
const maybeNamed = maybeItems?.filter(isPresent)
export { named, present, truthy }
