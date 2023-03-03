import { prettyPrint } from 'html'

export interface FormatOptions {
  indentSize: number
  maxChar: number
}

export function format(contents: string, options: Partial<FormatOptions> = {}): string {
  const opts: FormatOptions = { indentSize: 2, maxChar: 0, ...options }
  return prettyPrint(contents, { indent_size: opts.indentSize, max_char: opts.maxChar }).replace(/\n\s*\n/g, '\n')
}
