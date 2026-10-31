declare const user: { name?: string }
declare const left: string
declare const right: string
declare const prefix: string
declare const other: string | undefined
const isRenamed = user.name?.toLowerCase() !== left.toLowerCase() // flag
const isSame = left.toLowerCase() === right.toLowerCase() // flag
const isSameUpper = left.toUpperCase() === right.toUpperCase() // flag
const isLiteral = left.toLowerCase() === 'video'
const isHalf = left.toLowerCase() === right
const isRaw = left === right
const isMixed = left.toLowerCase() === right.toUpperCase()
const isJoined = prefix + left.toLowerCase() === right.toLowerCase()
const isBothOptional = user.name?.toLowerCase() === other?.toLowerCase()
