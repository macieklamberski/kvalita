type Options = { days: number }
export const matchA = (options: { days: number }): number => options.days // flag
export const matchB = (options: Options): number => options.days
export const matchC = (values: Array<{ days: number }>): number => values.length
