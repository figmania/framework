/* eslint-disable @typescript-eslint/no-explicit-any */

export type EventHandler<I = any> = (request: I) => void
export type RequestHandler<I = any, O = any> = (request: I) => O | PromiseLike<O>
export type PluginMessageRequest<I = any> = { name: string, id: number, type: 'request', request: I }
export type PluginMessageResponse<O = any> = { name: string, id: number, type: 'response', response: O }
export type PluginMessageEvent<I = any> = { name: string, type: 'event', request: I }

export type SchemaDef = {
  events: { name: string, data: unknown }
  requests: { name: string, data: [unknown, unknown] }
}

export type SchemaConfig<Schema extends SchemaDef = any> = {
  events: {
    [S in Schema['events']as S['name']]: S['data']
  }
  request: {
    [S in Schema['requests']as S['name']]: S['data']
  }
}

export interface FigmaMessageEvent extends MessageEvent {
  data: {
    pluginId: string
    pluginMessage: PluginMessageRequest | PluginMessageResponse
  }
}

export interface MessengerDelegate {
  name?: string
  send: (message: any) => void
  listen: (callback: (message: any) => void) => void
}
