declare const items: Array<string | undefined>
declare const isPresent: (value: string | undefined) => value is string
const present = items.filter((item): item is string => item !== undefined) // flag
const named = items.filter(isPresent)
const truthy = items.filter((item) => item)
export { named, present, truthy }
