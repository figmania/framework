import { gsap } from 'gsap'
import { getDefaultProps, getTweenProps } from './util/gsap'

export type Timeline = gsap.core.Timeline

export function anim(svg: SVGSVGElement, options: gsap.TimelineVars = {}): gsap.core.Timeline {
  const defaultProps = getDefaultProps(svg)
  const timeline = gsap.timeline({ defaults: { ...defaultProps }, ...options })
  for (const element of Array.from(svg.querySelectorAll('[anim]'))) {
    const { from, to, delay, duration } = getTweenProps(element)
    timeline.fromTo(element, from, { ...to, ...(duration ? { duration } : {}) }, delay)
  }
  return timeline
}
