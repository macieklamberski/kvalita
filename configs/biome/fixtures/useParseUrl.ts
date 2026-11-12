declare const value: string
declare const base: string
declare const lookup: (host: string) => Promise<void>
declare const report: () => void
const parsed = URL.parse(value) // flag
try { new URL(value) } catch {} // flag
try {
  void new URL(value) // flag
} catch {}
try {
  await lookup(new URL(value).hostname) // flag
  report()
} catch {}
const url = new URL(value) // flag
const based = new URL(value, base) // flag
const host = new URL(value).hostname // flag
const params = new URLSearchParams(value)
const valid = URL.canParse(value)
const pattern = new URLPattern({ pathname: value })
