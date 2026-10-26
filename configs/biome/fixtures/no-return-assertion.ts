declare const document: { querySelector: (selector: string) => unknown }
declare type Element = { tagName: string }
const findImage = (): Element => {
  return document.querySelector('img') as Element // flag
}
const listSizes = () => {
  return [1, 2] as const
}
const findLink = (): Element => {
  const link = document.querySelector('a')

  if (!link) {
    throw new Error('No link in the fixture')
  }

  return link as Element // flag
}
