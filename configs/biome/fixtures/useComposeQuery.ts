declare const link: string
declare const id: string
const watch = `https://example.com/watch?v=${id}` // flag
const paged = `https://example.com/feed?format=rss&page[number]=${id}` // flag
const seek = `https://example.com/video#t=${id}` // flag
const query = `${link}?${new URLSearchParams({ v: id })}` // flag
const text = new URLSearchParams({ v: id }).toString() // flag
const path = `https://example.com/user/${id}`
const fixed = `https://example.com/feed?format=rss`
const label = `count=${id}`
const params = new URLSearchParams({ v: id })
