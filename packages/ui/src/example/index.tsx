import { FunctionComponent } from 'react'
import { createRoot } from 'react-dom/client'
import { ClipboardProvider } from '..'
import { App } from './App'
import './index.scss'
import { PluginWindow } from './PluginWindow'

export const Example: FunctionComponent = () => {
  return (
    <ClipboardProvider>
      <PluginWindow title="Figmania UI">
        <App />
      </PluginWindow>
    </ClipboardProvider>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<Example />)
