import { TreeNode, uid } from './node'

export interface WindowSize { width: number; height: number }

export type FigmaNode = SceneNode & { readonly children?: ReadonlyArray<SceneNode>; exportSettings?: ReadonlyArray<ExportSettings> }

export function figmaNodeById(id: string): FigmaNode {
  return figma.getNodeById(id) as FigmaNode
}

export function figmaReplaceNodeNames(list: TreeNode[], hash: boolean) {
  for (const { id, name } of list) {
    figmaNodeById(id).name = hash ? uid(id) : name
  }
}

export async function figmaExportAsync(figmaNode: FigmaNode, options?: Partial<ExportSettingsSVGString>): Promise<string> {
  // const originalList = nodeList(nodeTree(figmaNode))
  // figmaReplaceNodeNames(originalList, true)
  const result = await (figmaNode as ExportMixin).exportAsync({
    format: 'SVG_STRING',
    contentsOnly: true,
    svgOutlineText: true,
    svgIdAttribute: true,
    svgSimplifyStroke: true,
    ...options
  })
  // figmaReplaceNodeNames(originalList, false)
  return result
}
