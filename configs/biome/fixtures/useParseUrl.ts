declare const value: string
declare const lookup: (host: string) => Promise<void>
declare const report: () => void
const parsed = URL.parse(value) // flag
try { new URL(value) } catch {} // flag
try { // flag
  void new URL(value)
} catch {}
try {
  await lookup(new URL(value).hostname)
  report()
} catch {}
const url = new URL(value)
