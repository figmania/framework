import { AnimEase, AnimProperties } from '@figmania/common'
import { gsap } from 'gsap'
import { getAnimAttribute, getAnimSvgAttributes, getAnimTimelines } from './util/dom'

const EaseAnimToGsap: Record<AnimEase, gsap.EaseString> = {
  'linear': 'none',
  'ease-in': 'power1.in',
  'ease-out': 'power1.out',
  'ease-in-out': 'power1.inOut'
}

const ANIM_SELECTOR = AnimProperties.map((type) => `[anim\\:${type}]`).join(',')

export function anim(svg: SVGSVGElement) {
  const defaults = getAnimSvgAttributes(svg)
  const timeline = gsap.timeline({ defaults })
  for (const element of Array.from(svg.querySelectorAll(ANIM_SELECTOR))) {
    for (const { property, initialValue, transitions } of getAnimTimelines(element, defaults)) {
      transitions.forEach(({ from, to, value, ease }, index) => {
        if (index === 0) {
          timeline.fromTo(element, { [property]: initialValue }, { [property]: value, duration: to - from, ease: EaseAnimToGsap[ease] }, from)
        } else {
          timeline.to(element, { [property]: value, duration: to - from, ease: EaseAnimToGsap[ease] }, from)
        }
      })
    }
  }
  const duration = +getAnimAttribute<string>(svg, 'duration', '1')
  timeline.fromTo(null, {}, { duration }, 0)
  return timeline
}
