import { t } from 'trousse'

const locales = { errors: { timeout: 'Timed out after {{seconds}}s' } }
const message = 'Timed out'
const seconds = 5

class ParseError extends Error {}
const errors = { ParseError }

throw new Error('Timed out') // flag
throw new Error(`Timed out after ${seconds}s`) // flag
throw new Error('Timed out after ' + seconds + 's') // flag
throw new TypeError('Expected a string') // flag
throw new ParseError('Unexpected token') // flag
throw new Error('Timed out', { cause: message }) // flag
throw new Error('ETIMEDOUT')
throw new Error(message)
throw new Error(locales.errors.timeout)
throw new Error(t(locales.errors.timeout, { seconds }))
throw new Error()
throw new errors.ParseError('Unexpected token') // flag
throw new Map('Timed out')
throw new ErrorBoundary('Timed out')
