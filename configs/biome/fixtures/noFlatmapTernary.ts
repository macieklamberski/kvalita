declare const items: Array<{ status: string; method: string; tagId?: string; href?: string }>
const doubled = items.flatMap((item) => (item.status === 'ok' ? [item.method] : [])) // flag
const block = items.flatMap((item) => { // flag
  return item.status === 'start' ? [item.method] : []
})
const narrowed = items.flatMap((item) => (item.tagId ? [item.tagId] : []))
const narrowedObject = items.flatMap((item) => {
  return item?.href ? [{ url: item.href }] : []
})
const inserted = items.flatMap((item) => (item.status === 'ok' ? [item, item] : [item]))
const twoStatements = items.flatMap((item) => {
  const next = item.method
  return next ? [next] : []
})
export { doubled, block, narrowed, narrowedObject, inserted, twoStatements }
