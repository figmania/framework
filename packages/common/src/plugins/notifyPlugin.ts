import { Controller } from '../messenger/Controller'
import { CreateSchema } from '../messenger/Schema'

export type NotifySchema = CreateSchema<{ events: { name: 'notify', data: string } }>

export function notifyPlugin(controller: Controller<NotifySchema>): void {
  controller.addEventHandler('notify', figma.notify)
}