import { Renderer } from './Renderer'

export const DebugRenderer: Renderer<void> = (svg, defaults) => {
  console.info('DebugRenderer.init', svg, defaults)
  return {
    timeline(element, timeline) {
      console.info('DebugRenderer.timeline', element, timeline)
    },
    finalize() {
      console.info('DebugRenderer.finalize')
    }
  }
}
