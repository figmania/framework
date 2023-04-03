import { Root } from 'hast'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'

const processor = unified().use(rehypeParse, { fragment: true }).use(rehypeStringify)

export function parse(html: string): Root {
  return processor.parse(html)
}

export function stringify(root: Root): string {
  return processor.stringify(root)
}
