type Feed = { title: string }
export const parseA = (): { title: string } => ({ title: 'a' }) // flag
export const parseB = (): Feed => ({ title: 'b' })
export const parseC = (): Array<{ title: string }> => []
