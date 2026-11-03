declare const run: () => void
declare class RateLimitError extends Error {}
declare const data: { message: string }
try {
  run()
} catch (error) {
  if (error instanceof Error && error.message === 'HTTP 429') { // flag
    run()
  }
}
try {
  run()
} catch (error) {
  if (error instanceof RateLimitError) {
    run()
  }
}
if (data.message === 'heightChanged') {
  run()
}
