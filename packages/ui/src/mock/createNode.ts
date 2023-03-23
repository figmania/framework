export type MockNodeOptions = Pick<BaseNodeMixin, 'id' | 'name'>

export class MockNode implements BaseNodeMixin, ChildrenMixin, ExportMixin {
  constructor(options?: Partial<MockNodeOptions>) {
    Object.assign(this, options)
  }

  // BaseNodeMixin
  id = 'id:test'
  name = 'name:test'
  parent = null
  removed = false
  toString(): string { throw new Error('Method not implemented.') }
  remove(): void { throw new Error('Method not implemented.') }
  setRelaunchData(data: { [command: string]: string }): void { throw new Error('Method not implemented.') }
  getRelaunchData(): { [command: string]: string } { throw new Error('Method not implemented.') }
  getPluginData(key: string): string { throw new Error('Method not implemented.') }
  setPluginData(key: string, value: string): void { throw new Error('Method not implemented.') }
  getPluginDataKeys(): string[] { throw new Error('Method not implemented.') }
  getSharedPluginData(namespace: string, key: string): string { throw new Error('Method not implemented.') }
  setSharedPluginData(namespace: string, key: string, value: string): void { throw new Error('Method not implemented.') }
  getSharedPluginDataKeys(namespace: string): string[] { throw new Error('Method not implemented.') }

  // ChildrenMixin
  children = []
  appendChild(child: SceneNode): void { throw new Error('Method not implemented.') }
  insertChild(index: number, child: SceneNode): void { throw new Error('Method not implemented.') }
  findChildren(callback?: ((node: SceneNode) => boolean) | undefined): SceneNode[] { throw new Error('Method not implemented.') }
  findChild(callback: (node: SceneNode) => boolean): SceneNode | null { throw new Error('Method not implemented.') }
  findAll(callback?: ((node: SceneNode) => boolean) | undefined): SceneNode[] { throw new Error('Method not implemented.') }
  findOne(callback: (node: SceneNode) => boolean): SceneNode | null { throw new Error('Method not implemented.') }
  findAllWithCriteria<T extends ('PAGE' | 'DOCUMENT' | 'SLICE' | 'FRAME' | 'GROUP' | 'COMPONENT_SET' | 'COMPONENT' | 'INSTANCE' | 'BOOLEAN_OPERATION' | 'VECTOR' | 'STAR' | 'LINE' | 'ELLIPSE' | 'POLYGON' | 'RECTANGLE' | 'TEXT' | 'STICKY' | 'CONNECTOR' | 'SHAPE_WITH_TEXT' | 'CODE_BLOCK' | 'STAMP' | 'WIDGET' | 'EMBED' | 'LINK_UNFURL' | 'MEDIA' | 'SECTION' | 'HIGHLIGHT' | 'WASHI_TAPE')[]>(criteria: { types: T }): ({ type: T[number] } & SceneNode)[] { throw new Error('Method not implemented.') }
  findWidgetNodesByWidgetId(widgetId: string): WidgetNode[] { throw new Error('Method not implemented.') }

  // ExportMixin
  exportSettings = []
  exportAsync(settings?: ExportSettings | undefined): Promise<Uint8Array> { throw new Error('Method not implemented.') }
}

export class MockPageNode extends MockNode implements PageNode {
  get type(): 'PAGE' { return 'PAGE' }
  clone(): PageNode { throw new Error('Method not implemented.') }
  guides = []
  selection = []
  selectedTextRange = null
  flowStartingPoints = []
  backgrounds = []
  prototypeBackgrounds = []
  prototypeStartNode = null
}
