import { Controller } from '../Controller'
import { CreateSchema } from '../Schema'

export type NotifySchema = CreateSchema<{ events: { name: 'notify', data: string } }>

export function notifyPlugin(controller: Controller<NotifySchema>): void {
  controller.addEventHandler('notify', figma.notify)
}