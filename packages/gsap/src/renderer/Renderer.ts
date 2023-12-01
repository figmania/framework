import { AnimDefaults, AnimTimeline } from '@figmania/common'
import { DebugRenderer } from './DebugRenderer'
import { GsapRenderer } from './GsapRenderer'

export type RendererType = 'gsap' | 'debug'

export interface RenderScope<R = unknown> {
  timeline(element: Element, timeline: AnimTimeline): void
  finalize(): R
}

export type Renderer<R = unknown> = (svg: SVGSVGElement, defaults: AnimDefaults) => RenderScope<R>

export function getRenderer(type: RendererType): Renderer {
  if (type === 'gsap') {
    return GsapRenderer
  } else if (type === 'debug') {
    return DebugRenderer
  } else {
    throw new Error(`Renderer with type '${type}' not implemented`)
  }
}
