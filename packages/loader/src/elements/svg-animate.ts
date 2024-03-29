import { render } from '@figmania/gsap'
import 'gsap'
import { CustomElement } from '../decorators/CustomElement'
import { intersectionObserver } from '../util/intersection'
import { loadResource } from '../util/xhr'

export type SvgAnimateTrigger = 'hover' | 'loop' | 'visible' | 'on' | 'off'

@CustomElement('svg-animate')
export class SvgAnimate extends HTMLElement {
  static get observedAttributes() { return ['src', 'trigger'] }

  private timeline?: gsap.core.Timeline
  private svg?: SVGSVGElement

  connectedCallback() {
    this.updateTrigger(this.trigger)
    if (this.contentSvg) { this.updateSvg(this.contentSvg) }
  }

  async attributeChangedCallback(name: string, previousValue: string, currentValue: string) {
    if (name === 'src' && !this.contentSvg && currentValue) {
      this.updateSvg(await loadResource<SVGSVGElement>(currentValue, 'image/svg+xml'))
    }
    if (name === 'trigger' && this.timeline) {
      this.updateTrigger(currentValue as SvgAnimateTrigger, previousValue ? previousValue as SvgAnimateTrigger : undefined)
    }
  }

  private updateTrigger(currentTrigger: SvgAnimateTrigger, previousTrigger?: SvgAnimateTrigger) {
    if (previousTrigger === 'hover') {
      this.removeEventListener('mouseover', this.onMouseOver)
      this.removeEventListener('mouseout', this.onMouseOut)
      this.reset()
    } else if (previousTrigger === 'visible') {
      intersectionObserver.unobserve(this)
    } else if (previousTrigger === 'loop') {
      this.loop(false)
    }

    if (currentTrigger === 'hover') {
      this.reset()
      this.addEventListener('mouseover', this.onMouseOver)
      this.addEventListener('mouseout', this.onMouseOut)
    } else if (currentTrigger === 'loop') {
      this.reset()
      this.loop(true)
      this.play()
    } else if (currentTrigger === 'visible') {
      intersectionObserver.observe(this)
    } else if (currentTrigger === 'on') {
      this.play()
    } else if (currentTrigger === 'off') {
      this.reverse()
    }
  }

  private async updateSvg(svg: SVGSVGElement) {
    this.destroy()
    this.svg = svg
    this.svg.removeAttribute('width')
    this.svg.removeAttribute('height')
    this.svg.style.display = 'block'
    this.appendChild(this.svg)
    this.timeline = render(this.svg) as gsap.core.Timeline
    this.timeline.repeat(this.trigger === 'loop' ? -1 : 0)
    this.timeline.paused(!['on', 'loop'].includes(this.trigger))
  }

  play() {
    this.timeline?.play()
  }

  loop(enable = true) {
    this.timeline?.repeat(enable ? -1 : 0)
  }

  reverse() {
    this.timeline?.reverse()
  }

  reset() {
    this.timeline?.repeat(0)
    this.timeline?.seek(0)
    this.timeline?.pause()
  }

  toggle() {
    this.trigger = (this.trigger === 'off') ? 'on' : 'off'
  }

  destroy() {
    if (this.timeline) {
      this.timeline.kill()
      delete this.timeline
    }

    if (this.svg) {
      this.svg.remove()
      delete this.svg
    }
  }

  private onMouseOver = () => { this.play() }
  private onMouseOut = () => { this.reverse() }
  private get contentSvg() { return this.firstElementChild instanceof SVGSVGElement ? this.firstElementChild : null }

  get src(): string | null { return this.getAttribute('src') }
  set src(value: string | null) { if (value) { this.setAttribute('src', value) } else { this.removeAttribute('src') } }
  get trigger(): SvgAnimateTrigger { return this.getAttribute('trigger') as SvgAnimateTrigger ?? 'load' }
  set trigger(value: SvgAnimateTrigger) { this.setAttribute('trigger', value) }
}
