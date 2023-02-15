/* eslint-disable @typescript-eslint/no-explicit-any */
export type MessageHandler<I = any, O = any> = (request: I) => Promise<O>
export type PluginMessageRequest<I = any> = { name: string, id: number, type: 'request', request: I }
export type PluginMessageResponse<O = any> = { name: string, id: number, type: 'response', response: O }

export interface MessengerDelegate {
  name?: string
  send: (message: any) => void
  listen: (callback: (message: any) => void) => void
}

export interface FigmaMessageEvent extends MessageEvent {
  data: {
    pluginId: string
    pluginMessage: PluginMessageRequest | PluginMessageResponse
  }
}

export type SchemaMethod = { name: string, request: unknown, response: unknown }

export type SchemaConfig<Schema extends SchemaMethod> = {
  [S in Schema as S['name']]: { request: S['request'], response: S['response'] }
}

export class Messenger<S extends SchemaConfig<SchemaMethod> = {}> {
  private jobId = 0
  private jobs = new Map<number, (data: any) => void>()
  private handlers = new Map<keyof S, MessageHandler>()

  constructor(private delegate: MessengerDelegate) {
    this.delegate.listen((message) => { this.onMessage(message) })
  }

  addRequestHandler<K extends keyof S, M extends S[K]>(name: K, handler: MessageHandler<M['request'], M['response']>) {
    this.handlers.set(name, handler)
  }

  request<K extends keyof S, M extends S[K]>(name: K, request: M['request']): Promise<M['response']> {
    const id = (this.jobId += 1)
    const promise = new Promise<M['response']>((resolve) => { this.jobs.set(id, resolve) })
    this.delegate.send({ id, type: 'request', name, request })
    return promise
  }

  respond<O>(id: number, name: string, response: O): void {
    this.delegate.send({ id, type: 'response', name, response })
  }

  private onMessage(message: PluginMessageRequest | PluginMessageResponse) {
    if (message.type === 'request') {
      const handler = this.handlers.get(message.name)!
      handler(message.request).then((response) => { this.respond(message.id, message.name, response) })
    } else if (message.type === 'response') {
      const resolve = this.jobs.get(message.id)!
      resolve(message.response)
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
