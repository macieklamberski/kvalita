declare const load: () => Promise<string>
declare const done: (value: string) => void
void load().then((value) => done(value)) // flag
const run = async () => {
  const value = await load()
  done(value)
}
const thenable = { then: (resolve: (value: string) => void) => resolve('ok') }
export { run, thenable }
