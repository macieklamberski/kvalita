declare const html: (strings: TemplateStringsArray) => string
const value = html`<img>` // flag
const block = html`
  <p>one</p>
`
const plain = '<img>'
const other = css`a { color: red }`
export { block, other, plain, value }
