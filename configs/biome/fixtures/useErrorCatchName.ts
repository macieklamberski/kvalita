declare const run: () => void
declare const report: (value: unknown) => void
try {
  run()
} catch (e) { // flag
  report(e)
}
try {
  run()
} catch (error) {
  report(error)
}
try {
  run()
} catch {}
