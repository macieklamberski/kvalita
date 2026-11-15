declare const keys: Array<string>
declare const maybeKeys: Array<string> | undefined
declare const name: string
declare const kind: string | undefined
declare const elements: Array<{ tagName: string }>
const both = keys.find((key) => key.toLowerCase() === name.toLowerCase()) // flag
const oneSided = keys.find((key) => key === name.toLowerCase()) // flag
const reversed = keys.find((key) => kind?.toUpperCase() === key) // flag
const optional = maybeKeys?.find((key) => key.toLowerCase() === name.toLowerCase()) // flag
const block = keys.find((key) => { // flag
  return key.toLowerCase() === name.toLowerCase()
})
const locale = keys.find((key) => key.toLocaleLowerCase() === name.toLocaleLowerCase()) // flag
const raw = keys.find((key) => key === name)
const prefixed = keys.find((key) => key.toLowerCase().startsWith(name.toLowerCase()))
const filtered = keys.filter((key) => key.toLowerCase() === name.toLowerCase())
