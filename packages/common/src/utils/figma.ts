import { hashList, nodeList, nodeTree, TreeNode } from './node'

export type FigmaNode = SceneNode & { readonly children?: ReadonlyArray<SceneNode>, exportSettings?: ReadonlyArray<ExportSettings> }

export function figmaNodeById(id: string): FigmaNode {
  return figma.getNodeById(id) as FigmaNode
}

export function figmaReplaceNodeNames(list: TreeNode[], hash: boolean) {
  hashList((fn) => {
    for (const { id, name } of list) {
      figmaNodeById(id).name = hash ? fn(id) : name
    }
  })
}

export async function figmaExportAsync(figmaNode: FigmaNode, options?: Partial<ExportSettingsSVG>): Promise<Uint8Array> {
  const originalList = nodeList(nodeTree(figmaNode))
  figmaReplaceNodeNames(originalList, true)
  const array = await (figmaNode as ExportMixin).exportAsync({
    format: 'SVG',
    contentsOnly: true,
    svgOutlineText: true,
    svgIdAttribute: true,
    svgSimplifyStroke: true,
    ...options
  })
  figmaReplaceNodeNames(originalList, false)
  return array
}
