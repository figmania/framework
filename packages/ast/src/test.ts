import { } from 'css-tree'
import { readFileSync } from 'fs'
import { parse, stringify } from './util/html'
import { transform } from './util/transform'

export async function main() {
  const contents = readFileSync('assets/anim.svg', 'utf-8')
  const root = parse(contents)
  transform(root)
  const result = stringify(root)
  console.info(result)
  // const image = document.getElementById('image')! as HTMLImageElement
  // image.src = `data:image/svg+xml;base64,${btoa(result)}`
  // const div = document.getElementById('svg')! as HTMLDivElement
  // div.innerHTML = result
}

main()
