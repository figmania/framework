import { Controller } from '../Controller'
import { FigmaLogger, FigmaLoggerOptions, LogLevel } from '../Logger'
import { CreateSchema } from '../Schema'

export function logPlugin<S extends CreateSchema>(controller: Controller<S>, options: Partial<FigmaLoggerOptions> = {}): FigmaLogger {
  const logger = new FigmaLogger({ name: 'FIGMA', minLevel: LogLevel.SILLY, date: false, ...options })

  controller.onEvent = (eventName, message) => { logger.event(eventName, message) }
  controller.onRequest = (eventName, request) => { logger.request(eventName, request) }
  controller.onResponse = (eventName, response) => { logger.response(eventName, response) }

  return logger
}
