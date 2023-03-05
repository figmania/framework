import { debounce } from 'debounce'
import { Controller } from '../messenger/Controller'
import { CreateSchema } from '../messenger/Schema'
import { WindowSize } from '../utils/figma'

export type ResizeSchema = CreateSchema<{ events: { name: 'window:resize', data: WindowSize } }>

export async function resizePlugin<S extends ResizeSchema>(controller: Controller<S>, defaultSize: WindowSize): Promise<WindowSize> {
  const size = { ...defaultSize, ...(await figma.clientStorage.getAsync('size')) }

  const saveConfig = debounce((value: WindowSize) => {
    figma.clientStorage.setAsync('size', value)
  }, 1000)

  controller.addEventHandler('window:resize', (value: WindowSize) => {
    Object.assign(size, value)
    figma.ui.resize(size.width, size.height)
    saveConfig(value)
  })

  return size
}
