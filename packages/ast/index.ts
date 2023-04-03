import { process } from './src/index'

export async function main() {
  const div = document.getElementById('svg')! as HTMLDivElement
  div.innerHTML = process(div.firstElementChild!.outerHTML)
}

main()
