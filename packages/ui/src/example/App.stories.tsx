import type { Meta, StoryObj } from '@storybook/react'
import { ClipboardProvider } from '../providers/ClipboardProvider'
import { App } from './App'
import { PluginWindow } from './PluginWindow'

const meta = { component: App } satisfies Meta<typeof App>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  render() {
    return (
      <ClipboardProvider>
        <PluginWindow title="Figmania UI" style={{ position: 'relative', top: 'unset', left: 'unset' }}>
          <App />
        </PluginWindow>
      </ClipboardProvider>
    )

  }
} satisfies Story
