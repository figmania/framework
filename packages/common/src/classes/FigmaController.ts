import { SchemaConfig } from './BaseMessenger'
import { createControllerDelegate, Messenger } from './Messenger'

export abstract class FigmaController<S extends SchemaConfig> extends Messenger<S> {
  constructor(uiOptions: Partial<ShowUIOptions> = {}) {
    super(createControllerDelegate())
    figma.on('selectionchange', () => { this.onSelectionChange(figma.currentPage.selection) })
    figma.showUI(__html__, { visible: true, width: 320, height: 320, ...uiOptions })
    this.onSelectionChange(figma.currentPage.selection)
  }

  private onSelectionChange(selection: ReadonlyArray<SceneNode>): void {
    if (selection.length === 0) {
      this.deselect()
    } else {
      this.select(selection)
    }
  }

  abstract select(selection: ReadonlyArray<SceneNode>): void
  abstract deselect(): void
}
