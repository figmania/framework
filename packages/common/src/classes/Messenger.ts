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

export class Messenger {
  private jobId = 0
  private jobs = new Map<number, (data: any) => void>()
  private handlers = new Map<string, MessageHandler>()

  constructor(private delegate: MessengerDelegate) {
    this.delegate.listen((message) => { this.onMessage(message) })
  }

  addRequestHandler<I = void, O = void>(name: string, handler: MessageHandler<I, O>) {
    this.handlers.set(name, handler)
  }

  request<I, O>(name: string, request: I): Promise<O> {
    const id = (this.jobId += 1)
    const promise = new Promise<O>((resolve) => { this.jobs.set(id, resolve) })
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
