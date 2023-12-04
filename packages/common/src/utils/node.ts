import md5 from 'md5'
import { FigmaNode } from './figma'

export interface TreeNode<T = {}> {
  id: string
  name: string
  type: string
  data: T
  children: TreeNode<T>[]
}

export interface NodeDataModel<T = {}> {
  key: string
  defaults: T
}

export function uid(id: string) {
  return `id${md5(id).substring(0, 8)}`
}

export function nodeData<T = {}>(figmaNode: BaseNode, model: NodeDataModel<T>): T {
  return { ...model.defaults, ...JSON.parse(figmaNode.getPluginData(model.key) || '{}') }
}

export function setNodeData<T = {}>(figmaNode: BaseNode, model: NodeDataModel<T>, data: T) {
  figmaNode.setPluginData(model.key, JSON.stringify(data))
}

export function clearNodeData<T = {}>(figmaNode: BaseNode, model: NodeDataModel<T>) {
  figmaNode.setPluginData(model.key, '')
}

export function nodeHasSvgExport({ exportSettings }: FigmaNode) {
  return exportSettings && exportSettings.findIndex(({ format }) => format === 'SVG') !== -1
}

export function nodeClosest(figmaNode: FigmaNode, predicate: (child: FigmaNode) => boolean): FigmaNode | null {
  let current: FigmaNode = figmaNode.parent as FigmaNode
  while (current) {
    if (predicate(current)) { return current }
    current = current.parent as FigmaNode
  }
  return null
}

export function nodeTree<T = {}>(figmaNode: FigmaNode | PageNode | DocumentNode, model?: NodeDataModel<T>): TreeNode<T> {
  const data: T = model ? nodeData<T>(figmaNode, model) : {} as T
  return { id: figmaNode.id, name: figmaNode.name, type: figmaNode.type, children: (figmaNode.children ?? []).map((child) => nodeTree(child, model)), data }
}

export function nodeList<T = {}>(node: TreeNode<T>, flatList: TreeNode<T>[] = [node]): TreeNode<T>[] {
  if (!node.children) { return flatList }
  for (const child of node.children) {
    flatList.push({ id: child.id, name: child.name, type: node.type, data: child.data, children: [] })
    nodeList<T>(child, flatList)
  }
  return flatList
}

export const SceneNodeTypes: SceneNode['type'][] = [
  'FRAME',
  'GROUP',
  'SLICE',
  'RECTANGLE',
  'LINE',
  'ELLIPSE',
  'POLYGON',
  'STAR',
  'VECTOR',
  'TEXT',
  'COMPONENT_SET',
  'COMPONENT',
  'INSTANCE',
  'BOOLEAN_OPERATION',
  'STICKY',
  'STAMP',
  'TABLE',
  'HIGHLIGHT',
  'WASHI_TAPE',
  'SHAPE_WITH_TEXT',
  'CODE_BLOCK',
  'CONNECTOR',
  'WIDGET',
  'EMBED',
  'LINK_UNFURL',
  'MEDIA',
  'SECTION'
]

export function figmaNodeList(node: BaseNode, flatList: FigmaNode[] = []): FigmaNode[] {
  if (node.type !== 'DOCUMENT' && node.type !== 'PAGE') {
    flatList.push(node)
  }
  if ('children' in node) {
    for (const child of node.children) {
      figmaNodeList(child, flatList)
    }
  }
  return flatList
}
