import sample from './assets/anim.svg?raw'
import { parse, stringify } from './util/html'
import { transform } from './util/transform'

export async function main() {
  const root = parse(sample)
  transform(root)
  const result = stringify(root)
  console.info(result)
  // const image = document.getElementById('image')! as HTMLImageElement
  // image.src = `data:image/svg+xml;base64,${btoa(result)}`
  const div = document.getElementById('svg')! as HTMLDivElement
  div.innerHTML = result
}

main()
