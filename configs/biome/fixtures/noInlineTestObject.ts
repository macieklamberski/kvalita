declare const seed: (row: object) => void
declare const first: unknown
declare const second: unknown
const value = { width: 640, height: 360 } // flag
const single = { width: 640 }
const list = { unwrappers: [first, second] }
const stacked = {
  width: 640,
  height: 360,
}
seed({ userId: 1, aliasId: 2 })
export { list, single, stacked, value }
