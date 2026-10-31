import { setTimeout as wait } from 'node:timers/promises'

declare const delay: number
declare const done: () => void
await new Promise((resolve) => setTimeout(resolve, delay)) // flag
await new Promise((resolve) => { // flag
  setTimeout(resolve, delay)
})
await new Promise((resolve) => setTimeout(() => resolve(), delay)) // flag
await new Promise((resolve) => { // flag
  setTimeout(() => resolve(), delay)
})
await new Promise<void>((resolve) => setTimeout(resolve, delay)) // flag
await new Promise<void>((resolve) => { // flag
  setTimeout(resolve, delay)
})
await new Promise<void>((resolve) => setTimeout(() => resolve(), delay)) // flag
await new Promise<void>((resolve) => { // flag
  setTimeout(() => resolve(), delay)
})
await Bun.sleep(delay) // flag
await new Promise((resolve) => setTimeout(() => resolve(1), delay))
await new Promise((resolve) => setTimeout(done, delay))
await wait(delay)
