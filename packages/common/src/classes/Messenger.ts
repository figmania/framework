/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventHandler, FigmaMessageEvent, MessengerDelegate, PluginMessageEvent, PluginMessageRequest, PluginMessageResponse, RequestHandler, SchemaConfig } from './BaseMessenger'

export class Messenger<S extends SchemaConfig> {
  private jobId = 0
  private jobs = new Map<number, (data: any) => void>()
  private eventHandlers = new Map<keyof S['events'], EventHandler[]>()
  private requestHandlers = new Map<keyof S['request'], RequestHandler>()

  constructor(private delegate: MessengerDelegate) {
    this.delegate.listen((message) => { this.onMessage(message) })
  }

  addRequestHandler<K extends keyof S['request'], M extends S['request'][K]>(name: K, handler: RequestHandler<M[0], M[1]>) {
    this.requestHandlers.set(name, handler)
  }

  removeRequestHandler<K extends keyof S>(name: K) {
    this.requestHandlers.delete(name)
  }

  emit<K extends keyof S['events'], M extends S['events'][K]>(name: K, request: M): void {
    this.delegate.send({ type: 'event', name, request })
  }

  on<K extends keyof S['events'], M extends S['events'][K]>(name: K, handler: EventHandler<M>) {
    const handlers = this.eventHandlers.get(name) ?? []
    this.eventHandlers.set(name, [...handlers, handler])
    return () => { this.off(name, handler) }
  }

  off<K extends keyof S['events'], M extends S['events'][K]>(name: K, handler: EventHandler<M>) {
    const handlers = this.eventHandlers.get(name) ?? []
    const index = handlers.indexOf(handler)
    if (index === -1) { return }
    this.eventHandlers.set(name, [...handlers.splice(index, 1)])
  }

  request<K extends keyof S['request'], M extends S['request'][K]>(name: K, request: M[0]): Promise<M[1]> {
    const id = (this.jobId += 1)
    const promise = new Promise<M[1]>((resolve) => { this.jobs.set(id, resolve) })
    this.delegate.send({ id, type: 'request', name, request })
    return promise
  }

  respond<O>(id: number, name: string, response: O): void {
    this.delegate.send({ id, type: 'response', name, response })
  }

  private onMessage(message: PluginMessageRequest | PluginMessageResponse | PluginMessageEvent) {
    if (message.type === 'request') {
      const handler = this.requestHandlers.get(message.name)
      if (!handler) { throw new Error(`No request handler registered for ${message.name}`) }
      Promise.resolve(handler(message.request)).then((response) => { this.respond(message.id, message.name, response) })
    } else if (message.type === 'response') {
      const resolve = this.jobs.get(message.id)!
      resolve(message.response)
    } else if (message.type === 'event') {
      const handlers = this.eventHandlers.get(message.name) ?? []
      for (const handler of handlers) { handler(message.request) }
    }
  }
}

export function createControllerDelegate(): MessengerDelegate {
  return {
    name: 'controller',
    send: (message) => { figma.ui.postMessage(message) },
    listen: (callback) => { figma.ui.onmessage = callback }
  }
}

export function createUiDelegate(): MessengerDelegate {
  return {
    name: 'ui',
    send: (message) => { window.parent.postMessage({ pluginMessage: message }, '*') },
    listen: (callback) => { window.onmessage = (message: FigmaMessageEvent) => { callback(message.data.pluginMessage) } }
  }
}
