declare const value: string
const binary = atob(value) // flag
const urlBinary = atob(value.replaceAll('-', '+').replaceAll('_', '/')) // flag
const global = globalThis.atob(value) // flag
const text = Buffer.from(value, 'base64').toString('utf8') // flag
const urlText = Buffer.from(value, 'base64url').toString() // flag
const bytes = Buffer.from(value, 'base64')
const encoded = btoa(value)
const hex = Buffer.from(value, 'hex').toString()
