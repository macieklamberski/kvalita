type Headers = { [key: string]: string } // flag
type Named = { name: string; [key: string]: unknown }
type Counts = Record<string, number>
export type { Counts, Headers, Named }
