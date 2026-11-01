declare const promise: Promise<void>
declare const handler: (error: unknown) => void
promise.catch(handler) // flag
void promise.catch(handler)
declare const pending: Promise<void> | undefined
pending?.catch(handler) // flag
void pending?.catch(handler)
