declare const value: string
declare const base: string
const url = new URL(value) // flag
const based = new URL(value, base) // flag
const host = new URL(value).hostname // flag
try {
  void new URL(value) // flag
} catch {}
const parsed = URL.parse(value)
const params = new URLSearchParams(value)
const valid = URL.canParse(value)
const pattern = new URLPattern({ pathname: value })
