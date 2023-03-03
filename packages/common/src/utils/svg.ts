import { TreeNode, uid } from './node'

export type SvgTransformCallback = (svg: SVGSVGElement) => Element

export function svgTransform(contents: string, node: TreeNode, callback?: SvgTransformCallback): string {
  const svg = svgElement(contents)
  svgReplaceIds(svg, 'linearGradient', 'fill', (child) => uid(`${node.id}:linearGradient:${child.id}`))
  svgReplaceIds(svg, 'linearGradient', 'fill', (child) => uid(`${node.id}:linearGradient:${child.id}`))
  svgReplaceIds(svg, 'mask', 'mask', (child) => uid(`${node.id}:mask:${child.id}`))
  svgReplaceIds(svg, 'filter', 'filter', (child) => uid(`${node.id}:filter:${child.id}`))
  svgReplaceIds(svg, 'clipPath', 'clip-path', (child) => uid(`${node.id}:clipPath:${child.id}`))
  const result = callback ? callback(svg) : svg
  return result.outerHTML
}

export interface SvgEncodeOptions {
  encoding: 'base64' | 'plain' | 'none'
  css: boolean
}

export function svgEncode(contents: string, options: Partial<SvgEncodeOptions> = {}): string {
  const opts: SvgEncodeOptions = { encoding: 'base64', css: true, ...options }
  if (opts.encoding === 'base64' && opts.css) {
    return `background-image: url(data:image/svg+xml;base64,${btoa(contents)});`
  } else if (opts.encoding === 'base64' && !opts.css) {
    return `data:image/svg+xml;base64,${btoa(contents)}`
  } else if (opts.encoding === 'plain' && opts.css) {
    return `background-image: url(data:image/svg+xml,${encodeURIComponent(contents)});`
  } else if (opts.encoding === 'plain' && !opts.css) {
    return `data:image/svg+xml,${encodeURIComponent(contents)}`
  } else {
    return contents
  }
}

export function svgReplaceIds(svg: SVGSVGElement, tagName: string, attributeName: string, generator: (element: Element) => string) {
  svg.querySelectorAll(`${tagName}[id]`).forEach((element) => {
    const id = generator(element)
    svg.querySelectorAll(`[${attributeName}="url(#${element.id})"]`).forEach((target) => { target.setAttribute(attributeName, `url(#${id})`) })
    element.id = id
  })
}

export function svgElement(contents: string): SVGSVGElement {
  const element = document.createElement('div')
  element.innerHTML = contents
  return element.firstChild as SVGSVGElement
}
