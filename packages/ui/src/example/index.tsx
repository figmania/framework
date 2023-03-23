import { createController, createFigmaDelegate, createUIDelegate, logPlugin, nodePlugin, notifyPlugin, resizePlugin, TreeNode } from '@figmania/common'
import { createRoot } from 'react-dom/client'
import { ClipboardProvider, FigmaProvider } from '..'
import { createFigma } from '../mock/createFigma'
import { App } from './App'
import './index.scss'
import { PluginWindow } from './PluginWindow'
import { Schema } from './Schema'

createFigma(window)

createController<Schema>(createFigmaDelegate(), async (controller) => {
  const size = await resizePlugin(controller, { width: 640, height: 480 })
  figma.showUI(__html__, { visible: true, ...size })

  notifyPlugin(controller)
  nodePlugin(controller, (node) => node as unknown as TreeNode)
  const logger = logPlugin(controller)

  controller.addRequestHandler('ping', (message) => {
    return `Hello, ${message}`
  })

  logger.info('controller initialized')
})

const uiController = createController(createUIDelegate())
const root = createRoot(document.getElementById('root')!)
root.render(
  <FigmaProvider controller={uiController}>
    <ClipboardProvider>
      <PluginWindow title="Figmania UI">
        <App />
      </PluginWindow>
    </ClipboardProvider>
  </FigmaProvider>
)
