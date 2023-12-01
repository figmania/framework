import { AnimEase } from '@figmania/common'
import { gsap } from 'gsap'
import { Renderer } from './Renderer'

export const EaseAnimToGsap: Record<AnimEase, gsap.EaseString> = {
  'linear': 'none',
  'ease-in': 'power1.in',
  'ease-out': 'power1.out',
  'ease-in-out': 'power1.inOut'
}

export const GsapRenderer: Renderer<gsap.core.Timeline> = (_svg, defaults) => {
  const gsapTimeline = gsap.timeline({ defaults })
  return {
    timeline(element, { property, initialValue, transitions }) {
      gsapTimeline.set(element, { [property]: initialValue }, 0)
      for (const { from, to, value, ease } of transitions) {
        gsapTimeline.to(element, { [property]: value, duration: to - from, ease: EaseAnimToGsap[ease] }, from)
      }
    },
    finalize() { return gsapTimeline }
  }
}
