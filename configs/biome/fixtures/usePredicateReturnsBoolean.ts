const isEmpty = (value: string): boolean => value === ''
const hasItems = async (value: Array<string>): Promise<boolean> => value.length > 0
const isText = (value: unknown): value is string => typeof value === 'string'
const isLabel = (value: string): string => value.trim() // flag
const canRetry = (count: number): number => count // flag
const isUntyped = (value: string) => value === ''
export { canRetry, hasItems, isEmpty, isLabel, isText, isUntyped }
