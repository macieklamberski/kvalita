declare const seed: (row: object) => void
const value = { width: 640, height: 360 } // flag
const single = { width: 640 }
const stacked = {
  width: 640,
  height: 360,
}
seed({ userId: 1, aliasId: 2 })
export { single, stacked, value }
