type Target = { id: string }
const first = { id: 'x' } as Target // flag
const second = { id: 'x' } as const
const third: Target = { id: 'x' }
