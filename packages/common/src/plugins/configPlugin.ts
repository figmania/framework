import { Controller } from '../Controller'
import { CreateSchema } from '../Schema'

export type ConfigSchema<C> = CreateSchema<{
  events: (
    { name: 'config:save'; data: Partial<C> } |
    { name: 'config:changed'; data: C }
  )
}>

export function configPlugin<C extends object, S extends ConfigSchema<C> = ConfigSchema<C>>(controller: Controller<S>, defaultConfig: C) {
  const config = { ...defaultConfig }

  controller.addEventHandler('config:save', (value) => {
    Object.assign(config, value)
    figma.clientStorage.setAsync('config', config)
    controller.emit('config:changed', config)
  })

  figma.clientStorage.getAsync('config').then((value: C = defaultConfig) => {
    Object.assign(config, value)
    controller.emit('config:changed', value)
  })
}
