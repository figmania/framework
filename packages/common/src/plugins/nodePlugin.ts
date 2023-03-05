import { Controller } from '../messenger/Controller'
import { CreateSchema } from '../messenger/Schema'

export type NodeSchema = CreateSchema<{ events: { name: 'node:select', data: unknown } }>

export function nodePlugin<S extends CreateSchema>(controller: Controller<S>, fn: (node: SceneNode) => S['events']['node:select']): void {
  const selectNode = () => {
    const [node] = figma.currentPage.selection
    const result = fn(node)
    controller.emit('node:select', result)
  }
  figma.on('selectionchange', selectNode)
  selectNode()
}
