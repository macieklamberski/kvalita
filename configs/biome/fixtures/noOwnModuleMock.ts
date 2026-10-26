declare const mock: { module: (path: string, factory: () => object) => void }
mock.module('./fetch', () => ({})) // flag
mock.module('@/utils/fetch', () => ({})) // flag
mock.module('node:fs', () => ({}))
mock.module('linkedom', () => ({}))
