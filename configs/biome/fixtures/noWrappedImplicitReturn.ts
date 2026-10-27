declare const pages: Array<{ data: Array<number> }>
declare const resolve: (value: unknown, registry: unknown) => unknown
declare const make: (value: { page: unknown; registry: unknown }) => unknown
declare const registry: unknown
const data = pages.flatMap((page) => page.data)
const wrapped = pages.map((page) =>
  resolve(page, registry),
)
const spread = pages.map((page) => // flag
  make({
    page,
    registry,
  }),
)
const block = pages.map((page) => {
  return resolve(page, registry)
})
const call = pages.map((page) => resolve(
  page,
  registry,
))
export { block, call, data, spread, wrapped }
