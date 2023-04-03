import { AnimEase, Element, Properties, Root } from 'hast'
import { select } from 'hast-util-select'
import { is } from 'unist-util-is'
import { visit } from 'unist-util-visit'
import { buildStylesheet } from './style'

export type AnimPropsEase = 'linear' | 'ease-out' | 'ease-in' | 'ease-in-out'

const AnimEaseMap: Record<AnimEase, AnimPropsEase> = {
  'none': 'linear',
  'power1.out': 'ease-out',
  'power1.in': 'ease-in',
  'power1.inOut': 'ease-in-out'
}

export interface AnimProps {
  duration: number
  delay: number
  ease: AnimPropsEase
  transformOrigin: string
  rotation?: [number, number]
  opacity?: [number, number]
  x?: [number, number]
  y?: [number, number]
  scale?: [number, number]
}

export function getAnimNumber(prop: string): [number, number] {
  const [from, to] = prop.split('|')
  return [parseFloat(from), parseFloat(to)]
}

export function getAnimProps(properties: Properties = {}, defaults?: AnimProps): AnimProps {
  const props: AnimProps = {
    duration: properties['anim:duration'] ? +properties['anim:duration'] : defaults?.duration ?? 0.5,
    delay: properties['anim:delay'] ? +properties['anim:delay'] : defaults?.delay ?? 0,
    ease: properties['anim:ease'] ? AnimEaseMap[properties['anim:ease']] : defaults?.ease ?? 'ease-in-out',
    transformOrigin: properties['anim:transform-origin'] ?? defaults?.transformOrigin ?? '50% 50%'
  }
  if (properties['anim:rotation']) { props.rotation = getAnimNumber(properties['anim:rotation']) }
  if (properties['anim:opacity']) { props.rotation = getAnimNumber(properties['anim:opacity']) }
  if (properties['anim:x']) { props.rotation = getAnimNumber(properties['anim:x']) }
  if (properties['anim:y']) { props.rotation = getAnimNumber(properties['anim:y']) }
  if (properties['anim:scale']) { props.rotation = getAnimNumber(properties['anim:scale']) }
  return props
}

export function transform(root: Root): Map<string, AnimProps> {
  const svg = select('svg', root)
  if (!svg) { throw new Error('SVG tag not found') }

  // Build Defaults
  const defaults = getAnimProps(svg.properties)
  const animMap = new Map<string, AnimProps>()

  // Build Anim Map
  visit(root, (node) => {
    if (!is<Element>(node, 'element') || node.tagName === 'svg' || !node.properties?.id || node.properties?.anim == null) { return }
    animMap.set(node.properties.id, getAnimProps(node.properties, defaults))
  })

  // Build Styles
  svg.children.unshift({
    type: 'element',
    tagName: 'style',
    children: [{ type: 'text', value: buildStylesheet(animMap) }]
  })

  // Cleanup
  visit(root, (node) => {
    if (!is<Element>(node, 'element') || node.properties?.anim == null) { return }
    delete node.properties['anim']
    delete node.properties['anim:duration']
    delete node.properties['anim:delay']
    delete node.properties['anim:ease']
    delete node.properties['anim:transform-origin']
    delete node.properties['anim:rotation']
    delete node.properties['anim:opacity']
    delete node.properties['anim:x']
    delete node.properties['anim:y']
    delete node.properties['anim:scale']
  })

  return animMap
}
