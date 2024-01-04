/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessengerDelegate, PluginMessage } from './Delegate'
import { CreateSchema } from './Schema'

export type EventHandler<I = any> = (request: I) => void

export type RequestHandler<I = any, O = any> = (request: I) => O | PromiseLike<O>

export interface Controller<S extends CreateSchema> {
  onRequest?(name: string, request: any): void
  onResponse?(name: string, response: any): void
  addRequestHandler<K extends keyof S['request'], M extends S['request'][K]>(name: K, handler: RequestHandler<M[0], M[1]>): void
  removeRequestHandler<K extends keyof S>(name: K): void
  onEvent?(name: string, message: any): void
  addEventHandler<K extends keyof S['events'], M extends S['events'][K]>(name: K, handler: EventHandler<M>): () => void
  removeEventHandler<K extends keyof S['events'], M extends S['events'][K]>(name: K, handler: EventHandler<M>): void
  emit<K extends keyof S['events'], M extends S['events'][K]>(name: K, request: M): void
  request<K extends keyof S['request'], M extends S['request'][K]>(name: K, request: M[0]): Promise<M[1]>
}

export function createController<S extends CreateSchema>(delegate: MessengerDelegate, fn?: (controller: Controller<S>) => void | Promise<void>): Controller<S> {
  let jobId = 0
  const requestHandlers = new Map<keyof S['request'], RequestHandler>()
  const eventHandlers = new Map<keyof S['events'], EventHandler[]>()
  const jobs = new Map<number, (data: any) => void>()

  // Create Controller
  const controller: Controller<S> = {
    addRequestHandler(name, handler) {
      requestHandlers.set(name, handler)
    },
    removeRequestHandler(name) {
      requestHandlers.delete(name)
    },
    addEventHandler(name, handler) {
      const handlers = eventHandlers.get(name) ?? []
      eventHandlers.set(name, [...handlers, handler])
      return () => { controller.removeEventHandler(name, handler) }
    },
    removeEventHandler(name, handler) {
      const handlers = eventHandlers.get(name) ?? []
      const index = handlers.indexOf(handler)
      if (index === -1) { return }
      eventHandlers.set(name, [...handlers.splice(index, 1)])
    },
    emit(name, request) {
      delegate.send({ type: 'event', name, request })
    },
    request(name, request) {
      const id = (jobId += 1)
      const promise = new Promise((resolve) => { jobs.set(id, resolve) })
      delegate.send({ id, type: 'request', name, request })
      return promise
    }
  }

  // Run Callback
  if (fn) { fn(controller) }

  // Attach Delegate
  delegate.listen((message: PluginMessage) => {
    if (!message.type) { return }
    if (message.type === 'request') {
      const handler = requestHandlers.get(message.name)
      if (!handler) { throw new Error(`No request handler registered for ${message.name}`) }
      if (controller.onRequest) { controller.onRequest(message.name, message.request) }
      Promise.resolve(handler(message.request)).then((response) => {
        if (controller.onResponse) { controller.onResponse(message.name, response) }
        delegate.send({ id: message.id, type: 'response', name: message.name, response })
      })
    } else if (message.type === 'response') {
      const resolve = jobs.get(message.id)!
      resolve(message.response)
    } else if (message.type === 'event') {
      const handlers = eventHandlers.get(message.name) ?? []
      if (controller.onEvent) { controller.onEvent(message.name, message.request) }
      for (const handler of handlers) {
        handler(message.request)
      }
    }
  })

  return controller
}
