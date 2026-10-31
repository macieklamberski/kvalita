declare const value: string
const decoded = decodeURIComponent(value) // flag
const path = decodeURI(value)
const legacy = unescape(value)
