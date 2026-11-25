declare const link: string
declare const id: string
const watch = `https://example.com/watch?v=${id}` // flag
const paged = `https://example.com/feed?format=rss&page[number]=${id}` // flag
const seek = `https://example.com/video#t=${id}` // flag
const numbered = `https://example.com/feed?1x=${id}` // flag
const query = `${link}?${new URLSearchParams({ v: id })}` // flag
const text = new URLSearchParams({ v: id }).toString() // flag
const path = `https://example.com/user/${id}`
const fixed = `https://example.com/feed?format=rss`
const label = `count=${id}`
const params = new URLSearchParams({ v: id })
declare const cursor: string | undefined
const readWatch = () => {
  const watchQuery = new URLSearchParams({ v: id }) // flag
  return `${link}?${watchQuery}`
}
const readPage = () => {
  const pageQuery = new URLSearchParams({ v: id }) // flag
  if (cursor) {
    pageQuery.set('cursor', cursor)
  }
  return `${link}?${pageQuery}`
}
const readAppended = () => {
  const appendedQuery = new URLSearchParams({ v: id })
  appendedQuery.append('v', link)
  return `${link}?${appendedQuery}`
}
const readSent = () => {
  const sentQuery = new URLSearchParams({ v: id })
  fetch(link, { body: sentQuery })
  return `${link}?${sentQuery}`
}
const readPath = () => {
  const pathQuery = new URLSearchParams({ v: id })
  return `${link}/${pathQuery}`
}
const readEmpty = () => {
  const emptyQuery = new URLSearchParams()
  return `${link}?${emptyQuery}`
}
