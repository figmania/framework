import md5 from 'md5'
import { FigmaNode } from './figma'

export interface TreeNode<T = {}> {
  id: string
  name: string
  data: T
  children: TreeNode<T>[]
}

export interface NodeDataModel<T = {}> {
  key: string
  defaults: T
}

export function nodeIdHash(id: string) {
  return md5(id)
}

export function nodeData<T = {}>(figmaNode: FigmaNode, model: NodeDataModel<T>): T {
  return { ...model.defaults, ...JSON.parse(figmaNode.getPluginData(model.key) || '{}') }
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

export function nodeTree<T = {}>(figmaNode: FigmaNode, model?: NodeDataModel<T>): TreeNode<T> {
  const data: T = model ? nodeData<T>(figmaNode, model) : {} as T
  return { id: figmaNode.id, name: figmaNode.name, children: (figmaNode.children ?? []).map((child) => nodeTree(child, model)), data }
}

export function nodeList<T = {}>(node: TreeNode<T>, flatList: TreeNode<T>[] = [node]): TreeNode<T>[] {
  if (!node.children) { return flatList }
  for (const child of node.children) {
    flatList.push({ id: child.id, name: child.name, data: child.data, children: [] })
    nodeList<T>(child, flatList)
  }
  return flatList
}