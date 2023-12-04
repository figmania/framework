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
  const tl = gsap.timeline({ defaults })
  return {
    timeline(element, { property, initialValue, transitions }) {
      transitions.forEach(({ from, to, value, ease }, index) => {
        if (index === 0) {
          tl.fromTo(element, { [property]: initialValue }, { [property]: value, duration: to - from, ease: EaseAnimToGsap[ease] }, from)
        } else {
          tl.to(element, { [property]: value, duration: to - from, ease: EaseAnimToGsap[ease] }, from)
        }
      })
    },
    finalize() { return tl }
  }
}
