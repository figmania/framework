import { hasAttribute, isElement, parse, stringify, transform, Element as UniElement, Node as UniNode } from 'unihtml'
import { visit } from 'unist-util-visit'
import { AnimEase } from '../types/AnimEase'
import { AnimTimeline } from '../types/AnimTimeline'
import { serializeAnimString } from './anim'
import { nodeList, TreeNode } from './node'

export interface SvgNodeData {
  duration: number
  defaultEase: AnimEase
  timelines: AnimTimeline[]
}

export function createNodeMap<T>(node: TreeNode<T>): Record<string, TreeNode<T>> {
  return nodeList(node).reduce<Record<string, TreeNode<T>>>((obj, child) => {
    let tryName = child.name
    let counter = 2
    while (tryName in obj) {
      tryName = `${child.name}_${counter}`
      counter += 1
    }
    obj[tryName] = child
    return obj
  }, {})
}

export function uniAssignNodes<T extends SvgNodeData>(tree: UniNode, masterNode: TreeNode<T>) {
  const nameNodeMap = createNodeMap<T>(masterNode)
  visit(tree, (node) => isElement(node) && hasAttribute(node, 'id'), (node) => {
    if (!isElement(node) || !node.properties?.id) { return }
    if (!node.data) { node.data = {} }
    const figmaNode = nameNodeMap[node.properties.id]
    if (!figmaNode) { return }
    node.data.node = figmaNode
    for (const { property, initialValue, transitions } of figmaNode.data.timelines ?? []) {
      const value = serializeAnimString(initialValue, transitions)
      if (value) { node.properties[`anim:${property}`] = value }
    }
  })
}

export function transformSvg<T extends SvgNodeData>(contents: string, masterNode: TreeNode<T>): string {
  const tree = parse(contents)
  transform(tree, ({ clean }) => { clean() })
  uniAssignNodes<T>(tree, masterNode)
  const svg = tree.children[0] as UniElement
  delete svg.properties!.width
  delete svg.properties!.height
  svg.properties!['xmlns:anim'] = 'http://www.w3.org/2000/anim'
  svg.properties!['anim'] = ''
  svg.properties!['anim:transform-origin'] = '50% 50%'
  svg.properties!['anim:duration'] = String(masterNode.data.duration)
  svg.properties!['anim:ease'] = masterNode.data.defaultEase
  return stringify(tree)
}

export interface SvgEncodeOptions {
  encoding: 'base64' | 'plain' | 'none'
  css: boolean
}

export function svgEncode(contents: string, options: Partial<SvgEncodeOptions> = {}): string {
  const opts: SvgEncodeOptions = { encoding: 'base64', css: true, ...options }
  if (opts.encoding === 'base64' && opts.css) {
    return `background-image: url(data:image/svg+xml;base64,${btoa(contents)});`
  } else if (opts.encoding === 'base64' && !opts.css) {
    return `data:image/svg+xml;base64,${btoa(contents)}`
  } else if (opts.encoding === 'plain' && opts.css) {
    return `background-image: url(data:image/svg+xml,${encodeURIComponent(contents)});`
  } else if (opts.encoding === 'plain' && !opts.css) {
    return `data:image/svg+xml,${encodeURIComponent(contents)}`
  } else {
    return contents
  }
}
