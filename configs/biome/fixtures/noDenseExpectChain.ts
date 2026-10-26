declare const document: { querySelector: (selector: string) => { parentElement?: { tagName: string } } | null }
expect(document.querySelector('path')?.parentElement?.tagName).toBe('svg') // flag
const parent = document.querySelector('path')?.parentElement
expect(parent?.tagName).toBe('svg')
