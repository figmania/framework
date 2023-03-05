/* eslint-disable @typescript-eslint/no-explicit-any */
export type PluginMessageRequest<I = any> = { name: string, id: number, type: 'request', request: I }
export type PluginMessageResponse<O = any> = { name: string, id: number, type: 'response', response: O }
export type PluginMessageEvent<I = any> = { name: string, type: 'event', request: I }
export type PluginMessage = PluginMessageRequest | PluginMessageResponse | PluginMessageEvent

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

export function createFigmaDelegate(): MessengerDelegate {
  return {
    name: 'figma',
    send: (message) => { figma.ui.postMessage(message) },
    listen: (callback) => { figma.ui.onmessage = callback }
  }
}

export function createUIDelegate(): MessengerDelegate {
  return {
    name: 'ui',
    send: (message) => { window.parent.postMessage({ pluginMessage: message }, '*') },
    listen: (callback) => { window.onmessage = (message: FigmaMessageEvent) => { callback(message.data.pluginMessage) } }
  }
}
