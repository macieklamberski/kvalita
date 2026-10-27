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
declare const wrap: (value: unknown, items: Array<unknown>) => unknown
const outer = pages.map(
  (page) => wrap(page, [
    (item: unknown) => // flag
      make({
        page,
        registry: item,
      }),
  ]),
)
export { block, call, data, outer, spread, wrapped }
