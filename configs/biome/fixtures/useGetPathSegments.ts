declare const url: URL
declare const path: string
const segments = url.pathname.split('/').filter(Boolean) // flag
const parts = url.pathname.split('/')
const last = url.pathname.split('/').at(-1)
const pieces = path.split('/').filter(Boolean)
