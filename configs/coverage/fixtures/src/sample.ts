export const describeCount = (count: number): string => {
  return count === 1 ? 'one item' : `${count} items`
}

export const readLabel = (label: string | undefined): string => {
  return label ?? 'untitled'
}

export const clampAge = (age: number): number => {
  if (age < 0) {
    return 0
  }

  return age
}

export const greet = (name: string): string => {
  return `Hello, ${name}`
}

export const farewell = (name: string | undefined): string => {
  return name ? `Bye, ${name}` : 'Bye'
}
