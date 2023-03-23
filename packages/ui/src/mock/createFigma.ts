/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockPageNode } from './createNode'

export type MockPluginAPI = Pick<PluginAPI, 'apiVersion' | 'editorType' | 'pluginId' | 'ui' | 'clientStorage' | 'showUI' | 'on' | 'currentPage'>

export interface MockWindow extends Window {
  figma: MockPluginAPI
  __html__: string
}

export type MockCallback = (...args: any[]) => void

export function createFigma(target: Window): void {
  const win = target as MockWindow
  const eventHandlers: Record<string, MockCallback[]> = {}
  const currentPage = new MockPageNode()

  win.__html__ = ''
  win.figma = {
    apiVersion: '1.0.0',
    editorType: 'figma',
    pluginId: '0',
    currentPage,
    clientStorage: {
      async getAsync(key) { return JSON.parse(localStorage.getItem(key) ?? 'null') },
      async setAsync(key, value) { localStorage.setItem(key, JSON.stringify(value)) },
      async deleteAsync(key) { localStorage.removeItem(key) },
      async keysAsync() { return [] }
    },
    on(type, callback) {
      if (!eventHandlers[type]) { eventHandlers[type] = [] }
      eventHandlers[type].push(callback)
    },
    showUI(html, { width, height } = {}) {
      figma.ui.resize(width!, height!)
    },
    ui: {
      show() { },
      hide() { },
      resize(width, height) {
        const element = document.querySelector<HTMLDivElement>('.plugin-ui')
        if (!element) { return }
        const bounds = element.getBoundingClientRect()
        element.style.width = `${width - bounds.x}px`
        element.style.height = `${height - bounds.y}px`
      },
      close() { },
      postMessage(pluginMessage) {
        window.postMessage({ pluginMessage }, '*')
      },
      onmessage: undefined,
      on(type: 'message', callback: MessageEventHandler) { },
      once(type, callback) { },
      off(type, callback) { }
    }
  }

  Object.assign(win, {
    parent: {
      postMessage(data: any) {
        if (!figma.ui.onmessage) { return }
        figma.ui.onmessage(data.pluginMessage, { origin: '*' })
      }
    }
  })
}
