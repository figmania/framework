import { gsap } from 'gsap'
import { getDefaultProps, getTweenProps, Timeline } from './util/gsap'
export * from './util/gsap'

export type AnimOptions = gsap.TimelineVars

export function anim(svg: SVGSVGElement, options: AnimOptions = {}): Timeline {
  const defaultProps = getDefaultProps(svg)
  const timeline = gsap.timeline({ defaults: { ...defaultProps }, ...options })
  for (const element of Array.from(svg.querySelectorAll('[anim]'))) {
    const { from, to, delay, duration } = getTweenProps(element)
    timeline.fromTo(element, from, { ...to, ...(duration ? { duration } : {}) }, delay)
  }
  return timeline
}
