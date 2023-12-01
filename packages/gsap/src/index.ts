import { AnimProperties } from '@figmania/common'
import { RendererType, getRenderer } from './renderer/Renderer'
import { getAnimSvgAttributes, getAnimTimelines } from './util/dom'

export * from './renderer/DebugRenderer'
export * from './renderer/GsapRenderer'
export * from './renderer/Renderer'
export * from './util/dom'

export const ANIM_SELECTOR = AnimProperties.map((type) => `[anim\\:${type}]`).join(',')

export function anim(svg: SVGSVGElement, type: RendererType = 'gsap') {
  const defaultProps = getAnimSvgAttributes(svg)
  const Renderer = getRenderer(type)
  const renderer = Renderer(svg, defaultProps)
  for (const element of Array.from(svg.querySelectorAll(ANIM_SELECTOR))) {
    for (const timeline of getAnimTimelines(element, defaultProps)) {
      renderer.timeline(element, timeline)
    }
  }
  return renderer.finalize()
}
